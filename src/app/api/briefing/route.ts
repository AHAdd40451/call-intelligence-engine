import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";
import { askClaude } from "@/lib/anthropic";
import type { AIAnalysis, ApiResponse, Call, DailyBriefing } from "@/types";

export const dynamic = "force-dynamic";

const BRIEFING_SYSTEM_PROMPT = `You are a sales operations analyst writing a short morning briefing
for a sales leader. Given the previous day's call stats, write 2-3 sentences that highlight
what changed, what needs attention, and one concrete next step. Be direct and specific.`;

export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const since = new Date();
    since.setDate(since.getDate() - 1);
    since.setHours(0, 0, 0, 0);

    const { data: calls, error: callsError } = await supabase
      .from("calls")
      .select("*, ai_analysis(*)")
      .gte("date", since.toISOString())
      .returns<(Call & { ai_analysis: AIAnalysis[] })[]>();

    if (callsError) {
      throw new Error(callsError.message);
    }

    const rows = calls ?? [];
    const totalCalls = rows.length;
    const booked = rows.filter((c) => c.outcome === "booked").length;
    const scores = rows
      .flatMap((c) => c.ai_analysis ?? [])
      .map((a) => a.overall_score);
    const avgScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    const setterCounts = new Map<string, number>();
    for (const call of rows) {
      setterCounts.set(call.setter, (setterCounts.get(call.setter) ?? 0) + 1);
    }
    const topPerformer = [...setterCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

    const objectionCounts = new Map<string, number>();
    for (const analysis of rows.flatMap((c) => c.ai_analysis ?? [])) {
      for (const objection of analysis.objections ?? []) {
        objectionCounts.set(objection, (objectionCounts.get(objection) ?? 0) + 1);
      }
    }
    const topObjection = [...objectionCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

    const bookingRate = totalCalls ? booked / totalCalls : 0;

    const summary = await askClaude({
      system: BRIEFING_SYSTEM_PROMPT,
      prompt: `Yesterday's stats — total calls: ${totalCalls}, avg AI score: ${avgScore},
booking rate: ${(bookingRate * 100).toFixed(0)}%, top performer: ${topPerformer ?? "n/a"},
top objection: ${topObjection ?? "n/a"}. Write the briefing.`,
      maxTokens: 300,
    });

    const briefing: DailyBriefing = {
      id: `briefing_${new Date().toISOString().slice(0, 10)}`,
      date: new Date().toISOString(),
      summary,
      total_calls: totalCalls,
      avg_score: avgScore,
      booking_rate: bookingRate,
      top_performer: topPerformer,
      top_objection: topObjection,
      highlights: [],
    };

    const { error: upsertError } = await supabase
      .from("daily_briefings")
      .upsert(briefing, { onConflict: "id" });

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    return NextResponse.json<ApiResponse<DailyBriefing>>({ success: true, data: briefing });
  } catch (err) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
