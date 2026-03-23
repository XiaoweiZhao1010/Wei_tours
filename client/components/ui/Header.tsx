"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";
import { useTheme } from "@/components/TheContextProvider/ThemeProvider";
import UserHeader from "@/components/userpages/UserHeader";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-300/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-natours">Wei_tours</span>
        </Link>

        <nav className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-natours dark:text-gray-100 dark:hover:bg-gray-300 dark:hover:text-natours"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          {isAuthenticated ? (
            <>
              <UserHeader />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 transition-colors hover:text-natours dark:text-gray-100 dark:hover:text-natours"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-natours px-4 py-2 font-semibold text-white transition-colors hover:bg-natours-dark"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
