"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { t, useLocale } from "@/lib/i18n";
import { useFeatureFlags } from "@/lib/features/use-feature-flags";
import { useSessionAccess } from "@/components/auth/SessionIsolationProvider";
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
  SparklesIcon,
  CheckmarkBadge01Icon,
  BookOpen01Icon,
  HeadphonesIcon,
} from "@hugeicons/core-free-icons";

interface NavItem {
  name: string;
  href: string;
  icon: IconSvgElement;
  active: boolean;
  comingSoon?: boolean;
  featureKey?: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const { isEnabled } = useFeatureFlags();
  const { user } = useSessionAccess();

  const navItems: NavItem[] = [
    {
      name: t("nav.dashboard", locale),
      href: "/dashboard",
      icon: DashboardSquare01Icon,
      active: pathname.startsWith("/dashboard"),
    },
    {
      name: t("nav.dailyPractice", locale),
      href: "/daily-practice",
      icon: Calendar03Icon,
      active: pathname === "/daily-practice",
    },
    {
      name: t("nav.explore", locale),
      href: "/explore",
      icon: CompassIcon,
      active:
        pathname.startsWith("/explore") ||
        pathname.startsWith("/conversations") ||
        pathname.startsWith("/professions"),
    },
    {
      name: t("nav.roleplay", locale),
      href: "/roleplay",
      icon: BotIcon,
      active: pathname === "/roleplay",
      featureKey: "ai_partner",
    },
    {
      name: locale === "bn" ? "অডিও বুক" : "Audio Books",
      href: "/audiobooks",
      icon: HeadphonesIcon,
      active: pathname.startsWith("/audiobooks"),
    },
    {
      name: t("nav.grammarPath", locale),
      href: "/grammar-path",
      icon: BookOpen01Icon,
      active: pathname.startsWith("/grammar-path"),
    },
    {
      name: t("nav.vocabulary", locale),
      href: "/vocabulary",
      icon: Bookmark02Icon,
      active: pathname === "/vocabulary",
    },
    {
      name: locale === "bn" ? "বানান মাস্টার" : "Spell Master",
      href: "/spell-master",
      icon: SparklesIcon,
      active: pathname.startsWith("/spell-master"),
      featureKey: "spell_master",
    },
    {
      name: locale === "bn" ? "কুইজ" : "Quiz",
      href: "/quiz",
      icon: CheckmarkBadge01Icon,
      active: pathname.startsWith("/quiz"),
      featureKey: "quiz",
    },
    {
      name: t("nav.sayIt", locale),
      href: "/what-should-i-say",
      icon: SparklesIcon,
      active: pathname === "/what-should-i-say",
    },
    {
      name: t("nav.progress", locale),
      href: "/progress",
      icon: Analytics01Icon,
      active: pathname === "/progress",
    },
    {
      name: t("nav.settings", locale),
      href: "/settings",
      icon: Settings01Icon,
      active: pathname === "/settings",
    },
    ...(user?.role === "admin"
      ? [
          {
            name: locale === "bn" ? "অ্যাডমিন প্যানেল" : "Admin Panel",
            href: "/admin-panel",
            icon: Briefcase01Icon,
            active: pathname.startsWith("/admin-panel"),
          },
        ]
      : []),
  ];

  return (
    <aside suppressHydrationWarning className="hidden md:flex w-sidebar flex-col border-r border-border bg-card p-4 space-y-6 shrink-0 sticky top-header h-below-header overflow-y-auto z-sidebar">
      <div className="space-y-1.5">
        <span className="px-3 text-chip uppercase tracking-wider text-muted-foreground">
          {t("nav.menu", locale)}
        </span>
        <nav className="space-y-1 pt-1.5" aria-label={t("nav.mainNav", locale)}>
          {navItems
            .filter((item) => !item.featureKey || isEnabled(item.featureKey))
            .map((item) => {
            if (item.comingSoon) {
              return (
                <div
                  key={item.name}
                  aria-disabled="true"
                  title={`${item.name} (Coming soon in future release)`}
                  className="flex items-center justify-between h-control-md px-3 text-label rounded-control text-muted-foreground/60 cursor-not-allowed select-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={item.icon} size={20} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-chip bg-muted text-muted-foreground px-2 py-0.5 rounded-pill">
                    {t("landing.soon", locale)}
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 h-control-md px-3 text-label rounded-control transition-all duration-fast btn-press",
                  item.active
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
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

      <div className="pt-4 border-t border-border mt-auto mb-6">
        <div className="p-4 bg-muted/60 rounded-panel space-y-1">
          <p className="text-meta font-heading text-foreground">
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
