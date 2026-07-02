import Link from "next/link";
import { Phone, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AIScoreBadge } from "@/components/features/AIScoreBadge";
import {
  formatDuration,
  formatDateTime,
  formatPhone,
  outcomeColor,
  outcomeLabel,
  getInitials,
} from "@/lib/utils";
import type { CallWithAnalysis } from "@/types";

interface CallCardProps {
  call: CallWithAnalysis;
}

export function CallCard({ call }: CallCardProps) {
  return (
    <Link href={`/transcripts/${call.id}`}>
      <Card className="p-4 flex items-center gap-4 hover:border-[#6366f1]/40 hover:bg-[#ffffff05] transition-colors">
        <Avatar>
          <AvatarFallback>{getInitials(call.lead_name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-zinc-100 truncate">
              {call.lead_name}
            </p>
            <Badge variant="outline" className="shrink-0">
              {call.source}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {formatPhone(call.phone)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(call.duration)}
            </span>
            <span>{call.setter}</span>
            <span>{formatDateTime(call.date)}</span>
          </div>
        </div>

        <Badge className={outcomeColor(call.outcome)} variant="outline">
          {outcomeLabel(call.outcome)}
        </Badge>

        {call.analysis && (
          <AIScoreBadge score={call.analysis.overall_score} size={44} strokeWidth={4} />
        )}
      </Card>
    </Link>
  );
}
