import { Trophy } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SetterCard } from "@/components/features/SetterCard";
import { TrendLine } from "@/components/charts/TrendLine";
import { getSetterStats, getTrendData } from "@/lib/mock-data";
import { formatPercent, scoreColor, cn } from "@/lib/utils";

export default function CoachingPage() {
  const setters = getSetterStats();
  const teamAvg = Math.round(
    setters.reduce((sum, s) => sum + s.avg_score, 0) / setters.length
  );
  const teamBookingRate =
    setters.reduce((sum, s) => sum + s.booking_rate, 0) / setters.length;
  const teamTrend = getTrendData(14);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Coaching</h1>
          <p className="text-sm text-zinc-500">
            Setter leaderboard and team performance trends.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-xs text-zinc-500">Team Avg Score</span>
              <p className={cn("mt-2 text-2xl font-semibold", scoreColor(teamAvg))}>
                {teamAvg}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <span className="text-xs text-zinc-500">Team Booking Rate</span>
              <p className="mt-2 text-2xl font-semibold text-zinc-100">
                {formatPercent(teamBookingRate)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <span className="text-xs text-zinc-500">Active Setters</span>
              <p className="mt-2 text-2xl font-semibold text-zinc-100">
                {setters.length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLine data={teamTrend} color="#8b5cf6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {setters.map((stats, i) => (
              <SetterCard key={stats.setter_id} stats={stats} rank={i + 1} />
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
