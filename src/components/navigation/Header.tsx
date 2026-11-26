"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  DashboardSquare01Icon,
  CompassIcon,
  Calendar03Icon,
  Bookmark02Icon,
  SparklesIcon,
  BotIcon,
  Analytics01Icon,
  Settings01Icon,
  Logout01Icon,
  Login01Icon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFeatureFlags } from "@/lib/features/use-feature-flags";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getHeaderAccountState, type HeaderUser } from "./header-state";

export type { HeaderUser };

export interface HeaderProps {
  user?: HeaderUser | null;
}

export function Header({ user: initialUser }: HeaderProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(initialUser ?? null);
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);
  const pathname = usePathname();
  const { isEnabled } = useFeatureFlags();

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const syncProfile = async () => {
      try {
        const res = await fetch("/api/v1/auth/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.user) {
          setUser({
            id: data.user.id,
            name: data.user.full_name || data.user.email?.split("@")[0],
            email: data.user.email,
          });
          setUserRole(data.user.role === "admin" ? "admin" : "user");
        } else {
          setUser(null);
          setUserRole(null);
        }
      } catch {
        // Ignore network errors
      }
    };

    void syncProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void syncProfile();
      } else {
        setUser(null);
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [initialUser]);

  const locale = useLocale();
  const account = getHeaderAccountState(user, locale);

  const mobileNavLinks = [
    { name: t("nav.dashboard", locale), href: "/dashboard", icon: DashboardSquare01Icon },
    { name: t("nav.explore", locale), href: "/explore", icon: CompassIcon },
    { name: t("nav.dailyPractice", locale), href: "/daily-practice", icon: Calendar03Icon },
    { name: t("nav.grammarPath", locale), href: "/grammar-path", icon: BookOpen01Icon },
    { name: t("nav.sayIt", locale), href: "/what-should-i-say", icon: SparklesIcon },
    { name: t("nav.roleplay", locale), href: "/roleplay", icon: BotIcon, featureKey: "ai_partner" },
    { name: t("nav.vocabulary", locale), href: "/vocabulary", icon: Bookmark02Icon },
    {
      name: locale === "bn" ? "বানান মাস্টার" : "Spell Master",
      href: "/spell-master",
      icon: SparklesIcon,
      featureKey: "spell_master",
    },
    { name: t("nav.progress", locale), href: "/progress", icon: Analytics01Icon },
    { name: t("nav.settings", locale), href: "/settings", icon: Settings01Icon },
  ].filter((item) => !item.featureKey || isEnabled(item.featureKey));

  return (
    <header suppressHydrationWarning className="sticky top-0 z-header flex h-header w-full items-center justify-between gap-2 border-b border-border bg-card/90 backdrop-blur px-3 sm:px-4 md:px-6">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Drawer Trigger */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            aria-label={t("nav.openMenu", locale)}
            className="md:hidden inline-flex items-center justify-center size-tap shrink-0 rounded-control text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Menu01Icon} size={22} />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card border-r border-border p-6">
            <SheetHeader className="pb-4 border-b border-border text-left">
              <SheetTitle className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.svg"
                  alt="English Partner"
                  className="h-9 w-auto object-contain"
                />
              </SheetTitle>
            </SheetHeader>

            <nav className="space-y-2 mt-6">
              {mobileNavLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-control text-label transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <HugeiconsIcon icon={link.icon} size={20} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center group shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="English Partner"
            className="h-7 sm:h-9 md:h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
          />
        </Link>
      </div>

      {/* Right Controls: Language & Theme (hidden on mobile), User Profile / Login */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Language Switcher & Theme Toggle (desktop/tablet only) */}
        <div className="hidden md:flex items-center gap-2.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Account State: Logged-in Avatar & Log out vs Log in */}
        {account.isLoggedIn ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/settings"
              aria-label={account.profileLabel}
              className="flex items-center gap-2 h-control-sm px-2 sm:px-3 rounded-pill bg-muted/60 hover:bg-muted text-foreground transition-colors"
            >
              <div className="flex size-6 items-center justify-center rounded-pill bg-primary text-primary-foreground text-chip">
                {account.initial}
              </div>
              <span className="hidden md:inline-block max-w-24 truncate text-label text-foreground">
                {account.displayName}
              </span>
              {userRole && (
                <Badge
                  variant={userRole === "admin" ? "brand" : "outline"}
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  {userRole === "admin" ? "Admin" : "User"}
                </Badge>
              )}
            </Link>
            <form action={account.signoutAction} method="POST" className="inline-flex">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                aria-label={account.logoutLabel}
                title={account.logoutLabel}
                className="h-control-sm px-2 sm:px-2.5 rounded-control text-muted-foreground hover:text-foreground text-label"
              >
                <HugeiconsIcon icon={Logout01Icon} size={16} />
                <span className="hidden sm:inline-block ml-1">{account.logoutLabel}</span>
              </Button>
            </form>
          </div>
        ) : (
          <Link href={account.loginHref}>
            <Button
              variant="outline"
              size="sm"
              className="h-control-sm px-3 rounded-control text-label text-foreground border-border hover:bg-muted"
            >
              <HugeiconsIcon icon={Login01Icon} size={16} className="mr-1.5" />
              <span>{account.loginLabel}</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
