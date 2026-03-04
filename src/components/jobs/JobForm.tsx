"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Job, JOB_STATUSES, WORK_TYPES, PRIORITIES } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const jobSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  status: z.string(),
  url: z.string().url("Invalid URL").or(z.literal("")).optional(),
  location: z.string().optional(),
  workType: z.string(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  priority: z.string(),
  appliedAt: z.string().optional(),
  nextInterviewAt: z.string().optional(),
  jobDescription: z.string().optional(),
  notes: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Invalid email").or(z.literal("")).optional(),
  contactPhone: z.string().optional(),
  contactRole: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobFormProps {
  job?: Job;
  defaultStatus?: string;
}

export function JobForm({ job, defaultStatus }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEditing = !!job;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: job?.company ?? "",
      position: job?.position ?? "",
      status: job?.status ?? defaultStatus ?? "wishlist",
      url: job?.url ?? "",
      location: job?.location ?? "",
      workType: job?.workType ?? "onsite",
      salaryMin: job?.salaryMin != null ? String(job.salaryMin) : "",
      salaryMax: job?.salaryMax != null ? String(job.salaryMax) : "",
      priority: job?.priority ?? "medium",
      appliedAt: job?.appliedAt
        ? new Date(job.appliedAt).toISOString().split("T")[0]
        : "",
      nextInterviewAt: job?.nextInterviewAt
        ? new Date(job.nextInterviewAt).toISOString().split("T")[0]
        : "",
      jobDescription: job?.jobDescription ?? "",
      notes: job?.notes ?? "",
      contactName: job?.contactName ?? "",
      contactEmail: job?.contactEmail ?? "",
      contactPhone: job?.contactPhone ?? "",
      contactRole: job?.contactRole ?? "",
    },
  });

  const onSubmit = async (data: JobFormData) => {
    setLoading(true);
    setError("");
    try {
      const url = isEditing ? `/api/jobs/${job!.id}` : "/api/jobs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          url: data.url || null,
          salaryMin: data.salaryMin ? Number(data.salaryMin) : null,
          salaryMax: data.salaryMax ? Number(data.salaryMax) : null,
          appliedAt: data.appliedAt || null,
          nextInterviewAt: data.nextInterviewAt || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to save job");
        return;
      }

      const saved = await res.json();
      router.push(`/jobs/${saved.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href={isEditing ? `/jobs/${job!.id}` : "/jobs"}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Application" : "Add Application"}
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEditing ? "Update job details" : "Track a new job application"}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Company *</label>
            <input
              {...register("company")}
              placeholder="e.g. Google"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.company && <p className="text-xs text-red-600">{errors.company.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Position *</label>
            <input
              {...register("position")}
              placeholder="e.g. Senior Engineer"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.position && <p className="text-xs text-red-600">{errors.position.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              {...register("status")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {JOB_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Work Type</label>
            <select
              {...register("workType")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {WORK_TYPES.map((w) => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              {...register("priority")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              {...register("location")}
              placeholder="e.g. San Francisco, CA"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Job URL</label>
            <input
              {...register("url")}
              type="url"
              placeholder="https://company.com/jobs/..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.url && <p className="text-xs text-red-600">{errors.url.message}</p>}
          </div>
        </div>
      </div>

      {/* Salary & Dates */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Salary & Dates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Min Salary</label>
            <input
              {...register("salaryMin")}
              type="number"
              placeholder="e.g. 120000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Max Salary</label>
            <input
              {...register("salaryMax")}
              type="number"
              placeholder="e.g. 160000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Date Applied</label>
            <input
              {...register("appliedAt")}
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Next Interview</label>
            <input
              {...register("nextInterviewAt")}
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Notes & Description</h3>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Job Description</label>
          <textarea
            {...register("jobDescription")}
            rows={4}
            placeholder="Paste the job description here..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">My Notes</label>
          <textarea
            {...register("notes")}
            rows={3}
            placeholder="Interview notes, company culture observations..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Contact Person</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register("contactName")}
              placeholder="e.g. Jane Smith"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              {...register("contactRole")}
              placeholder="e.g. Recruiter"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("contactEmail")}
              type="email"
              placeholder="jane@company.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.contactEmail && (
              <p className="text-xs text-red-600">{errors.contactEmail.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              {...register("contactPhone")}
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pb-6">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : isEditing ? "Update Application" : "Save Application"}
        </button>
        <Link
          href={isEditing ? `/jobs/${job!.id}` : "/jobs"}
          className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
