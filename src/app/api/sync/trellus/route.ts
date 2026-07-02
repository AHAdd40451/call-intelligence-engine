import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";
import { createTrellusClient, trellusTranscriptToText } from "@/lib/trellus";
import type { Call, SyncResult, ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

function mapDisposition(disposition: string): Call["outcome"] {
  const normalized = disposition.toLowerCase();
  if (normalized.includes("book")) return "booked";
  if (normalized.includes("callback")) return "callback";
  if (normalized.includes("voicemail")) return "voicemail";
  if (normalized.includes("no_answer") || normalized.includes("no answer")) return "no_answer";
  return "not_interested";
}

export async function POST() {
  const startedAt = Date.now();

  try {
    const trellus = createTrellusClient();
    const supabase = createServiceRoleClient();

    const to = new Date();
    const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
    const sessions = await trellus.listAllSessions({
      from: from.toISOString(),
      to: to.toISOString(),
      limit: 100,
    });

    const rows: Call[] = sessions.map((session) => ({
      id: `trellus_${session.id}`,
      lead_name: session.contact_name,
      phone: session.contact_phone,
      setter: session.agent_name,
      setter_id: session.agent_id,
      date: session.started_at,
      duration: session.duration_seconds,
      outcome: mapDisposition(session.disposition),
      recording_url: session.recording_url,
      transcript: trellusTranscriptToText(session.transcript),
      source: "trellus",
      raw_id: session.id,
    }));

    let created = 0;
    let errors = 0;

    if (rows.length > 0) {
      const { error, count } = await supabase
        .from("calls")
        .upsert(rows, { onConflict: "raw_id,source", count: "exact" });

      if (error) {
        errors = rows.length;
      } else {
        created = count ?? rows.length;
      }
    }

    const result: SyncResult = {
      synced: rows.length,
      created,
      updated: 0,
      errors,
      duration_ms: Date.now() - startedAt,
    };

    return NextResponse.json<ApiResponse<SyncResult>>({ success: errors === 0, data: result });
  } catch (err) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
