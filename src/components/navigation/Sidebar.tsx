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
      href: "/explore?category=workplace-business",
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
      href: "/vocabulary",
      icon: Bookmark02Icon,
      active: pathname === "/vocabulary",
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
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4 space-y-6 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Navigation
        </span>
        <nav className="space-y-1 pt-1.5" aria-label="Main navigation">
          {navItems.map((item) => {
            if (item.comingSoon) {
              return (
                <div
                  key={item.name}
                  aria-disabled="true"
                  title={`${item.name} (Coming soon in future release)`}
                  className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl text-muted-foreground/60 cursor-not-allowed select-none transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <HugeiconsIcon icon={item.icon} size={18} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
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
                  "flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150 btn-press",
                  item.active
                    ? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={18}
                  className={cn(item.active ? "text-primary" : "text-muted-foreground")}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-border mt-auto">
        <div className="p-3.5 bg-muted/50 rounded-xl border border-border space-y-1">
          <p className="text-xs font-bold text-foreground">
            Active Learning Path
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Niche 01: Shopping & Money (20 Steps)
          </p>
        </div>
      </div>
    </aside>
  );
}
