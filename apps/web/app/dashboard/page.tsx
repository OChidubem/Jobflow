"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getApplications, getMe, ApplicationOut, ApplicationStatus } from "@/lib/api";
import { getToken } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import ApplicationTable from "@/components/ApplicationTable";
import ApplicationModal from "@/components/ApplicationModal";
import DeleteModal from "@/components/DeleteModal";

const PAGE_SIZE = 20;
type FilterStatus = ApplicationStatus | "";

const STATUS_TABS: { value: FilterStatus; label: string }[] = [
  { value: "", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

const STAT_CARDS = [
  { status: "applied" as ApplicationStatus, label: "Applied", gradient: "from-sky-500 to-blue-600", bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100" },
  { status: "interview" as ApplicationStatus, label: "Interview", gradient: "from-amber-400 to-orange-500", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  { status: "offer" as ApplicationStatus, label: "Offer", gradient: "from-emerald-400 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  { status: "rejected" as ApplicationStatus, label: "Rejected", gradient: "from-rose-400 to-red-500", bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  { status: "withdrawn" as ApplicationStatus, label: "Withdrawn", gradient: "from-gray-400 to-slate-500", bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-100" },
];

function getGreeting(email: string) {
  const hour = new Date().getHours();
  const name = email.split("@")[0];
  const time = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return `${time}, ${name}! 👋`;
}

function getMotivation(apps: ApplicationOut[]) {
  const total = apps.length;
  const offers = apps.filter((a) => a.status === "offer").length;
  const interviews = apps.filter((a) => a.status === "interview").length;
  if (offers > 0) return `🎉 You have ${offers} offer${offers > 1 ? "s" : ""}! That's incredible work — you earned it.`;
  if (total === 0) return "Start by adding your first application below. Every dream job starts with a single click.";
  if (interviews > 0) {
    const rate = Math.round((interviews / total) * 100);
    return `You're landing interviews at a ${rate}% rate — keep the momentum going!`;
  }
  if (total >= 10) return `${total} applications in — you're playing the numbers game right. Stay consistent!`;
  if (total >= 5) return "Great start! Consistency is key — aim for a few applications every day.";
  return "You're building your pipeline. Every application is a step closer to your dream role.";
}

function PipelineBar({ apps }: { apps: ApplicationOut[] }) {
  const total = apps.length;
  if (total === 0) return null;
  const interviews = apps.filter((a) => a.status === "interview").length;
  const offers = apps.filter((a) => a.status === "offer").length;
  const interviewRate = total > 0 ? Math.round((interviews / total) * 100) : 0;
  const offerRate = interviews > 0 ? Math.round((offers / interviews) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">Your Pipeline</h3>
        <span className="text-xs text-gray-400">{total} total applications</span>
      </div>
      <div className="flex items-center gap-2">
        {/* Applied */}
        <div className="flex-1 text-center">
          <div className="h-2 rounded-full bg-sky-200 w-full" />
          <p className="text-lg font-bold text-gray-900 mt-2">{total}</p>
          <p className="text-xs text-gray-400">Applied</p>
        </div>
        {/* Arrow + rate */}
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0 px-1">
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">{interviewRate}%</span>
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        {/* Interview */}
        <div className="flex-1 text-center">
          <div className="h-2 rounded-full bg-amber-200 w-full" />
          <p className="text-lg font-bold text-gray-900 mt-2">{interviews}</p>
          <p className="text-xs text-gray-400">Interview</p>
        </div>
        {/* Arrow + rate */}
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0 px-1">
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{offerRate}%</span>
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        {/* Offer */}
        <div className="flex-1 text-center">
          <div className="h-2 rounded-full bg-emerald-200 w-full" />
          <p className="text-lg font-bold text-gray-900 mt-2">{offers}</p>
          <p className="text-xs text-gray-400">Offer</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [applications, setApplications] = useState<ApplicationOut[]>([]);
  const [allApplications, setAllApplications] = useState<ApplicationOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("");
  const [page, setPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editApp, setEditApp] = useState<ApplicationOut | null>(null);
  const [deleteApp, setDeleteApp] = useState<ApplicationOut | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.replace("/login"); return; }
    getMe().then((user) => { setUserEmail(user.email); setAuthChecked(true); }).catch(() => router.replace("/login"));
  }, [router]);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const [all, filtered] = await Promise.all([
        getApplications({ limit: 1000 }),
        getApplications({ status: statusFilter, search, skip: page * PAGE_SIZE, limit: PAGE_SIZE }),
      ]);
      setAllApplications(all);
      setApplications(filtered);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => { if (authChecked) fetchApplications(); }, [authChecked, fetchApplications]);

  function countByStatus(status: FilterStatus) {
    if (status === "") return allApplications.length;
    return allApplications.filter((a) => a.status === status).length;
  }

  const totalFiltered = (() => {
    let f = allApplications;
    if (statusFilter) f = f.filter((a) => a.status === statusFilter);
    if (search) { const q = search.toLowerCase(); f = f.filter((a) => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)); }
    return f.length;
  })();

  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm text-gray-400">Loading Jobflow…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userEmail={userEmail} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Hero greeting */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20 animate-gradient">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-1">{getGreeting(userEmail)}</h1>
              <p className="text-indigo-200 text-sm leading-relaxed">{getMotivation(allApplications)}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 font-semibold rounded-xl text-sm hover:bg-indigo-50 transition shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Application</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {STAT_CARDS.map((card) => {
            const count = countByStatus(card.status);
            const active = statusFilter === card.status;
            return (
              <button
                key={card.status}
                onClick={() => { setStatusFilter(active ? "" : card.status); setPage(0); }}
                className={`group relative rounded-2xl border p-4 text-left transition-all hover:shadow-md hover:-translate-y-0.5 ${card.bg} ${card.border} ${active ? "ring-2 ring-offset-2 ring-current shadow-md -translate-y-0.5" : ""} ${card.text}`}
              >
                <div className={`inline-flex w-8 h-8 rounded-lg bg-gradient-to-br ${card.gradient} items-center justify-center mb-3 shadow-sm`}>
                  <span className="text-white text-xs font-bold">{count}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-xs font-medium mt-0.5 opacity-70">{card.label}</p>
              </button>
            );
          })}
        </div>

        {/* Pipeline */}
        <PipelineBar apps={allApplications} />

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="w-full sm:w-72">
              <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(0); }} placeholder="Search company or role…" />
            </div>
            <div className="flex gap-1 flex-wrap">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => { setStatusFilter(tab.value); setPage(0); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    statusFilter === tab.value
                      ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                      : "text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-xs ${statusFilter === tab.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {countByStatus(tab.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {fetchError && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {fetchError}
            <button onClick={fetchApplications} className="ml-auto underline font-semibold">Retry</button>
          </div>
        )}

        {/* Table */}
        <ApplicationTable applications={applications} onEdit={setEditApp} onDelete={setDeleteApp} loading={loading} onAdd={() => setShowCreateModal(true)} />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-gray-500">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalFiltered)} of {totalFiltered}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 0} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium">
                ← Prev
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium">
                Next →
              </button>
            </div>
          </div>
        )}
      </main>

      {showCreateModal && (
        <ApplicationModal application={null} onClose={() => setShowCreateModal(false)} onSaved={() => { setShowCreateModal(false); fetchApplications(); }} />
      )}
      {editApp && (
        <ApplicationModal application={editApp} onClose={() => setEditApp(null)} onSaved={() => { setEditApp(null); fetchApplications(); }} />
      )}
      {deleteApp && (
        <DeleteModal application={deleteApp} onClose={() => setDeleteApp(null)} onDeleted={() => { setDeleteApp(null); fetchApplications(); }} />
      )}
    </div>
  );
}
