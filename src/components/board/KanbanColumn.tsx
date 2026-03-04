"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Job, JobStatus } from "@/types";
import { KanbanCard } from "./KanbanCard";
import { STATUS_LABELS, COLUMN_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

interface KanbanColumnProps {
  status: JobStatus;
  jobs: Job[];
}

export function KanbanColumn({ status, jobs }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-72 w-72">
      <div className={cn("flex items-center justify-between px-3 py-2.5 rounded-t-lg border-t-4 bg-gray-50 border-l border-r border-t border-gray-200", COLUMN_COLORS[status])}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{STATUS_LABELS[status]}</span>
          <span className="bg-white border border-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
            {jobs.length}
          </span>
        </div>
        <Link
          href={`/jobs/new?status=${status}`}
          className="p-1 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 space-y-2 min-h-32 rounded-b-lg border-l border-r border-b border-gray-200 bg-gray-50/50 transition-colors",
          isOver && "bg-indigo-50"
        )}
      >
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <KanbanCard key={job.id} job={job} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
