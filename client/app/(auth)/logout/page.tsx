"use client";

import LogoutButton from "@/components/auth/LogoutButton";

export default function LogoutPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col items-center justify-center px-4 py-12">
      <p className="mb-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Confirm if you want to sign out.
      </p>
      <LogoutButton autoOpen hideTrigger />
    </div>
  );
}
