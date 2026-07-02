import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TranscriptViewer } from "@/components/features/TranscriptViewer";
import { mockCalls, mockAnalyses } from "@/lib/mock-data";
import { formatDateTime, formatDuration, outcomeColor, outcomeLabel } from "@/lib/utils";

interface TranscriptPageProps {
  params: Promise<{ id: string }>;
}

export default async function TranscriptDetailPage({ params }: TranscriptPageProps) {
  const { id } = await params;
  const call = mockCalls.find((c) => c.id === id);

  if (!call) {
    notFound();
  }

  const analysis = mockAnalyses[call.id];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
            <Link href="/transcripts">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Transcripts
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold text-zinc-100">{call.lead_name}</h1>
            <Badge className={outcomeColor(call.outcome)} variant="outline">
              {outcomeLabel(call.outcome)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {call.setter} · {formatDateTime(call.date)} · {formatDuration(call.duration)} ·{" "}
            {call.source === "trellus" ? "Trellus" : "GoHighLevel"}
          </p>
        </div>

        <TranscriptViewer call={call} analysis={analysis} />
      </div>
    </DashboardLayout>
  );
}
