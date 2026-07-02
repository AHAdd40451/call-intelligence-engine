"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIScoreBadge } from "@/components/features/AIScoreBadge";
import { cn, scoreColor } from "@/lib/utils";
import type { Call, AIAnalysis } from "@/types";

interface TranscriptViewerProps {
  call: Call;
  analysis?: AIAnalysis;
}

const SCORE_METRICS: { key: keyof AIAnalysis; label: string }[] = [
  { key: "rapport", label: "Rapport" },
  { key: "qualification", label: "Qualification" },
  { key: "discovery", label: "Discovery" },
  { key: "objection_handling", label: "Objection Handling" },
  { key: "urgency", label: "Urgency" },
  { key: "closing", label: "Closing" },
  { key: "script_compliance", label: "Script Compliance" },
  { key: "communication", label: "Communication" },
];

function parseTranscript(transcript?: string) {
  if (!transcript) return [];
  return transcript
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(Setter|Lead):\s*(.*)$/i);
      if (!match) return { speaker: "Setter" as const, text: line };
      return {
        speaker: (match[1].toLowerCase() === "lead" ? "Lead" : "Setter") as
          | "Setter"
          | "Lead",
        text: match[2],
      };
    });
}

export function TranscriptViewer({ call, analysis }: TranscriptViewerProps) {
  const lines = parseTranscript(call.transcript);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[560px] pr-4">
            {lines.length === 0 ? (
              <p className="text-sm text-zinc-500">No transcript available.</p>
            ) : (
              <div className="space-y-4">
                {lines.map((line, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex flex-col gap-1 max-w-[85%]",
                      line.speaker === "Setter" ? "items-start" : "items-end ml-auto"
                    )}
                  >
                    <span className="text-[10px] uppercase tracking-wide text-zinc-500">
                      {line.speaker}
                    </span>
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        line.speaker === "Setter"
                          ? "bg-[#1a1a24] text-zinc-200"
                          : "bg-[#6366f1]/15 text-zinc-100"
                      )}
                    >
                      {line.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
          <CardTitle>AI Analysis</CardTitle>
          {analysis && <AIScoreBadge score={analysis.overall_score} />}
        </CardHeader>
        <CardContent>
          {!analysis ? (
            <p className="text-sm text-zinc-500">
              This call has not been analyzed yet.
            </p>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium text-zinc-400 mb-1">
                  Buying Intent
                </p>
                <Badge variant="violet" className="capitalize">
                  {analysis.buying_intent.replace("_", " ")}
                </Badge>
                <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                  {analysis.buying_intent_reason}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                {SCORE_METRICS.map(({ key, label }) => {
                  const value = analysis[key] as number;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-zinc-400">{label}</span>
                        <span className={cn("font-medium", scoreColor(value))}>
                          {value}
                        </span>
                      </div>
                      <Progress value={value} />
                    </div>
                  );
                })}
              </div>

              <Separator />

              <AnalysisList title="Pain Points" items={analysis.pain_points} />
              <AnalysisList title="Goals" items={analysis.goals} />
              <AnalysisList title="Objections" items={analysis.objections} />
              <AnalysisList
                title="Missed Opportunities"
                items={analysis.missed_opportunities}
              />
              <AnalysisList
                title="Coaching Suggestions"
                items={analysis.coaching_suggestions}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AnalysisList({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-medium text-zinc-400 mb-2">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-xs text-zinc-300 leading-relaxed flex gap-2"
          >
            <span className="text-[#6366f1] mt-0.5">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
