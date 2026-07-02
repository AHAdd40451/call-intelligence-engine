import {
  Clapperboard,
  Mail,
  Mic,
  Presentation,
  HelpCircle,
  PenLine,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { ContentIdea, ContentIdeaType } from "@/types";

const TYPE_META: Record<
  ContentIdeaType,
  { label: string; icon: typeof Clapperboard; color: string }
> = {
  instagram_reel: {
    label: "Instagram Reel",
    icon: Clapperboard,
    color: "text-pink-400",
  },
  email: { label: "Email", icon: Mail, color: "text-blue-400" },
  podcast: { label: "Podcast", icon: Mic, color: "text-violet-400" },
  webinar: { label: "Webinar", icon: Presentation, color: "text-indigo-400" },
  faq: { label: "FAQ", icon: HelpCircle, color: "text-green-400" },
  marketing_copy: {
    label: "Marketing Copy",
    icon: PenLine,
    color: "text-yellow-400",
  },
};

const STATUS_VARIANT: Record<ContentIdea["status"], "default" | "success" | "secondary"> = {
  new: "default",
  reviewed: "secondary",
  used: "success",
};

interface ContentIdeaCardProps {
  idea: ContentIdea;
}

export function ContentIdeaCard({ idea }: ContentIdeaCardProps) {
  const meta = TYPE_META[idea.type];
  const Icon = meta.icon;

  return (
    <Card className="flex flex-col h-full hover:border-[#6366f1]/30 transition-colors">
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffffff08] ${meta.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <Badge variant="outline">{meta.label}</Badge>
        </div>
        <Badge variant={STATUS_VARIANT[idea.status]} className="capitalize">
          {idea.status}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2">
        <CardTitle className="text-sm font-semibold text-zinc-100">
          {idea.title}
        </CardTitle>
        <p className="text-xs text-zinc-400 leading-relaxed flex-1">
          {idea.description}
        </p>
        <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-500">
          <span>{idea.source_call_ids.length} source call(s)</span>
          <span>{formatDate(idea.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
