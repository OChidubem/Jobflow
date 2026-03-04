"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Job } from "@/types";
import { formatDate, formatSalary } from "@/lib/utils";
import { MapPin, DollarSign, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

interface KanbanCardProps {
  job: Job;
}

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-100 text-gray-600",
};

export function KanbanCard({ job }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-700 font-semibold text-xs flex-shrink-0">
            {job.company.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{job.company}</p>
          </div>
        </div>
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${PRIORITY_COLORS[job.priority as keyof typeof PRIORITY_COLORS] ?? PRIORITY_COLORS.medium}`}>
          {job.priority}
        </span>
      </div>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{job.position}</p>

      <div className="space-y-1">
        {job.location && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{job.location}</span>
          </div>
        )}
        {(job.salaryMin || job.salaryMax) && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <DollarSign className="h-3 w-3" />
            <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
          </div>
        )}
        {job.appliedAt && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(job.appliedAt)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400 capitalize">{job.workType?.replace("_", " ")}</span>
        <Link
          href={`/jobs/${job.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-indigo-500 hover:text-indigo-700 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
