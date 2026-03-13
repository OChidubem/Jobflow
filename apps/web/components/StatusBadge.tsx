"use client";

import { ApplicationStatus } from "@/lib/api";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; dot: string; className: string }> = {
  applied: {
    label: "Applied",
    dot: "bg-sky-400",
    className: "bg-sky-50 text-sky-700 border border-sky-200",
  },
  interview: {
    label: "Interview",
    dot: "bg-amber-400",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  offer: {
    label: "Offer 🎉",
    dot: "bg-emerald-400",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-rose-400",
    className: "bg-rose-50 text-rose-600 border border-rose-200",
  },
  withdrawn: {
    label: "Withdrawn",
    dot: "bg-gray-400",
    className: "bg-gray-50 text-gray-500 border border-gray-200",
  },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeClass = size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClass} ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} flex-shrink-0`} />
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };
