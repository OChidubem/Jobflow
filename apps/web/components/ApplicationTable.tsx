"use client";

import { ApplicationOut } from "@/lib/api";
import StatusBadge from "./StatusBadge";

interface ApplicationTableProps {
  applications: ApplicationOut[];
  onEdit: (app: ApplicationOut) => void;
  onDelete: (app: ApplicationOut) => void;
  onAdd: () => void;
  loading: boolean;
}

const AVATAR_GRADIENTS = [
  "from-violet-500 to-indigo-500",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-pink-400 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-purple-500 to-pink-500",
  "from-cyan-400 to-sky-500",
  "from-lime-400 to-green-500",
];

function companyGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="w-10 h-10 skeleton rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 skeleton rounded w-1/3" />
        <div className="h-3 skeleton rounded w-1/4" />
      </div>
      <div className="h-6 skeleton rounded-full w-20 hidden sm:block" />
      <div className="h-3 skeleton rounded w-24 hidden md:block" />
      <div className="flex gap-2 ml-auto">
        <div className="h-8 w-8 skeleton rounded-lg" />
        <div className="h-8 w-8 skeleton rounded-lg" />
      </div>
    </div>
  );
}

export default function ApplicationTable({ applications, onEdit, onDelete, onAdd, loading }: ApplicationTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-6 text-center">
        {/* SVG Illustration */}
        <div className="w-24 h-24 mb-6">
          <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
            <circle cx="48" cy="48" r="48" fill="#f5f3ff" />
            <rect x="28" y="24" width="40" height="48" rx="4" fill="#e0e7ff" />
            <rect x="34" y="32" width="28" height="3" rx="1.5" fill="#818cf8" />
            <rect x="34" y="40" width="20" height="3" rx="1.5" fill="#c7d2fe" />
            <rect x="34" y="48" width="24" height="3" rx="1.5" fill="#c7d2fe" />
            <rect x="34" y="56" width="16" height="3" rx="1.5" fill="#c7d2fe" />
            <circle cx="67" cy="68" r="12" fill="#7c3aed" />
            <path d="M62 68l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-gray-900 font-bold text-lg mb-1">No applications yet</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          Start tracking your job search! Add your first application and take the first step toward your dream role.
        </p>
        <button
          onClick={onAdd}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:from-violet-700 hover:to-indigo-700 transition shadow-lg shadow-violet-500/25"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add your first application
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3.5 font-semibold text-gray-400 uppercase tracking-wider text-xs">Company</th>
              <th className="text-left px-6 py-3.5 font-semibold text-gray-400 uppercase tracking-wider text-xs">Role</th>
              <th className="text-left px-6 py-3.5 font-semibold text-gray-400 uppercase tracking-wider text-xs">Status</th>
              <th className="text-left px-6 py-3.5 font-semibold text-gray-400 uppercase tracking-wider text-xs">Applied</th>
              <th className="text-left px-6 py-3.5 font-semibold text-gray-400 uppercase tracking-wider text-xs">Source</th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${companyGradient(app.company)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <span className="text-white font-bold text-sm uppercase">{app.company.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{app.company}</p>
                      {app.url && (
                        <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-500 hover:text-violet-700 hover:underline" onClick={(e) => e.stopPropagation()}>
                          View posting ↗
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">{app.role}</td>
                <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(app.applied_date)}</td>
                <td className="px-6 py-4 text-gray-400 text-xs">{app.source || "—"}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                    <button onClick={() => onEdit(app)} className="p-2 rounded-lg text-gray-300 hover:text-violet-600 hover:bg-violet-50 transition" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => onDelete(app)} className="p-2 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition" title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${companyGradient(app.company)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <span className="text-white font-bold text-sm uppercase">{app.company.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">{app.company}</p>
                  <p className="text-sm text-gray-500 truncate">{app.role}</p>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                <span>{formatDate(app.applied_date)}</span>
                {app.source && <span>via {app.source}</span>}
                {app.url && <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">View ↗</a>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onEdit(app)} className="p-2 rounded-lg text-gray-300 hover:text-violet-600 hover:bg-violet-50 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => onDelete(app)} className="p-2 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            {app.notes && <p className="mt-2 text-xs text-gray-400 border-t border-gray-50 pt-2 line-clamp-2">{app.notes}</p>}
          </div>
        ))}
      </div>
    </>
  );
}
