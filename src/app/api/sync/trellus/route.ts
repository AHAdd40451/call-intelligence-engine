import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

const EXT_HOST = "https://ext.trellus.ai";
const RPT_HOST = "https://rpt-2.trellus.ai";

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const TRELLUS_KEY = process.env.TRELLUS_API_KEY;
  if (!TRELLUS_KEY) {
    return NextResponse.json({ error: "TRELLUS_API_KEY not configured" }, { status: 500 });
  }

  const supabase = createServiceRoleClient();
  let synced = 0;
  let errors = 0;

  try {
    // 1. Bootstrap to get account + rep list
    const bootstrapRes = await fetch(`${EXT_HOST}/bootstrap`, {
      headers: { api_key: TRELLUS_KEY },
    });
    if (!bootstrapRes.ok) {
      return NextResponse.json({ error: `Trellus bootstrap failed: ${bootstrapRes.status}` }, { status: 502 });
    }
    const bootstrap = await bootstrapRes.json();
    const teamId: string = bootstrap.user_info?.team_id ?? "";
    const reps: Array<{ resource_id: string; name: string }> =
      bootstrap.reps ?? bootstrap.team_members ?? [];

    // 2. Fetch sessions (calls) from reporting API
    const sessionsRes = await fetch(`${RPT_HOST}/metric-details-v6`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TRELLUS_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team_id: teamId,
        start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        end_date:   new Date().toISOString().split("T")[0],
        limit: 200,
      }),
    });

    if (!sessionsRes.ok) {
      return NextResponse.json({ error: `Trellus sessions failed: ${sessionsRes.status}` }, { status: 502 });
    }

    const sessionsData = await sessionsRes.json();
    const sessions: Array<Record<string, unknown>> = sessionsData.sessions ?? sessionsData.data ?? [];

    const repMap = Object.fromEntries(reps.map(r => [r.resource_id, r.name]));

    for (const session of sessions) {
      try {
        const rawId = String(session.session_id ?? session.id ?? "");
        if (!rawId) continue;

        const setterId  = String(session.resource_id ?? session.rep_id ?? "");
        const setterName = repMap[setterId] ?? String(session.rep_name ?? "Unknown");
        const durationSec = Number(session.call_duration_seconds ?? session.duration ?? 0);

        // Outcome mapping
        const disposition = String(session.disposition ?? session.outcome ?? "").toLowerCase();
        let outcome = "no_answer";
        if (disposition.includes("book") || disposition.includes("appoint"))   outcome = "booked";
        else if (disposition.includes("callback") || disposition.includes("follow")) outcome = "callback";
        else if (disposition.includes("not") || disposition.includes("refuse"))  outcome = "not_interested";
        else if (disposition.includes("voicemail"))                               outcome = "voicemail";
        else if (durationSec > 30)                                                outcome = "callback";

        const record = {
          id:            `trellus_${rawId}`,
          lead_name:     String(session.contact_name ?? session.lead_name ?? "Unknown"),
          phone:         String(session.phone_number ?? session.phone ?? ""),
          setter:        setterName,
          setter_id:     setterId || "unknown",
          date:          String(session.start_time ?? session.created_at ?? new Date().toISOString()),
          duration:      durationSec,
          outcome,
          recording_url: String(session.recording_url ?? "") || null,
          transcript:    String(session.transcript ?? "") || null,
          ai_summary:    null,
          source:        "trellus",
          raw_id:        rawId,
        };

        const { error } = await supabase
          .from("calls")
          .upsert(record, { onConflict: "raw_id,source" });

        if (error) { console.error("Trellus upsert error:", error.message); errors++; }
        else synced++;
      } catch (e) {
        console.error("Failed to process session:", e);
        errors++;
      }
    }

    return NextResponse.json({
      ok: true,
      synced,
      errors,
      total: sessions.length,
      source: "trellus",
      reps: reps.length,
    });

  } catch (e) {
    console.error("Trellus sync error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Trellus sync endpoint ready. Send POST to trigger sync." });
}
