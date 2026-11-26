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
  Analytics01Icon,
} from "@hugeicons/core-free-icons";

export function MobileBottomNav() {
  const pathname = usePathname();
  const locale = useLocale();

  const navItems = [
    {
      name: t("nav.dashboard", locale),
      href: "/dashboard",
      icon: DashboardSquare01Icon,
      active: pathname.startsWith("/dashboard"),
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
      active: pathname.startsWith("/vocabulary"),
    },
    {
      name: t("nav.progress", locale),
      href: "/progress",
      icon: Analytics01Icon,
      active: pathname.startsWith("/progress"),
    },
  ];

  return (
    <nav
      suppressHydrationWarning
      className="md:hidden fixed bottom-0 left-0 right-0 z-header flex h-bottom-nav w-full items-center justify-around border-t border-border bg-card/95 backdrop-blur px-1 shadow-xs"
    >
      {navItems.map((item) => {
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-1.5 px-1 transition-colors btn-press",
              item.active
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HugeiconsIcon icon={item.icon} size={20} />
            <span
              suppressHydrationWarning
              className="text-chip leading-none truncate max-w-full"
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
