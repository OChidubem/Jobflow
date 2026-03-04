"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Job, JOB_STATUSES } from "@/types";

interface StatusPieChartProps {
  jobs: Job[];
}

const COLORS = {
  wishlist: "#9ca3af",
  applied: "#3b82f6",
  phone_screen: "#f59e0b",
  technical_interview: "#f97316",
  final_interview: "#a855f7",
  offer: "#22c55e",
  rejected: "#ef4444",
};

export function StatusPieChart({ jobs }: StatusPieChartProps) {
  const data = JOB_STATUSES.map((status) => ({
    name: status.label,
    value: jobs.filter((j) => j.status === status.value).length,
    color: COLORS[status.value],
  })).filter((d) => d.value > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Applications by Status</h3>
      {data.length === 0 ? (
        <div className="h-60 flex items-center justify-center text-gray-400 text-sm">
          No applications yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
