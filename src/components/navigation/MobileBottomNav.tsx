"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  CompassIcon,
  Bookmark02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: DashboardSquare01Icon,
      active: pathname === "/dashboard",
    },
    {
      name: "Explore",
      href: "/explore",
      icon: CompassIcon,
      active: pathname.startsWith("/explore") || pathname.startsWith("/conversations"),
    },
    {
      name: "Vocabulary",
      href: "/dashboard",
      icon: Bookmark02Icon,
      active: false,
    },
    {
      name: "Profile",
      href: "/dashboard",
      icon: UserIcon,
      active: false,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex h-16 w-full items-center justify-around border-t border-[var(--ecp-border)] bg-[var(--ecp-surface)]/95 backdrop-blur px-2 shadow-lg">
      {navItems.map((item) => {
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 py-1 text-xs font-medium transition-colors",
              item.active
                ? "text-[var(--ecp-brand-800)] font-bold"
                : "text-[var(--ecp-text-secondary)] hover:text-[var(--ecp-text-primary)]"
            )}
          >
            <HugeiconsIcon icon={item.icon} size={20} />
            <span className="text-[10px] leading-none">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
