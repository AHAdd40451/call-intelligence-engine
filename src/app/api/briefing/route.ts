import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET(req: NextRequest) {
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const supabase = createServiceRoleClient();

  // Gather stats for the past 7 days
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [callsRes, analysisRes, prevCallsRes] = await Promise.all([
    supabase.from("calls").select("id,outcome,setter,date,duration").gte("date", since),
    supabase.from("ai_analysis").select("overall_score,buying_intent,pain_points,objections,coaching_suggestions").gte("created_at", since),
    supabase.from("calls").select("id").gte("date", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()).lt("date", since),
  ]);

  const calls    = callsRes.data    ?? [];
  const analyses = analysisRes.data ?? [];
  const prevCalls = prevCallsRes.data ?? [];

  const totalCalls   = calls.length;
  const booked       = calls.filter(c => c.outcome === "booked").length;
  const bookRate     = totalCalls > 0 ? ((booked / totalCalls) * 100).toFixed(1) : "0";
  const avgScore     = analyses.length > 0 ? Math.round(analyses.reduce((a, c) => a + (c.overall_score ?? 0), 0) / analyses.length) : 0;
  const prevTotal    = prevCalls.length;
  const callsChange  = prevTotal > 0 ? (((totalCalls - prevTotal) / prevTotal) * 100).toFixed(1) : "N/A";

  const allPainPoints = analyses.flatMap(a => a.pain_points ?? []);
  const allObjections = analyses.flatMap(a => a.objections ?? []);
  const allSuggestions = analyses.flatMap(a => a.coaching_suggestions ?? []);

  // Count frequencies
  const freq = (arr: string[]) => {
    const counts: Record<string, number> = {};
    arr.forEach(v => { counts[v] = (counts[v] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  };

  const topPains     = freq(allPainPoints);
  const topObjections = freq(allObjections);
  const topSuggestions = freq(allSuggestions);

  const statsContext = `
WEEK SUMMARY (last 7 days):
- Total calls: ${totalCalls} (${callsChange}% vs prior week)
- Booked: ${booked} (${bookRate}% booking rate)
- Avg AI Score: ${avgScore}/100

TOP PAIN POINTS:
${topPains.map(([p, n]) => `- ${p}: ${n} times`).join("\n") || "- No data yet"}

TOP OBJECTIONS:
${topObjections.map(([o, n]) => `- ${o}: ${n} times`).join("\n") || "- No data yet"}

TOP COACHING NEEDS:
${topSuggestions.map(([s, n]) => `- ${s}: ${n} setters`).join("\n") || "- No data yet"}
  `.trim();

  const prompt = `You are an executive AI analyst for a trading education sales team. Write a concise morning briefing based on this week's call data.

${statsContext}

Write a morning briefing in this EXACT JSON format:
{
  "headline": "<one punchy sentence summarising the week>",
  "insights": [
    "<specific data-driven insight with numbers>",
    "<specific data-driven insight with numbers>",
    "<specific data-driven insight with numbers>",
    "<specific data-driven insight with numbers>",
    "<specific data-driven insight with numbers>"
  ],
  "recommendations": [
    "<specific actionable recommendation>",
    "<specific actionable recommendation>",
    "<specific actionable recommendation>"
  ],
  "content_suggestions": [
    "<content idea based on trends>",
    "<content idea based on trends>"
  ],
  "focus_for_today": "<one specific thing the team should focus on today>"
}

Be specific with numbers. Reference the actual data. Return ONLY valid JSON.`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "{}";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid Claude response", raw }, { status: 500 });
    }

    const briefing = JSON.parse(jsonMatch[0]);

    // Save briefing to DB
    await supabase.from("daily_briefings").upsert({
      date:    new Date().toISOString().split("T")[0],
      content: briefing,
      stats: {
        total_calls: totalCalls,
        booked,
        book_rate: bookRate,
        avg_score: avgScore,
        top_pain_points:  topPains.map(([p, n]) => ({ label: p, count: n })),
        top_objections:   topObjections.map(([o, n]) => ({ label: o, count: n })),
      },
    }, { onConflict: "date" });

    return NextResponse.json({
      ok: true,
      date: new Date().toISOString().split("T")[0],
      stats: { totalCalls, booked, bookRate, avgScore },
      briefing,
    });

  } catch (e) {
    console.error("Briefing error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
