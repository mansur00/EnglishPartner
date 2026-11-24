"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Globe02Icon,
  CheckmarkCircle02Icon,
  ArrowDown01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import {
  LANGUAGES_REGISTRY,
  type LanguageMeta,
  type TranslationLocale,
} from "@/lib/i18n/languages";
import { useTranslations } from "@/lib/i18n";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

interface TranslationOptionProps {
  code: TranslationLocale;
  label: string;
  badge?: string;
  isSelected: boolean;
  onSelect: (code: TranslationLocale) => void;
}

function TranslationOptionItem({
  code,
  label,
  badge,
  isSelected,
  onSelect,
}: TranslationOptionProps) {
  return (
    <button
      type="button"
      role="menuitem"
      aria-current={isSelected ? "true" : undefined}
      onClick={() => onSelect(code)}
      className={cn(
        "flex w-full items-center justify-between px-3 py-2 rounded-control text-left transition-colors cursor-pointer",
        isSelected
          ? "bg-primary/10 text-primary"
          : "text-foreground hover:bg-muted"
      )}
    >
      <span className="font-heading text-label leading-none">{label}</span>

      <div className="flex items-center gap-2">
        {badge && (
          <Tag variant="warning" size="sm">
            {badge}
          </Tag>
        )}
        {isSelected ? (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={18}
            className="text-primary shrink-0"
          />
        ) : (
          <span className="text-chip text-muted-foreground uppercase">
            {code === "none" ? "OFF" : code}
          </span>
        )}
      </div>
    </button>
  );
}

function PlannedLanguageItem({ lang }: { lang: LanguageMeta }) {
  return (
    <div className="flex w-full items-center justify-between px-3 py-2 rounded-control opacity-60 text-muted-foreground">
      <span className="font-heading text-label leading-none">
        {lang.nativeName}
      </span>
      <div className="flex items-center gap-1.5">
        {lang.direction === "rtl" && (
          <Tag variant="outline" size="sm">
            RTL
          </Tag>
        )}
        <Tag variant="secondary" size="sm">
          Soon
        </Tag>
      </div>
    </div>
  );
}

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { translationLocale, setTranslationLocale, t } = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: TranslationLocale) => {
    setTranslationLocale(code);
    setIsOpen(false);
  };

  const getActiveLabel = () => {
    if (translationLocale === "none") return t("header.englishOnlySubtitle");
    return LANGUAGES_REGISTRY[translationLocale]?.nativeName || LANGUAGES_REGISTRY.bn.nativeName;
  };

  const plannedLangs = Object.values(LANGUAGES_REGISTRY).filter((l) => l.status === "planned");

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("header.translationLanguageHeader")}
        onClick={() => setIsOpen(!isOpen)}
        className="btn-press inline-flex items-center gap-1.5 h-control-sm px-2.5 sm:px-3 rounded-pill border border-border bg-transparent text-label text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <HugeiconsIcon icon={Globe02Icon} size={16} className="text-primary shrink-0" />
        <span className="font-heading text-label">{getActiveLabel()}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          className={cn("transition-transform duration-fast opacity-70", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-sidebar rounded-card bg-card p-2 shadow-card z-modal animate-in fade-in zoom-in-95 duration-fast"
        >
          <div className="px-3 py-1.5 mb-1 border-b border-border">
            <p className="text-chip text-muted-foreground uppercase tracking-wide">
              {t("header.translationLanguageHeader")}
            </p>
          </div>

          <div className="space-y-1">
            <TranslationOptionItem
              code="bn"
              label={LANGUAGES_REGISTRY.bn.nativeName}
              isSelected={translationLocale === "bn"}
              onSelect={handleSelect}
            />
            <TranslationOptionItem
              code="hi"
              label={LANGUAGES_REGISTRY.hi.nativeName}
              badge="Beta"
              isSelected={translationLocale === "hi"}
              onSelect={handleSelect}
            />
            <TranslationOptionItem
              code="none"
              label={t("header.noTranslation")}
              isSelected={translationLocale === "none"}
              onSelect={handleSelect}
            />
          </div>

          {plannedLangs.length > 0 && (
            <>
              <div className="px-3 pt-2.5 pb-1 mt-2 border-t border-border">
                <p className="text-chip text-muted-foreground uppercase tracking-wide">
                  Upcoming Roadmap
                </p>
              </div>
              <div className="space-y-1">
                {plannedLangs.map((lang) => (
                  <PlannedLanguageItem key={lang.code} lang={lang} />
                ))}
              </div>
            </>
          )}

          <div className="pt-2 mt-2 border-t border-border">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-control text-chip text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <HugeiconsIcon icon={Settings01Icon} size={14} className="shrink-0" />
              <span>{t("header.changeSystemInSettings")}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
