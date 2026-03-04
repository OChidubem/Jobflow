"use client";

import { useState } from "react";
import { Job } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate, formatSalary } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";

interface JobsTableProps {
  jobs: Job[];
  onDelete: (id: string) => void;
}

type SortField = "company" | "position" | "status" | "appliedAt" | "salaryMin";
type SortDirection = "asc" | "desc";

export function JobsTable({ jobs, onDelete }: JobsTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>("appliedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sorted = [...jobs].sort((a, b) => {
    let valA: string | number | Date = a[sortField] as string;
    let valB: string | number | Date = b[sortField] as string;

    if (sortField === "appliedAt") {
      valA = a.appliedAt ? new Date(a.appliedAt) : new Date(0);
      valB = b.appliedAt ? new Date(b.appliedAt) : new Date(0);
    } else if (sortField === "salaryMin") {
      valA = a.salaryMin ?? 0;
      valB = b.salaryMin ?? 0;
    }

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="h-3 w-3 opacity-30" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3 text-indigo-500" />
    ) : (
      <ChevronDown className="h-3 w-3 text-indigo-500" />
    );
  };

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {[
              { field: "company" as SortField, label: "Company" },
              { field: "position" as SortField, label: "Position" },
              { field: "status" as SortField, label: "Status" },
              { field: "salaryMin" as SortField, label: "Salary" },
              { field: "appliedAt" as SortField, label: "Applied" },
            ].map(({ field, label }) => (
              <th
                key={field}
                onClick={() => handleSort(field)}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
              >
                <div className="flex items-center gap-1">
                  {label}
                  <SortIcon field={field} />
                </div>
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((job) => (
            <tr
              key={job.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
                    {job.company.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{job.company}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-700">{job.position}</span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={job.status as Job["status"]} />
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-500">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-500">{formatDate(job.appliedAt)}</span>
              </td>
              <td className="px-4 py-3">
                <div
                  className="flex items-center gap-2 justify-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Link
                    href={`/jobs/${job.id}/edit`}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(job.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
