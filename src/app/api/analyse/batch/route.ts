import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";
import type { ApiResponse, Call } from "@/types";

export const dynamic = "force-dynamic";

interface BatchQueueResult {
  queued: number;
  call_ids: string[];
}

/**
 * Finds calls with a transcript that have not yet been analyzed and queues
 * them for analysis by calling POST /api/analyse/[callId] for each. Runs
 * requests with limited concurrency to stay within Anthropic rate limits.
 */
export async function POST(req: Request) {
  try {
    const supabase = createServiceRoleClient();
    const { limit = 25 } = await req.json().catch(() => ({ limit: 25 }));

    const { data: calls, error } = await supabase
      .from("calls")
      .select("id, transcript, ai_analysis(call_id)")
      .not("transcript", "is", null)
      .is("ai_analysis.call_id", null)
      .limit(limit)
      .returns<Pick<Call, "id" | "transcript">[]>();

    if (error) {
      throw new Error(error.message);
    }

    const callIds = (calls ?? []).map((c) => c.id);
    const baseUrl = new URL(req.url).origin;
    const concurrency = 3;

    for (let i = 0; i < callIds.length; i += concurrency) {
      const batch = callIds.slice(i, i + concurrency);
      await Promise.allSettled(
        batch.map((callId) =>
          fetch(`${baseUrl}/api/analyse/${callId}`, { method: "POST" })
        )
      );
    }

    const result: BatchQueueResult = { queued: callIds.length, call_ids: callIds };

    return NextResponse.json<ApiResponse<BatchQueueResult>>({ success: true, data: result });
  } catch (err) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
