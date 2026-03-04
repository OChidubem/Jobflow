"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Job } from "@/types";

interface ApplicationsChartProps {
  jobs: Job[];
}

export function ApplicationsChart({ jobs }: ApplicationsChartProps) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date;
  });

  const data = days.map((date) => {
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const count = jobs.filter((job) => {
      if (!job.appliedAt) return false;
      const appliedDate = new Date(job.appliedAt);
      return appliedDate.toDateString() === date.toDateString();
    }).length;

    return { date: dateStr, applications: count };
  });

  const tickFormatter = (_: string, index: number) =>
    index % 5 === 0 ? data[index]?.date ?? "" : "";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Applications Over Time</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="applications"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#6366f1" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
