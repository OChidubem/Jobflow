"use client";

import { useState } from "react";
import { deleteApplication, ApplicationOut } from "@/lib/api";

interface DeleteModalProps {
  application: ApplicationOut;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteModal({ application, onClose, onDeleted }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");
    try {
      await deleteApplication(application.id);
      onDeleted();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 animate-fade-in">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 mx-auto mb-5">
          <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-gray-900 text-center mb-2">Remove application?</h2>
        <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
          You&apos;re about to remove your application to{" "}
          <span className="font-semibold text-gray-800">{application.company}</span> for{" "}
          <span className="font-semibold text-gray-800">{application.role}</span>.
          This can&apos;t be undone.
        </p>

        {error && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition disabled:opacity-50">
            Keep it
          </button>
          <button onClick={handleDelete} disabled={loading} className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-rose-500/25">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Removing…
              </span>
            ) : "Yes, remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
