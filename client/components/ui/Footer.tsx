"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  Home,
  Compass,
  Info,
  Smartphone,
  UserPlus,
  Briefcase,
  Mail,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tours", label: "Tours", icon: Compass },
  { href: "/about", label: "About us", icon: Info },
  { href: "/download", label: "Download apps", icon: Smartphone },
  { href: "/become-guide", label: "Become a guide", icon: UserPlus },
  { href: "/careers", label: "Careers", icon: Briefcase },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer className="relative border-gray-200 bg-white py-6 dark:border-gray-200 dark:bg-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 border-t border-gray-200 py-6 dark:border-gray-700 sm:flex-row sm:justify-between">
          <span className="text-lg font-bold text-natours">Wei_tours</span>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-natours dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-natours"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 dark:bg-gray-800" />
          </button>
        </div>
        <p className="text-sm text-gray-800 dark:bg-gray-400">
          © {new Date().getFullYear()} by Xiaowei Zhao.
        </p>
      </div>

      {/* Absolute sidebar - positioned relative to footer */}
      {isOpen && (
        <>
          <div
            className="absolute inset-0 z-40 bg-black/50 dark:bg-black/70"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="absolute right-0 bottom-full z-50 mb-0 mr-4 w-56 border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 rounded-2xl"
            aria-label="Navigation menu"
          >
            <nav className="flex flex-col p-4">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-natours dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-natours"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </footer>
  );
}
