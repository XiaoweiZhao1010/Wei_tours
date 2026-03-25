"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  HelpCircle,
  LayoutList,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

const links = [
  { href: "/me", label: "Overview", icon: User },
  { href: "/me/settings", label: "Settings", icon: Settings },
  { href: "/me/mybookings", label: "My bookings", icon: LayoutList },
  { href: "/me/myreviews", label: "My reviews", icon: MessageSquare },
  { href: "/me/billing", label: "Billing", icon: CreditCard },
  { href: "/me/help", label: "Help", icon: HelpCircle },
] as const;

export default function MeAccountNav() {
  const pathname = usePathname() || "";

  return (
    <nav className="shrink-0 md:w-56" aria-label="Account">
      <ul className="-mx-1 flex gap-0.5 overflow-x-auto pb-1 md:mx-0 md:flex-col md:gap-0.5 md:overflow-visible md:pb-0 md:pr-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/me"
              ? pathname === "/me"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="shrink-0 md:w-full">
              <Link
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors md:py-2 ${
                  isActive
                    ? "relative z-0 bg-natours/15 text-natours ring-1 ring-natours/25 dark:bg-natours/25 dark:text-natours dark:ring-natours/30"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/6 dark:hover:text-gray-100"
                } `}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive
                      ? "text-natours opacity-100"
                      : "opacity-70 dark:opacity-80"
                  }`}
                  aria-hidden
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
