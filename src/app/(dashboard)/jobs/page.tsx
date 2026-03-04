"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Job, JOB_STATUSES } from "@/types";
import { JobsTable } from "@/components/jobs/JobsTable";
import { Search, Plus, Filter } from "lucide-react";
import Link from "next/link";

async function fetchJobs(search: string, status: string): Promise<Job[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status && status !== "all") params.set("status", status);
  const res = await fetch(`/api/jobs?${params}`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", search, statusFilter],
    queryFn: () => fetchJobs(search, statusFilter),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Applications</h2>
          <p className="text-gray-500 mt-1">
            {jobs.length} application{jobs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Job
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Statuses</option>
            {JOB_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {isLoading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading...</div>
        ) : (
          <JobsTable jobs={jobs} onDelete={(id) => deleteMutation.mutate(id)} />
        )}
      </div>
    </div>
  );
}
