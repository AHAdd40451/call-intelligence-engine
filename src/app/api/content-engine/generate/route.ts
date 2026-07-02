import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";
import { askClaudeForJSON } from "@/lib/anthropic";
import type { ApiResponse, Call, ContentIdea, ContentIdeaType } from "@/types";

export const dynamic = "force-dynamic";

const CONTENT_SYSTEM_PROMPT = `You are a content strategist for a sales organization. You read recent
sales call transcripts and summaries, then propose specific, ready-to-brief content ideas
(social, email, podcast, webinar, FAQ, marketing copy) grounded in what real prospects said.
Prefer concrete, quotable language over generic advice.`;

interface ClaudeContentIdea {
  type: ContentIdeaType;
  title: string;
  description: string;
  source_call_ids: string[];
}

function buildPrompt(calls: Pick<Call, "id" | "ai_summary" | "transcript">[]): string {
  const transcriptBlocks = calls
    .map(
      (call) =>
        `Call ${call.id}:\nSummary: ${call.ai_summary ?? "n/a"}\nTranscript excerpt: ${(
          call.transcript ?? ""
        ).slice(0, 800)}`
    )
    .join("\n\n---\n\n");

  return `Based on the following recent sales call transcripts, generate 4-8 content ideas.
Return a JSON array where each item has exactly these keys: type (one of "instagram_reel",
"email", "podcast", "webinar", "faq", "marketing_copy"), title (string), description (string,
2-3 sentences explaining the angle and why it will resonate), source_call_ids (array of the
call IDs referenced from the input, e.g. ["call_12"]).

${transcriptBlocks}`;
}

export async function POST() {
  try {
    const supabase = createServiceRoleClient();

    const { data: calls, error } = await supabase
      .from("calls")
      .select("id, ai_summary, transcript")
      .not("transcript", "is", null)
      .order("date", { ascending: false })
      .limit(20)
      .returns<Pick<Call, "id" | "ai_summary" | "transcript">[]>();

    if (error) {
      throw new Error(error.message);
    }

    if (!calls || calls.length === 0) {
      return NextResponse.json<ApiResponse<ContentIdea[]>>({ success: true, data: [] });
    }

    const ideas = await askClaudeForJSON<ClaudeContentIdea[]>({
      system: CONTENT_SYSTEM_PROMPT,
      prompt: buildPrompt(calls),
      maxTokens: 2048,
    });

    const now = new Date().toISOString();
    const rows: ContentIdea[] = ideas.map((idea, index) => ({
      id: `idea_${Date.now()}_${index}`,
      type: idea.type,
      title: idea.title,
      description: idea.description,
      source_call_ids: idea.source_call_ids,
      created_at: now,
      status: "new",
    }));

    const { error: insertError } = await supabase.from("content_ideas").insert(rows);
    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json<ApiResponse<ContentIdea[]>>({ success: true, data: rows });
  } catch (err) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
