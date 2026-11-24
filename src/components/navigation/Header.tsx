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
  Briefcase01Icon,
  Bookmark02Icon,
  SparklesIcon,
  BotIcon,
  Analytics01Icon,
  Settings01Icon,
  Logout01Icon,
  Login01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { getHeaderAccountState, type HeaderUser } from "./header-state";

export type { HeaderUser };

export interface HeaderProps {
  user?: HeaderUser | null;
}

export function Header({ user: initialUser }: HeaderProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(initialUser ?? null);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: liveUser } }) => {
      if (liveUser) {
        setUser({
          id: liveUser.id,
          name: (liveUser.user_metadata?.name as string) || liveUser.email?.split("@")[0],
          email: liveUser.email,
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: (session.user.user_metadata?.name as string) || session.user.email?.split("@")[0],
          email: session.user.email,
        });
      } else {
        setUser(null);
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
    { name: t("nav.professionalEnglish", locale), href: "/professions", icon: Briefcase01Icon },
    { name: locale === "bn" ? "আমি কী বলতে পারি?" : "What Should I Say?", href: "/what-should-i-say", icon: SparklesIcon },
    { name: locale === "bn" ? "এআই পার্টনার" : "AI Partner", href: "/roleplay", icon: BotIcon },
    { name: t("nav.vocabulary", locale), href: "/vocabulary", icon: Bookmark02Icon },
    { name: locale === "bn" ? "আমার অগ্রগতি" : "My Progress", href: "/progress", icon: Analytics01Icon },
    { name: t("nav.settings", locale), href: "/settings", icon: Settings01Icon },
  ];

  return (
    <header className="sticky top-0 z-header flex h-header w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur px-4 md:px-6">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            aria-label={t("nav.openMenu", locale)}
            className="md:hidden inline-flex items-center justify-center size-tap rounded-control text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Menu01Icon} size={22} />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card border-r border-border p-6">
            <SheetHeader className="pb-4 border-b border-border text-left">
              <SheetTitle className="flex items-center gap-3">
                <div className="flex size-control items-center justify-center rounded-control bg-primary text-primary-foreground font-heading text-card-title shadow-xs">
                  E
                </div>
                <div>
                  <div className="font-heading text-card-title leading-tight text-foreground">
                    English Partner
                  </div>
                  <div className="text-chip text-muted-foreground">
                    Menu & Learning Paths
                  </div>
                </div>
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
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex size-control items-center justify-center rounded-control bg-primary text-primary-foreground font-heading text-card-title shadow-xs group-hover:opacity-90 transition-opacity shrink-0">
            E
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-heading text-card-title leading-tight text-foreground">
              English Partner
            </span>
            <span className="text-chip text-muted-foreground">
              Conversation Practice
            </span>
          </div>
        </Link>
      </div>

      {/* Right Controls: Grammar Toggle Slot, Language, Theme, User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle (Dark / Light) */}
        <ThemeToggle />

        {/* Account State: Logged-in Avatar & Log out vs Log in */}
        {account.isLoggedIn ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/dashboard"
              aria-label={account.profileLabel}
              className="flex items-center gap-2 h-control-sm px-2 sm:px-3 rounded-pill bg-muted/60 hover:bg-muted text-foreground transition-colors"
            >
              <div className="flex size-6 items-center justify-center rounded-pill bg-primary text-primary-foreground text-chip">
                {account.initial}
              </div>
              <span className="hidden md:inline-block max-w-24 truncate text-label text-foreground">
                {account.displayName}
              </span>
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
