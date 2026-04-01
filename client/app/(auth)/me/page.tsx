"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";
import { getUserImageUrl } from "@/lib/auth";
import Image from "next/image";
import LogoutButton from "@/components/auth/LogoutButton";

export default function MePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-4">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
        My account
      </h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-6">
          <Image
            src={getUserImageUrl(user.photo)}
            alt={user.name}
            width={300}
            height={300}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {user.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <span className="mt-2 inline-block rounded-full bg-natours/20 px-3 py-0.5 text-sm font-medium capitalize text-natours">
              {user.role.replace("-", " ")}
            </span>
          </div>
        </div>
        <div className="mt-8">
          <LogoutButton variant="link" />
        </div>
      </div>
    </div>
  );
}
