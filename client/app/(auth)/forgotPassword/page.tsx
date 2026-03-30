"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/TheContextProvider/ToastProvider";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { message } = await forgotPassword(email.trim());
      setSubmitted(true);
      showToast(message, 4000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-12rem)]">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md flex-col justify-center px-4 py-12 sm:max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Forgot password
          </h1>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Enter your account email and we&apos;ll send you a link to reset
            your password (valid for 10 minutes).
          </p>

          {submitted ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                <p className="font-medium">Check your inbox</p>
                <p className="mt-1 text-emerald-800/90 dark:text-emerald-300/90">
                  If an account exists for{" "}
                  <span className="font-semibold">{email}</span>, you should
                  receive an email with reset instructions shortly.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-lg bg-natours py-3 font-semibold text-white transition-colors hover:bg-natours-dark"
              >
                Back to log in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="forgot-email"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-natours py-3 font-semibold text-white transition-colors hover:bg-natours-dark disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" variant="light" />
                    <span>Sending…</span>
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-natours dark:text-gray-400 dark:hover:text-natours"
          >
            ← Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
