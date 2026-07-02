"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ScoreRadarPoint } from "@/types";

interface ScoreRadarProps {
  data: ScoreRadarPoint[];
  height?: number;
}

export function ScoreRadar({ data, height = 300 }: ScoreRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="#ffffff14" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: "#a1a1aa", fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: "#71717a", fontSize: 10 }}
          axisLine={false}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.35}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111118",
            border: "1px solid #ffffff1a",
            borderRadius: 8,
            fontSize: 12,
            color: "#e4e4e7",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
