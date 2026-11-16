"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  CompassIcon,
  Calendar03Icon,
  Briefcase01Icon,
  BotIcon,
  Bookmark02Icon,
  Analytics01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";

interface NavItem {
  name: string;
  href: string;
  icon: IconSvgElement;
  active: boolean;
  comingSoon?: boolean;
}

export function Sidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
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
      name: "Daily Practice",
      href: "#",
      icon: Calendar03Icon,
      active: false,
      comingSoon: true,
    },
    {
      name: "Professional English",
      href: "/explore?category=professional",
      icon: Briefcase01Icon,
      active: false,
    },
    {
      name: "AI Partner",
      href: "#",
      icon: BotIcon,
      active: false,
      comingSoon: true,
    },
    {
      name: "My Vocabulary",
      href: "#",
      icon: Bookmark02Icon,
      active: false,
      comingSoon: true,
    },
    {
      name: "My Progress",
      href: "#",
      icon: Analytics01Icon,
      active: false,
      comingSoon: true,
    },
    {
      name: "Settings",
      href: "#",
      icon: Settings01Icon,
      active: false,
      comingSoon: true,
    },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-[var(--ecp-border)] bg-[var(--ecp-surface)] p-4 space-y-6 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--ecp-text-muted)]">
          Menu
        </span>
        <nav className="space-y-1 pt-1">
          {navItems.map((item) => {
            if (item.comingSoon) {
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-[var(--ecp-text-muted)] cursor-not-allowed select-none opacity-70"
                >
                  <div className="flex items-center gap-2.5">
                    <HugeiconsIcon icon={item.icon} size={18} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] font-medium bg-[var(--ecp-surface-muted)] text-[var(--ecp-text-muted)] px-1.5 py-0.5 rounded border border-[var(--ecp-border)]">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
                  item.active
                    ? "bg-[var(--ecp-brand-100)] text-[var(--ecp-brand-800)] font-semibold"
                    : "text-[var(--ecp-text-secondary)] hover:bg-[var(--ecp-surface-muted)] hover:text-[var(--ecp-text-primary)]"
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={18}
                  className={cn(
                    item.active ? "text-[var(--ecp-brand-800)]" : "text-[var(--ecp-text-secondary)]"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-[var(--ecp-border)] mt-auto">
        <div className="p-3 bg-[var(--ecp-brand-50)] rounded-xl border border-[var(--ecp-brand-100)] space-y-1.5">
          <p className="text-xs font-bold text-[var(--ecp-brand-900)]">
            Active Learning Path
          </p>
          <p className="text-[11px] text-[var(--ecp-brand-800)] leading-relaxed">
            Everyday Essentials & Conversations
          </p>
        </div>
      </div>
    </aside>
  );
}
