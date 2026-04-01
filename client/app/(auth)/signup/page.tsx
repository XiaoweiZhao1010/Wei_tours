"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup, getMe, type AuthUser } from "@/lib/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "user" as AuthUser["role"],
  });

  const roleOptions: { value: AuthUser["role"]; label: string }[] = [
    { value: "user", label: "User" },
    { value: "guide", label: "Guide" },
    { value: "lead-guide", label: "Lead guide" },
    { value: "admin", label: "Admin" },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (form.password !== form.passwordConfirm) {
        throw new Error("Passwords do not match");
      }
      if (form.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        role: form.role,
      });
      const { user } = await getMe();
      if (user) setUser(user);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-20rem)] ">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-100 md:w-150 max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="Your name"
              />
            </div>

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
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
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
                autoComplete="new-password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                minLength={8}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Minimum 8 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm password
              </label>
              <input
                id="passwordConfirm"
                type="password"
                autoComplete="new-password"
                required
                value={form.passwordConfirm}
                onChange={(e) =>
                  setForm((f) => ({ ...f, passwordConfirm: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Account type
              </label>
              <select
                id="role"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    role: e.target.value as AuthUser["role"],
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2.5 text-gray-900 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                {roleOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Tour staff roles can create or manage tours depending on server
                access rules.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-natours py-3 font-semibold text-white transition-colors hover:bg-natours-dark disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" variant="light" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-natours hover:underline"
            >
              Log in
            </Link>
          </p>
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
