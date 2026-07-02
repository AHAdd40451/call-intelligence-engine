"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { SentimentPoint } from "@/types";

interface SentimentFlowProps {
  data: SentimentPoint[];
  height?: number;
}

export function SentimentFlow({ data, height = 220 }: SentimentFlowProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" vertical={false} />
        <XAxis
          dataKey="index"
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={{ stroke: "#ffffff14" }}
          tickLine={false}
          label={{
            value: "Call progression",
            position: "insideBottom",
            offset: -2,
            fill: "#52525b",
            fontSize: 10,
          }}
        />
        <YAxis
          domain={[-1, 1]}
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <ReferenceLine y={0} stroke="#ffffff20" />
        <Tooltip
          formatter={(value, _name, props) => [
            Number(value).toFixed(2),
            props.payload?.speaker === "setter" ? "Setter" : "Lead",
          ]}
          labelFormatter={() => ""}
          contentStyle={{
            backgroundColor: "#111118",
            border: "1px solid #ffffff1a",
            borderRadius: 8,
            fontSize: 12,
            color: "#e4e4e7",
          }}
        />
        <Line
          type="monotone"
          dataKey="sentiment_score"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 2, fill: "#22c55e", strokeWidth: 0 }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
