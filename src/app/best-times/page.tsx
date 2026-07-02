import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeatmapChart } from "@/components/charts/HeatmapChart";
import { getHeatmapData, getFunnelStages } from "@/lib/mock-data";
import { formatCompactNumber, formatPercent } from "@/lib/utils";

export default function BestTimesPage() {
  const heatmapData = getHeatmapData();
  const funnel = getFunnelStages();

  const best = [...heatmapData]
    .filter((c) => c.calls >= 3)
    .sort((a, b) => b.conversion_rate - a.conversion_rate)
    .slice(0, 3);

  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function hourLabel(hour: number): string {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Best Times to Call</h1>
          <p className="text-sm text-zinc-500">
            Call volume and conversion rate by day and hour.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {best.map((cell, i) => (
            <Card key={`${cell.day}-${cell.hour}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">#{i + 1} Best Window</span>
                  <span className="text-xs text-green-400 font-medium">
                    {formatPercent(cell.conversion_rate)} conv.
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-zinc-100">
                  {DAY_NAMES[cell.day]}, {hourLabel(cell.hour)}
                </p>
                <p className="text-xs text-zinc-500">
                  {cell.calls} calls · {cell.bookings} booked
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Call Time Heatmap</CardTitle>
            <CardDescription>
              Darker cells indicate a higher booking conversion rate for that hour.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HeatmapChart data={heatmapData} metric="conversion_rate" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Dialed → Connected → Qualified → Booked → Showed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {funnel.map((stage, i) => (
                <div key={stage.label} className="relative">
                  <div className="rounded-lg border border-[#ffffff10] bg-[#ffffff05] p-4">
                    <p className="text-xs text-zinc-500">{stage.label}</p>
                    <p className="mt-1 text-xl font-semibold text-zinc-100">
                      {formatCompactNumber(stage.value)}
                    </p>
                    <p className="text-xs text-[#a5a6f6]">
                      {formatPercent(stage.percent)}
                    </p>
                  </div>
                  {i < funnel.length - 1 && (
                    <div className="hidden sm:block absolute top-1/2 -right-2.5 -translate-y-1/2 text-zinc-600 text-xs">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
