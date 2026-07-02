import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getInitials, formatPercent, scoreColor } from "@/lib/utils";
import type { SetterStats } from "@/types";

interface SetterCardProps {
  stats: SetterStats;
  rank?: number;
}

export function SetterCard({ stats, rank }: SetterCardProps) {
  const isPositiveTrend = stats.trend >= 0;

  return (
    <Link href={`/coaching/${stats.setter_id}`}>
      <Card className="p-4 flex items-center gap-4 hover:border-[#6366f1]/40 hover:bg-[#ffffff05] transition-colors">
        {rank !== undefined && (
          <div className="w-6 text-center text-sm font-semibold text-zinc-500">
            #{rank}
          </div>
        )}

        <Avatar className="h-10 w-10">
          <AvatarFallback>{getInitials(stats.setter_name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-100 truncate">
            {stats.setter_name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
            <span>{stats.total_calls} calls</span>
            <span>{formatPercent(stats.booking_rate)} booked</span>
            {stats.top_objection && (
              <Badge variant="outline" className="text-[10px]">
                Top objection: {stats.top_objection}
              </Badge>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className={cn("text-lg font-semibold", scoreColor(stats.avg_score))}>
            {stats.avg_score}
          </p>
          <div
            className={cn(
              "flex items-center justify-end gap-1 text-xs",
              isPositiveTrend ? "text-green-400" : "text-red-400"
            )}
          >
            {isPositiveTrend ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {formatPercent(Math.abs(stats.trend))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
