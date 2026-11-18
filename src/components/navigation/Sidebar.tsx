"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
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
      name: t("nav.dashboard"),
      href: "/dashboard",
      icon: DashboardSquare01Icon,
      active: pathname === "/dashboard",
    },
    {
      name: t("nav.explore"),
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
      name: t("nav.professionalEnglish"),
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
      name: t("nav.vocabulary"),
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
      name: t("nav.settings"),
      href: "#",
      icon: Settings01Icon,
      active: false,
      comingSoon: true,
    },
  ];

  return (
    <aside className="hidden md:flex w-sidebar flex-col border-r border-border bg-card p-4 space-y-6 shrink-0 sticky top-header h-below-header overflow-y-auto z-sidebar">
      <div className="space-y-1.5">
        <span className="px-3 text-chip font-semibold uppercase tracking-wider text-muted-foreground">
          {t("nav.menu")}
        </span>
        <nav className="space-y-1 pt-1.5" aria-label="Main navigation">
          {navItems.map((item) => {
            if (item.comingSoon) {
              return (
                <div
                  key={item.name}
                  aria-disabled="true"
                  title={`${item.name} (Coming soon in future release)`}
                  className="flex items-center justify-between h-control-md px-3 text-label font-medium rounded-control text-muted-foreground/60 cursor-not-allowed select-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={item.icon} size={20} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-chip font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-pill border border-border">
                    {t("landing.soon")}
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 h-control-md px-3 text-label font-semibold rounded-control transition-all duration-fast btn-press",
                  item.active
                    ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={20}
                  className={cn(item.active ? "text-primary" : "text-muted-foreground")}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-border mt-auto">
        <div className="p-4 bg-muted/50 rounded-panel border border-border space-y-1">
          <p className="text-meta font-semibold font-heading text-foreground">
            Active Learning Path
          </p>
          <p className="text-chip text-muted-foreground leading-relaxed">
            Niche 01: Shopping & Money (20 Steps)
          </p>
        </div>
      </div>
    </aside>
  );
}
