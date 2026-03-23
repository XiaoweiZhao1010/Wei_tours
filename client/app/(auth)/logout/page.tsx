"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";
import { logout } from "@/lib/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LogoutPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false; // For user navigates away

    async function doLogout() {
      try {
        await logout();
        if (!cancelled) {
          setUser(null);
          router.push("/");
          router.refresh();
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Logout failed");
        }
      }
    }

    doLogout();
    return () => {
      cancelled = true;
    };
  }, [setUser, router]);

  if (error) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
          <p className="mt-4 text-center">
            <Link href="/" className="font-medium text-natours hover:underline">
              ← Back to tours
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-12">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Logging you out...</p>
    </div>
  );
}
