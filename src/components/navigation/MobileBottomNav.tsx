"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { t, useLocale } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  CompassIcon,
  Bookmark02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

export function MobileBottomNav() {
  const pathname = usePathname();
  const locale = useLocale();

  const navItems = [
    {
      name: t("nav.dashboard", locale),
      href: "/dashboard",
      icon: DashboardSquare01Icon,
      active: pathname === "/dashboard",
    },
    {
      name: t("nav.explore", locale),
      href: "/explore",
      icon: CompassIcon,
      active: pathname.startsWith("/explore") || pathname.startsWith("/conversations"),
    },
    {
      name: t("nav.vocabulary", locale),
      href: "/vocabulary",
      icon: Bookmark02Icon,
      active: pathname === "/vocabulary",
    },
    {
      name: t("auth.profile", locale),
      href: "/dashboard",
      icon: UserIcon,
      active: false,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex h-bottom-nav w-full items-center justify-around border-t border-border bg-card/95 backdrop-blur px-2 shadow-xs">
      {navItems.map((item) => {
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 py-1 transition-all btn-press",
              item.active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HugeiconsIcon icon={item.icon} size={22} />
            <span className="text-chip leading-none">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
