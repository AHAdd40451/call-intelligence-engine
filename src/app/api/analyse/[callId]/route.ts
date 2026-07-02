import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";
import { askClaudeForJSON } from "@/lib/anthropic";
import type { AIAnalysis, ApiResponse, Call } from "@/types";

export const dynamic = "force-dynamic";

const ANALYSIS_SYSTEM_PROMPT = `You are an expert sales call analyst. You score outbound sales calls
on an 0-100 scale across several dimensions, extract structured signals, and give
concise, actionable coaching feedback. Be honest and specific — do not inflate scores.`;

interface ClaudeAnalysisShape {
  overall_score: number;
  rapport: number;
  qualification: number;
  discovery: number;
  objection_handling: number;
  urgency: number;
  closing: number;
  script_compliance: number;
  communication: number;
  buying_intent: AIAnalysis["buying_intent"];
  buying_intent_reason: string;
  pain_points: string[];
  goals: string[];
  objections: string[];
  sentiment: string[];
  missed_opportunities: string[];
  coaching_suggestions: string[];
}

function buildPrompt(call: Call): string {
  return `Analyze this sales call transcript and return a JSON object with exactly these keys:
overall_score, rapport, qualification, discovery, objection_handling, urgency, closing,
script_compliance, communication (all integers 0-100), buying_intent (one of "very_high",
"high", "medium", "low"), buying_intent_reason (string), pain_points (string array),
goals (string array), objections (string array), sentiment (string array of tone words),
missed_opportunities (string array), coaching_suggestions (string array).

Call outcome: ${call.outcome}
Duration: ${call.duration} seconds

Transcript:
${call.transcript ?? "(no transcript available)"}`;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;

  try {
    const supabase = createServiceRoleClient();

    const { data: call, error: callError } = await supabase
      .from("calls")
      .select("*")
      .eq("id", callId)
      .single<Call>();

    if (callError || !call) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Call not found" },
        { status: 404 }
      );
    }

    if (!call.transcript) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Call has no transcript to analyze" },
        { status: 400 }
      );
    }

    const result = await askClaudeForJSON<ClaudeAnalysisShape>({
      system: ANALYSIS_SYSTEM_PROMPT,
      prompt: buildPrompt(call),
      maxTokens: 1536,
    });

    const analysis: AIAnalysis = {
      call_id: call.id,
      ...result,
    };

    const { error: upsertError } = await supabase
      .from("ai_analysis")
      .upsert(analysis, { onConflict: "call_id" });

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    return NextResponse.json<ApiResponse<AIAnalysis>>({ success: true, data: analysis });
  } catch (err) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
