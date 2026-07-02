"use client";

import { useMemo } from "react";
import type { HeatmapCell } from "@/types";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface HeatmapChartProps {
  data: HeatmapCell[];
  metric?: "calls" | "conversion_rate";
}

function hourLabel(hour: number): string {
  if (hour === 0) return "12a";
  if (hour === 12) return "12p";
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}

export function HeatmapChart({ data, metric = "conversion_rate" }: HeatmapChartProps) {
  const cellMap = useMemo(() => {
    const map = new Map<string, HeatmapCell>();
    for (const cell of data) {
      map.set(`${cell.day}-${cell.hour}`, cell);
    }
    return map;
  }, [data]);

  const maxValue = useMemo(() => {
    return Math.max(1, ...data.map((c) => (metric === "calls" ? c.calls : c.conversion_rate)));
  }, [data, metric]);

  function intensity(cell: HeatmapCell | undefined): number {
    if (!cell) return 0;
    const value = metric === "calls" ? cell.calls : cell.conversion_rate;
    return maxValue === 0 ? 0 : value / maxValue;
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="flex">
          <div className="w-10 shrink-0" />
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="flex-1 text-center text-[10px] text-zinc-500"
            >
              {hour % 3 === 0 ? hourLabel(hour) : ""}
            </div>
          ))}
        </div>
        {DAYS.map((dayLabel, dayIndex) => (
          <div key={dayLabel} className="flex items-center gap-[2px]">
            <div className="w-10 shrink-0 text-xs text-zinc-500">{dayLabel}</div>
            {HOURS.map((hour) => {
              const cell = cellMap.get(`${dayIndex}-${hour}`);
              const t = intensity(cell);
              return (
                <div
                  key={hour}
                  title={
                    cell
                      ? `${dayLabel} ${hourLabel(hour)} — ${cell.calls} calls, ${(
                          cell.conversion_rate * 100
                        ).toFixed(0)}% booked`
                      : `${dayLabel} ${hourLabel(hour)} — no data`
                  }
                  className={cn(
                    "flex-1 aspect-square rounded-[3px] transition-colors",
                    t === 0 && "bg-[#ffffff08]"
                  )}
                  style={
                    t > 0
                      ? {
                          backgroundColor: `rgba(99, 102, 241, ${0.15 + t * 0.75})`,
                        }
                      : undefined
                  }
                />
              );
            })}
          </div>
        ))}
        <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-zinc-500">
          <span>Less</span>
          {[0.15, 0.35, 0.55, 0.75, 0.9].map((t) => (
            <div
              key={t}
              className="h-2.5 w-2.5 rounded-[2px]"
              style={{ backgroundColor: `rgba(99, 102, 241, ${t})` }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
