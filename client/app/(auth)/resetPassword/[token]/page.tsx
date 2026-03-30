"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { resetPasswordWithToken, getMe } from "@/lib/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";
import { useToast } from "@/components/TheContextProvider/ToastProvider";

export default function ResetPasswordTokenPage() {
  const router = useRouter();
  const params = useParams();
  const token = typeof params.token === "string" ? params.token : "";
  const { setUser } = useAuth();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset link. Request a new one from the login page.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordWithToken(token, { password, passwordConfirm });
      const { user } = await getMe();
      if (user) setUser(user);
      showToast("Password reset. You are signed in.", 4000);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not reset password.",
      );
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="relative min-h-[calc(100vh-12rem)]">
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Invalid link
            </h1>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              This reset link is missing or broken. Request a new password reset
              from the login page.
            </p>
            <Link
              href="/forgotPassword"
              className="inline-flex w-full items-center justify-center rounded-lg bg-natours py-3 font-semibold text-white transition-colors hover:bg-natours-dark"
            >
              Forgot password
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-12rem)]">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md flex-col justify-center px-4 py-12 sm:max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Set new password
          </h1>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Choose a new password for your account. The reset link expires after
            10 minutes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="reset-password"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New password
              </label>
              <input
                id="reset-password"
                type="password"
                name="password"
                required
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="reset-password-confirm"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm new password
              </label>
              <input
                id="reset-password-confirm"
                type="password"
                name="passwordConfirm"
                required
                autoComplete="new-password"
                minLength={8}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="Repeat password"
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
                  <span>Updating…</span>
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>
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
