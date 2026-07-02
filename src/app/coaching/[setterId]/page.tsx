import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CallCard } from "@/components/features/CallCard";
import { AIScoreBadge } from "@/components/features/AIScoreBadge";
import { ScoreRadar } from "@/components/charts/ScoreRadar";
import { TrendLine } from "@/components/charts/TrendLine";
import {
  getSetterStats,
  mockCallsWithAnalysis,
  getTrendData,
  getScoreRadarData,
} from "@/lib/mock-data";
import { getInitials, formatPercent } from "@/lib/utils";

interface SetterDetailPageProps {
  params: Promise<{ setterId: string }>;
}

export default async function SetterDetailPage({ params }: SetterDetailPageProps) {
  const { setterId } = await params;
  const setter = getSetterStats().find((s) => s.setter_id === setterId);

  if (!setter) {
    notFound();
  }

  const calls = mockCallsWithAnalysis
    .filter((c) => c.setter_id === setterId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const analyses = calls.map((c) => c.analysis).filter((a): a is NonNullable<typeof a> => !!a);
  const avgRadar =
    analyses.length > 0
      ? getScoreRadarData({
          call_id: "",
          overall_score: setter.avg_score,
          rapport: Math.round(analyses.reduce((s, a) => s + a.rapport, 0) / analyses.length),
          qualification: Math.round(analyses.reduce((s, a) => s + a.qualification, 0) / analyses.length),
          discovery: Math.round(analyses.reduce((s, a) => s + a.discovery, 0) / analyses.length),
          objection_handling: Math.round(analyses.reduce((s, a) => s + a.objection_handling, 0) / analyses.length),
          urgency: Math.round(analyses.reduce((s, a) => s + a.urgency, 0) / analyses.length),
          closing: Math.round(analyses.reduce((s, a) => s + a.closing, 0) / analyses.length),
          script_compliance: Math.round(analyses.reduce((s, a) => s + a.script_compliance, 0) / analyses.length),
          communication: Math.round(analyses.reduce((s, a) => s + a.communication, 0) / analyses.length),
          buying_intent: "medium",
          buying_intent_reason: "",
          pain_points: [],
          goals: [],
          objections: [],
          sentiment: [],
          missed_opportunities: [],
          coaching_suggestions: [],
        })
      : [];

  const trend = getTrendData(14);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
            <Link href="/coaching">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Coaching
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{getInitials(setter.setter_name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-zinc-100">
                {setter.setter_name}
              </h1>
              <p className="text-sm text-zinc-500">
                {setter.total_calls} calls · {formatPercent(setter.booking_rate)} booking rate
              </p>
            </div>
            <AIScoreBadge score={setter.avg_score} className="ml-auto" />
          </div>
        </div>

        {setter.top_objection && (
          <Badge variant="outline">Most common objection: {setter.top_objection}</Badge>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {avgRadar.length > 0 ? (
                <ScoreRadar data={avgRadar} />
              ) : (
                <p className="text-sm text-zinc-500">No scored calls yet.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendLine data={trend} color="#8b5cf6" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {calls.length === 0 ? (
              <p className="text-sm text-zinc-500">No calls found for this setter.</p>
            ) : (
              calls.map((call) => <CallCard key={call.id} call={call} />)
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
