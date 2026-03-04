import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

const colorStyles = {
  blue: { bg: "bg-blue-50", icon: "bg-blue-500", text: "text-blue-600" },
  green: { bg: "bg-green-50", icon: "bg-green-500", text: "text-green-600" },
  purple: { bg: "bg-purple-50", icon: "bg-purple-500", text: "text-purple-600" },
  orange: { bg: "bg-orange-50", icon: "bg-orange-500", text: "text-orange-600" },
  red: { bg: "bg-red-50", icon: "bg-red-500", text: "text-red-600" },
};

export function StatsCard({ title, value, icon: Icon, color = "blue" }: StatsCardProps) {
  const colors = colorStyles[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.icon)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}
