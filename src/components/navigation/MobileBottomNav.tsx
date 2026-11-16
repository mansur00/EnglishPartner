"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Compass, BookMarked, User } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      name: "Explore",
      href: "/explore",
      icon: Compass,
      active: pathname.startsWith("/explore") || pathname.startsWith("/conversations"),
    },
    {
      name: "Vocabulary",
      href: "/dashboard",
      icon: BookMarked,
      active: false,
    },
    {
      name: "Profile",
      href: "/dashboard",
      icon: User,
      active: false,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex h-16 w-full items-center justify-around border-t border-[var(--ecp-border)] bg-[var(--ecp-surface)]/95 backdrop-blur px-2 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
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
            <Icon className="w-5 h-5" />
            <span className="text-[10px] leading-none">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
