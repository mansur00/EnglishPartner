"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Globe02Icon,
  UserIcon,
  Menu01Icon,
  DashboardSquare01Icon,
  CompassIcon,
  Briefcase01Icon,
  Bookmark02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const mobileNavLinks = [
    { name: "Dashboard", href: "/dashboard", icon: DashboardSquare01Icon },
    { name: "Explore", href: "/explore", icon: CompassIcon },
    { name: "Shopping Ladder (20 Steps)", href: "/explore/category/shopping-and-money", icon: SparklesIcon },
    { name: "Professional English", href: "/explore?category=workplace-business", icon: Briefcase01Icon },
    { name: "My Vocabulary", href: "/vocabulary", icon: Bookmark02Icon },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/90 backdrop-blur px-4 md:px-6">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            aria-label="Open navigation menu"
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card border-r border-border p-5">
            <SheetHeader className="pb-4 border-b border-border text-left">
              <SheetTitle className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-xs">
                  E
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight text-foreground">
                    English Partner
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Menu & Learning Paths
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>

            <nav className="space-y-1.5 mt-5">
              {mobileNavLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <HugeiconsIcon icon={link.icon} size={18} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-xs group-hover:opacity-90 transition-opacity">
            E
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight text-foreground">
              English Partner
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Conversation Practice
            </span>
          </div>
        </Link>
      </div>

      {/* Right Controls: Grammar Toggle Slot, Language, Theme, User Profile */}
      <div className="flex items-center gap-2">
        {/* Language Badge */}
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
          title="Bilingual mode: English & বাংলা"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={Globe02Icon} size={14} className="text-primary" />
          <span>বাংলা</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <ThemeToggle />

        {/* User Avatar */}
        <Link href="/dashboard" aria-label="Learner Profile">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground">
            <HugeiconsIcon icon={UserIcon} size={18} />
          </Button>
        </Link>
      </div>
    </header>
  );
}
