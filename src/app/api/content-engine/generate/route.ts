import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const supabase = createServiceRoleClient();

  // Gather recent analysis data for context
  const { data: analyses } = await supabase
    .from("ai_analysis")
    .select("pain_points, goals, objections, buying_intent")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: calls } = await supabase
    .from("calls")
    .select("transcript, lead_name, setter, outcome")
    .not("transcript", "is", null)
    .order("created_at", { ascending: false })
    .limit(20);

  // Aggregate pain points and objections
  const allPainPoints  = (analyses ?? []).flatMap(a => a.pain_points  ?? []);
  const allObjections  = (analyses ?? []).flatMap(a => a.objections   ?? []);
  const allGoals       = (analyses ?? []).flatMap(a => a.goals        ?? []);

  const topPains    = [...new Set(allPainPoints)].slice(0, 10).join(", ");
  const topObjects  = [...new Set(allObjections)].slice(0, 8).join(", ");
  const topGoals    = [...new Set(allGoals)].slice(0, 8).join(", ");

  const sampleTranscripts = (calls ?? [])
    .filter(c => c.transcript)
    .slice(0, 5)
    .map(c => `[${c.outcome}] ${c.transcript?.slice(0, 300)}…`)
    .join("\n\n");

  const prompt = `You are a content strategist for a trading education company targeting FIFO workers, people wanting a second income, and those seeking financial freedom.

Based on these real insights from ${analyses?.length ?? 0} analysed sales calls:

TOP PAIN POINTS: ${topPains || "FIFO lifestyle, wanting family time, second income, financial freedom"}
TOP OBJECTIONS: ${topObjects || "Not enough time, partner concerns, money, fear, scam worries"}
TOP GOALS: ${topGoals || "Replace income, learn trading, travel, retire early, spend time with kids"}

SAMPLE CALL EXCERPTS:
${sampleTranscripts || "FIFO worker wanting second income and more family time."}

Generate 6 content ideas as a JSON array. Each idea must have this exact structure:
[
  {
    "type": "instagram_reel" | "email" | "podcast" | "webinar" | "faq" | "marketing_copy",
    "title": "<specific compelling title>",
    "description": "<2-3 sentence description of what to create and why it will resonate>",
    "source_insight": "<which pain point / objection / goal this targets>",
    "estimated_reach": "high" | "medium" | "low"
  }
]

Make titles specific and punchy. Use the exact language customers use. Include at least 1 of each: reel, email, podcast.
Return ONLY valid JSON array, no markdown.`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "[]";
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid response from Claude", raw }, { status: 500 });
    }

    const ideas = JSON.parse(jsonMatch[0]);

    // Save to DB
    const toInsert = ideas.map((idea: Record<string, string>) => ({
      type:            idea.type,
      title:           idea.title,
      description:     idea.description,
      source_call_ids: [],
      status:          "new",
    }));

    const { data: saved, error: saveErr } = await supabase
      .from("content_ideas")
      .insert(toInsert)
      .select();

    if (saveErr) console.error("Save content ideas error:", saveErr);

    return NextResponse.json({ ok: true, count: ideas.length, ideas, saved });

  } catch (e) {
    console.error("Content engine error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("content_ideas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return NextResponse.json({ ideas: data ?? [] });
}
