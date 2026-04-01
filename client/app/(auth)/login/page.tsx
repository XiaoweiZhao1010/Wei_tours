"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login, getMe } from "@/lib/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";
import { useToast } from "@/components/TheContextProvider/ToastProvider";

function safeRedirect(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/";
  return path;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUser } = useAuth();
  const { showToast } = useToast();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(form.email, form.password);
      const { user } = await getMe();
      if (user) setUser(user);
      showToast("Logged in successfully", 3000);
      router.push(safeRedirect(searchParams.get("redirect")));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-12rem)]">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-100 md:w-150 flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                Something went wrong. Please try again later.
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
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
                  <span>Logging in...</span>
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>
          <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/forgotPassword"
                className="font-medium text-natours hover:underline"
              >
                Forgot Password
              </Link>
            </p>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-natours hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-natours dark:text-gray-400 dark:hover:text-natours"
          >
            ← Back to tours
          </Link>
        </p>
      </div>
    </div>
  );
}
