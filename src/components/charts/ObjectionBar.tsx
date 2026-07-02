"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Objection } from "@/types";

interface ObjectionBarProps {
  data: Objection[];
  height?: number;
}

const BAR_COLORS = ["#6366f1", "#7c6ff2", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

export function ObjectionBar({ data, height = 280 }: ObjectionBarProps) {
  const sorted = [...data].sort((a, b) => b.frequency - a.frequency).slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={140}
          tick={{ fill: "#d4d4d8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "#ffffff08" }}
          contentStyle={{
            backgroundColor: "#111118",
            border: "1px solid #ffffff1a",
            borderRadius: 8,
            fontSize: 12,
            color: "#e4e4e7",
          }}
        />
        <Bar dataKey="frequency" radius={[0, 4, 4, 0]} barSize={16}>
          {sorted.map((entry, index) => (
            <Cell key={entry.id} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
