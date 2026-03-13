"use client";

import { useState, FormEvent, useEffect } from "react";
import { createApplication, updateApplication, ApplicationOut, ApplicationCreate, ApplicationStatus } from "@/lib/api";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; emoji: string }[] = [
  { value: "applied", label: "Applied", emoji: "📤" },
  { value: "interview", label: "Interview", emoji: "🎯" },
  { value: "offer", label: "Offer", emoji: "🎉" },
  { value: "rejected", label: "Rejected", emoji: "❌" },
  { value: "withdrawn", label: "Withdrawn", emoji: "↩️" },
];

interface ApplicationModalProps {
  application?: ApplicationOut | null;
  onClose: () => void;
  onSaved: () => void;
}

interface FormState {
  company: string;
  role: string;
  status: ApplicationStatus;
  applied_date: string;
  url: string;
  source: string;
  notes: string;
}

const defaultForm: FormState = {
  company: "", role: "", status: "applied",
  applied_date: new Date().toISOString().split("T")[0],
  url: "", source: "", notes: "",
};

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition bg-gray-50 focus:bg-white placeholder:text-gray-300";

export default function ApplicationModal({ application, onClose, onSaved }: ApplicationModalProps) {
  const isEdit = !!application;
  const [form, setForm] = useState<FormState>(defaultForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application) {
      setForm({
        company: application.company,
        role: application.role,
        status: application.status,
        applied_date: application.applied_date ? application.applied_date.split("T")[0] : "",
        url: application.url ?? "",
        source: application.source ?? "",
        notes: application.notes ?? "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [application]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.company.trim()) { setError("Company is required."); return; }
    if (!form.role.trim()) { setError("Role is required."); return; }
    setLoading(true);
    const body: ApplicationCreate = {
      company: form.company.trim(), role: form.role.trim(), status: form.status,
      applied_date: form.applied_date || null,
      url: form.url.trim() || null, source: form.source.trim() || null, notes: form.notes.trim() || null,
    };
    try {
      if (isEdit && application) { await updateApplication(application.id, body); }
      else { await createApplication(body); }
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto z-10 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl sm:rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{isEdit ? "Edit Application" : "Add Application"}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{isEdit ? "Update the details below" : "Fill in the job details"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Company *">
              <input name="company" type="text" required value={form.company} onChange={handleChange} className={inputClass} placeholder="Google, Meta, Stripe…" />
            </Field>
            <Field label="Role *">
              <input name="role" type="text" required value={form.role} onChange={handleChange} className={inputClass} placeholder="Software Engineer" />
            </Field>
          </div>

          {/* Status selector */}
          <Field label="Status">
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value} type="button"
                  onClick={() => setForm((prev) => ({ ...prev, status: opt.value }))}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                    form.status === opt.value
                      ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span>{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Applied date">
              <input name="applied_date" type="date" value={form.applied_date} onChange={handleChange} className={inputClass} />
            </Field>
            <Field label="Source">
              <input name="source" type="text" value={form.source} onChange={handleChange} className={inputClass} placeholder="LinkedIn, Referral…" />
            </Field>
          </div>

          <Field label="Job posting URL">
            <input name="url" type="url" value={form.url} onChange={handleChange} className={inputClass} placeholder="https://company.com/jobs/…" />
          </Field>

          <Field label="Notes" hint="Interview prep, contacts, next steps — anything useful">
            <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Added by referral from Jane. Phone screen on Friday…" />
          </Field>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-violet-500/25">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving…
                </span>
              ) : isEdit ? "Save changes" : "Add application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
