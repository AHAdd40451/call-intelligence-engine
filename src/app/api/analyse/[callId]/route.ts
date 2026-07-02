import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;
  const supabase = createServiceRoleClient();

  // Fetch call from DB
  const { data: call, error: callErr } = await supabase
    .from("calls")
    .select("*")
    .eq("id", callId)
    .single();

  if (callErr || !call) {
    return NextResponse.json({ error: "Call not found" }, { status: 404 });
  }
  if (!call.transcript) {
    return NextResponse.json({ error: "No transcript available for this call" }, { status: 400 });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const prompt = `You are an expert sales call analyst. Analyse this sales call transcript and return a JSON object with EXACTLY this structure (no extra keys, no markdown):

{
  "overall_score": <0-100 integer>,
  "rapport": <0-20>,
  "qualification": <0-20>,
  "discovery": <0-20>,
  "objection_handling": <0-20>,
  "urgency": <0-20>,
  "closing": <0-20>,
  "script_compliance": <0-20>,
  "communication": <0-20>,
  "buying_intent": "very_high" | "high" | "medium" | "low",
  "buying_intent_reason": "<1-2 sentences>",
  "pain_points": ["<pain point>", ...],
  "goals": ["<goal>", ...],
  "objections": ["<objection>", ...],
  "sentiment": ["<emotion>", ...],
  "missed_opportunities": ["<opportunity>", ...],
  "coaching_suggestions": ["<suggestion>", ...],
  "ai_summary": "<2-3 sentence summary>"
}

Rules:
- overall_score = average of all 8 dimension scores (0-100 scale)
- pain_points: list every problem the prospect mentioned
- goals: what the prospect wants to achieve
- objections: resistance points raised
- sentiment: emotions detected (excited, curious, nervous, skeptical, confident, hesitant)
- missed_opportunities: specific moments where setter could have done better
- coaching_suggestions: actionable coaching advice for the setter

TRANSCRIPT:
Setter: ${call.setter}
Lead: ${call.lead_name}

${call.transcript}`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Claude returned invalid JSON", raw }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Save AI summary back to call record
    await supabase
      .from("calls")
      .update({ ai_summary: analysis.ai_summary })
      .eq("id", callId);

    // Upsert analysis record
    const { error: analysisErr } = await supabase
      .from("ai_analysis")
      .upsert({
        call_id:             callId,
        overall_score:       analysis.overall_score,
        rapport:             analysis.rapport,
        qualification:       analysis.qualification,
        discovery:           analysis.discovery,
        objection_handling:  analysis.objection_handling,
        urgency:             analysis.urgency,
        closing:             analysis.closing,
        script_compliance:   analysis.script_compliance,
        communication:       analysis.communication,
        buying_intent:       analysis.buying_intent,
        buying_intent_reason:analysis.buying_intent_reason,
        pain_points:         analysis.pain_points,
        goals:               analysis.goals,
        objections:          analysis.objections,
        sentiment:           analysis.sentiment,
        missed_opportunities:analysis.missed_opportunities,
        coaching_suggestions:analysis.coaching_suggestions,
      }, { onConflict: "call_id" });

    if (analysisErr) {
      console.error("Analysis save error:", analysisErr);
    }

    return NextResponse.json({ ok: true, callId, analysis });

  } catch (e) {
    console.error("Claude analysis error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
