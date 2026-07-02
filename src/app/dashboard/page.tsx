import { Phone, Target, Calendar, AlertTriangle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AIScoreBadge } from "@/components/features/AIScoreBadge";
import { MorningBriefing } from "@/components/features/MorningBriefing";
import { TrendLine } from "@/components/charts/TrendLine";
import { ObjectionBar } from "@/components/charts/ObjectionBar";
import {
  getKpiSummary,
  getMorningBriefing,
  getTrendData,
  getCallVolumeTrend,
  getObjectionFrequency,
  mockCallsWithAnalysis,
} from "@/lib/mock-data";
import {
  cn,
  formatDuration,
  formatDateTime,
  formatPercent,
  outcomeColor,
  outcomeLabel,
  scoreColor,
} from "@/lib/utils";

function DeltaTag({ delta }: { delta: number }) {
  const positive = delta >= 0;
  return (
    <span className={cn("text-xs font-medium", positive ? "text-green-400" : "text-red-400")}>
      {positive ? "+" : ""}
      {formatPercent(delta)} vs last week
    </span>
  );
}

export default function DashboardPage() {
  const kpi = getKpiSummary();
  const briefing = getMorningBriefing();
  const scoreTrend = getTrendData(14);
  const volumeTrend = getCallVolumeTrend(14);
  const objections = getObjectionFrequency();
  const recentCalls = [...mockCallsWithAnalysis]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500">
            Overview of call performance across your team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Total Calls</span>
                <Phone className="h-4 w-4 text-[#6366f1]" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-zinc-100">
                {kpi.total_calls}
              </p>
              <DeltaTag delta={kpi.calls_delta} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Avg AI Score</span>
                <Target className="h-4 w-4 text-[#8b5cf6]" />
              </div>
              <p className={cn("mt-2 text-2xl font-semibold", scoreColor(kpi.avg_score))}>
                {kpi.avg_score}
              </p>
              <DeltaTag delta={kpi.score_delta} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Booking Rate</span>
                <Calendar className="h-4 w-4 text-green-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-zinc-100">
                {formatPercent(kpi.booking_rate)}
              </p>
              <DeltaTag delta={kpi.booking_delta} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Top Objection</span>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </div>
              <p className="mt-2 text-base font-medium text-zinc-100 leading-snug">
                {objections.sort((a, b) => b.frequency - a.frequency)[0]?.label}
              </p>
              <span className="text-xs text-zinc-500">
                {objections.sort((a, b) => b.frequency - a.frequency)[0]?.frequency} mentions this month
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MorningBriefing briefing={briefing} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Objection Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <ObjectionBar data={objections} height={240} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Avg Score — Last 14 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendLine data={scoreTrend} color="#8b5cf6" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Call Volume — Last 14 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendLine data={volumeTrend} color="#6366f1" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Setter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCalls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium text-zinc-100">
                      {call.lead_name}
                    </TableCell>
                    <TableCell>{call.setter}</TableCell>
                    <TableCell>{formatDateTime(call.date)}</TableCell>
                    <TableCell>{formatDuration(call.duration)}</TableCell>
                    <TableCell>
                      <Badge className={outcomeColor(call.outcome)} variant="outline">
                        {outcomeLabel(call.outcome)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {call.analysis && (
                        <AIScoreBadge
                          score={call.analysis.overall_score}
                          size={36}
                          strokeWidth={3}
                          className="ml-auto"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
