import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

const GHL_BASE = "https://services.leadconnectorhq.com";

interface GHLCall {
  id: string;
  contactId: string;
  contactName?: string;
  phone?: string;
  userId?: string;
  userName?: string;
  dateAdded: string;
  duration?: number;
  status?: string;
  recordingUrl?: string;
  transcription?: string;
  direction?: string;
  type?: string;
}

interface GHLContact {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const GHL_KEY = process.env.GHL_API_KEY;
  if (!GHL_KEY) {
    return NextResponse.json({ error: "GHL_API_KEY not configured" }, { status: 500 });
  }

  const supabase = createServiceRoleClient();
  let synced = 0;
  let errors = 0;

  try {
    // Fetch calls from GHL
    const callsRes = await fetch(`${GHL_BASE}/conversations/search?type=call&limit=100`, {
      headers: {
        Authorization: `Bearer ${GHL_KEY}`,
        Version: "2021-04-15",
        "Content-Type": "application/json",
      },
    });

    if (!callsRes.ok) {
      const errText = await callsRes.text();
      return NextResponse.json({
        error: `GHL API error: ${callsRes.status}`,
        detail: errText,
      }, { status: 502 });
    }

    const callsData = await callsRes.json();
    const calls: GHLCall[] = callsData.conversations ?? callsData.calls ?? [];

    for (const call of calls) {
      try {
        // Map outcome from GHL status
        const outcomeMap: Record<string, string> = {
          completed: "callback",
          answered:  "callback",
          no_answer: "no_answer",
          voicemail: "voicemail",
          busy:      "no_answer",
        };
        const outcome = outcomeMap[call.status ?? ""] ?? "callback";

        const record = {
          id:            `ghl_${call.id}`,
          lead_name:     call.contactName ?? "Unknown",
          phone:         call.phone ?? "",
          setter:        call.userName ?? "Unknown",
          setter_id:     call.userId ?? "unknown",
          date:          call.dateAdded,
          duration:      call.duration ?? 0,
          outcome,
          recording_url: call.recordingUrl ?? null,
          transcript:    call.transcription ?? null,
          ai_summary:    null,
          source:        "ghl",
          raw_id:        call.id,
        };

        const { error } = await supabase
          .from("calls")
          .upsert(record, { onConflict: "raw_id,source" });

        if (error) { console.error("GHL upsert error:", error); errors++; }
        else synced++;
      } catch (e) {
        console.error("Failed to process GHL call:", call.id, e);
        errors++;
      }
    }

    return NextResponse.json({
      ok: true,
      synced,
      errors,
      total: calls.length,
      source: "ghl",
    });

  } catch (e) {
    console.error("GHL sync error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "GHL sync endpoint ready. Send POST to trigger sync." });
}
