import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";
import type { Call, SyncResult, ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

const GHL_API_URL = "https://services.leadconnectorhq.com";

interface GhlCallActivity {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  userId: string;
  userName: string;
  dateAdded: string;
  duration: number;
  callStatus: string;
  recordingUrl?: string;
  transcript?: string;
}

interface GhlCallsResponse {
  calls: GhlCallActivity[];
}

function mapCallStatus(status: string): Call["outcome"] {
  const normalized = status.toLowerCase();
  if (normalized.includes("book") || normalized.includes("appointment")) return "booked";
  if (normalized.includes("callback")) return "callback";
  if (normalized.includes("voicemail")) return "voicemail";
  if (normalized.includes("no-answer") || normalized.includes("missed")) return "no_answer";
  return "not_interested";
}

export async function POST() {
  const startedAt = Date.now();

  try {
    const apiKey = process.env.GHL_API_KEY;
    if (!apiKey) {
      throw new Error("GHL_API_KEY is not configured");
    }

    const supabase = createServiceRoleClient();

    const res = await fetch(`${GHL_API_URL}/calls/?limit=100`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: "2021-07-28",
      },
    });

    if (!res.ok) {
      throw new Error(`GoHighLevel request failed: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as GhlCallsResponse;

    const rows: Call[] = (data.calls ?? []).map((call) => ({
      id: `ghl_${call.id}`,
      lead_name: call.contactName,
      phone: call.contactPhone,
      setter: call.userName,
      setter_id: call.userId,
      date: call.dateAdded,
      duration: call.duration,
      outcome: mapCallStatus(call.callStatus),
      recording_url: call.recordingUrl,
      transcript: call.transcript,
      source: "ghl",
      raw_id: call.id,
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
