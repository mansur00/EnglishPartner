"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Globe02Icon,
  CheckmarkCircle02Icon,
  ArrowDown01Icon,
  Settings01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import {
  getLanguageMeta,
  searchGlobalLanguages,
  type TranslationLocale,
} from "@/lib/i18n/languages";
import { useTranslations } from "@/lib/i18n";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

interface TranslationOptionProps {
  code: TranslationLocale;
  nativeName: string;
  englishName?: string;
  badge?: string;
  isRtl?: boolean;
  isSelected: boolean;
  onSelect: (code: TranslationLocale) => void;
}

function TranslationOptionItem({
  code,
  nativeName,
  englishName,
  badge,
  isRtl,
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
      <div className="flex flex-col min-w-0 pr-2">
        <span className="font-heading text-label leading-tight truncate">
          {nativeName}
        </span>
        {englishName && englishName !== nativeName && (
          <span className="text-chip text-muted-foreground truncate">
            {englishName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {isRtl && (
          <Tag variant="outline" size="sm">
            RTL
          </Tag>
        )}
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

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { locale, translationLocale, setTranslationLocale, t } = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
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
    return getLanguageMeta(translationLocale)?.nativeName || "বাংলা";
  };

  const filteredLanguages = searchGlobalLanguages(searchQuery).filter((l) => l.code !== "en");
  const showNoTranslation =
    !searchQuery.trim() ||
    "no translation off english only".includes(searchQuery.trim().toLowerCase());

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
          className="absolute right-0 mt-1.5 w-72 rounded-card bg-card p-2 shadow-card z-modal animate-in fade-in zoom-in-95 duration-fast"
        >
          <div className="px-2.5 py-1.5 mb-1.5 border-b border-border">
            <p className="text-chip text-muted-foreground uppercase tracking-wide">
              {t("header.translationLanguageHeader")}
            </p>
          </div>

          {/* Search Input */}
          <div className="px-1.5 pb-2">
            <div className="relative flex items-center">
              <HugeiconsIcon
                icon={Search01Icon}
                size={15}
                className="absolute left-2.5 text-muted-foreground pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === "bn" ? "ভাষা খুঁজুন (যেমন: Arabic, Urdu)..." : "Search language..."}
                className="w-full h-control-sm pl-8 pr-3 rounded-control bg-muted/60 text-chip text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1 pr-0.5">
            {showNoTranslation && (
              <TranslationOptionItem
                code="none"
                nativeName={t("header.noTranslation")}
                englishName={t("header.englishOnlySubtitle")}
                isSelected={translationLocale === "none"}
                onSelect={handleSelect}
              />
            )}

            {filteredLanguages.map((lang) => (
              <TranslationOptionItem
                key={lang.code}
                code={lang.code}
                nativeName={lang.nativeName}
                englishName={lang.name}
                badge={lang.status === "beta" ? "Beta" : undefined}
                isRtl={lang.direction === "rtl"}
                isSelected={translationLocale === lang.code}
                onSelect={handleSelect}
              />
            ))}

            {filteredLanguages.length === 0 && !showNoTranslation && (
              <p className="px-3 py-4 text-center text-chip text-muted-foreground">
                {locale === "bn" ? "কোনো ভাষা পাওয়া যায়নি" : "No language found"}
              </p>
            )}
          </div>

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
