import { Sparkles, Trophy, TrendingUp, PhoneCall } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatPercent } from "@/lib/utils";
import type { DailyBriefing } from "@/types";

interface MorningBriefingProps {
  briefing: DailyBriefing;
}

export function MorningBriefing({ briefing }: MorningBriefingProps) {
  return (
    <Card className="relative overflow-hidden border-[#6366f1]/20 bg-gradient-to-br from-[#111118] to-[#151520]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#6366f1]/10 blur-3xl" />
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6366f1]/15 text-[#a5a6f6]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <CardTitle>Morning Briefing</CardTitle>
          <p className="text-xs text-zinc-500">{formatDate(briefing.date)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-300 leading-relaxed">{briefing.summary}</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-[#ffffff10] bg-[#ffffff05] p-3">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
              <PhoneCall className="h-3 w-3" /> Calls
            </div>
            <p className="mt-1 text-lg font-semibold text-zinc-100">
              {briefing.total_calls}
            </p>
          </div>
          <div className="rounded-lg border border-[#ffffff10] bg-[#ffffff05] p-3">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
              <TrendingUp className="h-3 w-3" /> Avg Score
            </div>
            <p className="mt-1 text-lg font-semibold text-zinc-100">
              {briefing.avg_score}
            </p>
          </div>
          <div className="rounded-lg border border-[#ffffff10] bg-[#ffffff05] p-3">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
              <Trophy className="h-3 w-3" /> Booking Rate
            </div>
            <p className="mt-1 text-lg font-semibold text-zinc-100">
              {formatPercent(briefing.booking_rate)}
            </p>
          </div>
        </div>

        {(briefing.top_performer || briefing.top_objection) && (
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-400">
            {briefing.top_performer && (
              <span>
                Top performer:{" "}
                <span className="text-zinc-200 font-medium">
                  {briefing.top_performer}
                </span>
              </span>
            )}
            {briefing.top_objection && (
              <span>
                Top objection:{" "}
                <span className="text-zinc-200 font-medium">
                  {briefing.top_objection}
                </span>
              </span>
            )}
          </div>
        )}

        {briefing.highlights.length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {briefing.highlights.map((highlight, index) => (
              <li key={index} className="text-xs text-zinc-400 flex gap-2">
                <span className="text-[#8b5cf6] mt-0.5">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
