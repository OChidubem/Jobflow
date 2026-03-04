"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useState, useCallback } from "react";
import { Job, JobStatus, JOB_STATUSES } from "@/types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { useQueryClient } from "@tanstack/react-query";

interface KanbanBoardProps {
  initialJobs: Job[];
}

export function KanbanBoard({ initialJobs }: KanbanBoardProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const getJobsByStatus = useCallback(
    (status: JobStatus) => jobs.filter((j) => j.status === status),
    [jobs]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const job = jobs.find((j) => j.id === event.active.id);
    setActiveJob(job ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as JobStatus;

    const job = jobs.find((j) => j.id === jobId);
    if (!job || job.status === newStatus) return;

    const validStatuses = JOB_STATUSES.map((s) => s.value);
    if (!validStatuses.includes(newStatus)) return;

    // Optimistic update
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );

    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch {
      // Revert on error
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: job.status } : j))
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-full scrollbar-thin">
        {JOB_STATUSES.map((statusConfig) => (
          <KanbanColumn
            key={statusConfig.value}
            status={statusConfig.value}
            jobs={getJobsByStatus(statusConfig.value)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeJob && (
          <div className="rotate-2 shadow-2xl">
            <KanbanCard job={activeJob} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
