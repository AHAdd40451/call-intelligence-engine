import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const { limit = 10 } = await req.json().catch(() => ({}));

  // Find calls with transcript but no AI analysis yet
  const { data: calls, error } = await supabase
    .from("calls")
    .select("id")
    .not("transcript", "is", null)
    .not("transcript", "eq", "")
    .is("ai_summary", null)
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const results: Array<{ callId: string; status: string; error?: string }> = [];

  for (const call of calls ?? []) {
    try {
      const res = await fetch(`${baseUrl}/api/analyse/${call.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cron-secret": process.env.CRON_SECRET ?? "",
        },
      });
      const data = await res.json();
      results.push({ callId: call.id, status: res.ok ? "ok" : "error", error: data.error });
    } catch (e) {
      results.push({ callId: call.id, status: "error", error: String(e) });
    }
    // Rate limit: 1 req/sec to stay well within Claude API limits
    await new Promise(r => setTimeout(r, 1000));
  }

  const succeeded = results.filter(r => r.status === "ok").length;
  const failed    = results.filter(r => r.status === "error").length;

  return NextResponse.json({ ok: true, queued: calls?.length ?? 0, succeeded, failed, results });
}

export async function GET() {
  const supabase = createServiceRoleClient();
  const { count: totalCalls }    = await supabase.from("calls").select("*", { count:"exact", head:true });
  const { count: analysedCalls } = await supabase.from("ai_analysis").select("*", { count:"exact", head:true });
  const { count: pending }       = await supabase.from("calls")
    .select("*", { count:"exact", head:true })
    .not("transcript","is",null).is("ai_summary",null);

  return NextResponse.json({ totalCalls, analysedCalls, pendingAnalysis: pending });
}
