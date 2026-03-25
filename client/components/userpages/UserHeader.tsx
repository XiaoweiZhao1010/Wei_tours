"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";
import { getUserImageUrl } from "@/lib/auth";

export default function UserHeader() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/me"
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-300"
      >
        <Image
          src={getUserImageUrl(user.photo)}
          alt={user.name}
          width={300}
          height={300}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
        />
        <span className="hidden text-xl font-bold text-gray-500 dark:text-gray-700 sm:inline">
          {user.name.split(" ")[0]}
        </span>
      </Link>
      <Link
        href="/logout"
        className="rounded-lg bg-natours px-4 py-2 font-semibold text-white transition-colors hover:bg-natours-dark"
      >
        Log out
      </Link>
    </div>
  );
}
