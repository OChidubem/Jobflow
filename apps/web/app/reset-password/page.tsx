"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/api";

function PasswordRule({ met, text }: { met: boolean; text: string }) {
  return (
    <span className={`flex items-center gap-1.5 text-xs transition-colors ${met ? "text-emerald-600" : "text-gray-400"}`}>
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {met
          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
      </svg>
      {text}
    </span>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const pwRules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    digit: /[0-9]/.test(password),
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!pwRules.length || !pwRules.upper || !pwRules.digit) {
      setError("Password does not meet requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-gray-500 mb-4">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-violet-600 font-semibold text-sm">Request a new link →</Link>
      </div>
    );
  }

  return done ? (
    <div className="text-center">
      <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Password updated!</h2>
      <p className="text-gray-500 text-sm">Redirecting you to sign in…</p>
    </div>
  ) : (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Set new password</h2>
        <p className="text-gray-500 mt-1">Choose a strong password for your account.</p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">New password</label>
          <input
            id="password" type="password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
            placeholder="Create a strong password"
          />
          {password && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <PasswordRule met={pwRules.length} text="8+ characters" />
              <PasswordRule met={pwRules.upper} text="Uppercase letter" />
              <PasswordRule met={pwRules.digit} text="Number" />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm password</label>
          <input
            id="confirm" type="password" required
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition bg-gray-50 focus:bg-white ${confirmPassword && confirmPassword !== password ? "border-red-300" : "border-gray-200"}`}
            placeholder="••••••••"
          />
          {confirmPassword && confirmPassword !== password && (
            <p className="mt-1 text-xs text-red-500">Passwords don&apos;t match</p>
          )}
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-violet-500/25"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Updating…
            </span>
          ) : "Update password →"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-xl text-gray-900">Jobflow</span>
        </div>
        <Suspense fallback={<div className="text-gray-400 text-sm">Loading…</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
