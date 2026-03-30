"use client";

import { useState } from "react";
import { updatePassword } from "@/lib/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/TheContextProvider/ToastProvider";

export default function PasswordSection() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const currentPassword = (
      form.elements.namedItem("currentPassword") as HTMLInputElement
    )?.value;
    const newPassword = (
      form.elements.namedItem("newPassword") as HTMLInputElement
    )?.value;
    const newPasswordConfirm = (
      form.elements.namedItem("newPasswordConfirm") as HTMLInputElement
    )?.value;

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword({
        currentPassword,
        newPassword,
        newPasswordConfirm,
      });
      showToast("Password updated successfully", 3000);
      setFormKey((k) => k + 1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update password. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
      <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Password
      </h2>
      <form key={formKey} className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}
        <div>
          <label
            htmlFor="settings-current-password"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Current password
          </label>
          <input
            id="settings-current-password"
            type="password"
            name="currentPassword"
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="settings-new-password"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            New password
          </label>
          <input
            id="settings-new-password"
            type="password"
            name="newPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="settings-confirm-password"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Confirm new password
          </label>
          <input
            id="settings-confirm-password"
            type="password"
            name="newPasswordConfirm"
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-natours px-6 py-2.5 font-semibold text-white transition-colors hover:bg-natours-dark disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" variant="light" />
              Saving…
            </>
          ) : (
            "Save password"
          )}
        </button>
      </form>
    </section>
  );
}
