"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Globe02Icon, UserIcon } from "@hugeicons/core-free-icons";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[var(--ecp-border)] bg-[var(--ecp-surface)]/95 backdrop-blur px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--ecp-brand-800)] text-white font-bold text-lg shadow-sm group-hover:bg-[var(--ecp-brand-700)] transition-colors">
            E
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight text-[var(--ecp-brand-950)]">
              English Partner
            </span>
            <span className="text-[11px] text-[var(--ecp-text-secondary)] font-medium">
              Conversation Practice
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--ecp-border)] bg-[var(--ecp-surface)] text-xs font-semibold text-[var(--ecp-text-secondary)] hover:text-[var(--ecp-brand-800)] hover:border-[var(--ecp-brand-800)]/30 transition-all cursor-pointer"
        >
          <HugeiconsIcon icon={Globe02Icon} size={15} className="text-[var(--ecp-brand-800)]" />
          <span>বাংলা</span>
        </button>

        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <HugeiconsIcon icon={UserIcon} size={18} />
          </Button>
        </Link>
      </div>
    </header>
  );
}
