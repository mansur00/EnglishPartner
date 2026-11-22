"use client";

import { useState, useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Globe02Icon,
  CheckmarkCircle02Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import {
  LANGUAGES_REGISTRY,
  SUPPORTED_LOCALES,
  isRtlLanguage,
  type LanguageMeta,
  type SupportedLocale,
} from "@/lib/i18n/languages";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

interface LanguageItemProps {
  lang: LanguageMeta;
  isSelected: boolean;
  onSelect: (code: SupportedLocale) => void;
}

function ActiveLanguageItem({ lang, isSelected, onSelect }: LanguageItemProps) {
  const isSupported = (SUPPORTED_LOCALES as readonly string[]).includes(lang.code);

  return (
    <button
      type="button"
      role="menuitem"
      aria-current={isSelected ? "true" : undefined}
      onClick={() => isSupported && onSelect(lang.code as SupportedLocale)}
      className={cn(
        "flex w-full items-center justify-between px-3 py-2 rounded-control text-left transition-colors cursor-pointer",
        isSelected
          ? "bg-primary/10 text-primary"
          : "text-foreground hover:bg-muted"
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="font-heading text-card-title leading-none">
          {lang.nativeName}
        </span>
        <span className="text-chip text-muted-foreground">
          ({lang.name})
        </span>
      </div>

      <div className="flex items-center gap-2">
        {lang.status === "beta" && (
          <Tag variant="warning" size="sm">
            Beta
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
            {lang.code}
          </span>
        )}
      </div>
    </button>
  );
}

function PlannedLanguageItem({ lang }: { lang: LanguageMeta }) {
  return (
    <div className="flex w-full items-center justify-between px-3 py-2 rounded-control opacity-60 text-muted-foreground">
      <div className="flex items-center gap-2.5">
        <span className="font-heading text-card-title leading-none">
          {lang.nativeName}
        </span>
        <span className="text-chip">
          ({lang.name})
        </span>
      </div>
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
  const [locale, setLocale] = useState<SupportedLocale>("bn");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const saved = localStorage.getItem("ecp_user_locale") as SupportedLocale | null;
      if (saved && (SUPPORTED_LOCALES as readonly string[]).includes(saved)) {
        setLocale(saved);
        document.documentElement.lang = saved;
        document.documentElement.dir = isRtlLanguage(saved) ? "rtl" : "ltr";
      }
    });
  }, []);

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

  const handleSelect = (code: SupportedLocale) => {
    setLocale(code);
    setIsOpen(false);
    localStorage.setItem("ecp_user_locale", code);
    document.documentElement.lang = code;
    document.documentElement.dir = isRtlLanguage(code) ? "rtl" : "ltr";
  };

  const currentMeta = LANGUAGES_REGISTRY[locale] || LANGUAGES_REGISTRY.bn;
  const availableLangs = Object.values(LANGUAGES_REGISTRY).filter((l) => l.status !== "planned");
  const plannedLangs = Object.values(LANGUAGES_REGISTRY).filter((l) => l.status === "planned");

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Select translation & interface language"
        onClick={() => setIsOpen(!isOpen)}
        className="btn-press inline-flex items-center gap-1.5 h-control-sm px-2.5 sm:px-3 rounded-pill border border-border bg-card text-label text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
      >
        <HugeiconsIcon icon={Globe02Icon} size={16} className="text-primary shrink-0" />
        <span className="font-heading text-card-title">{currentMeta.nativeName}</span>
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
          className="absolute right-0 mt-1.5 w-sidebar rounded-card border border-border bg-card p-2 shadow-card z-modal animate-in fade-in zoom-in-95 duration-fast"
        >
          <div className="px-3 py-1.5 mb-1 border-b border-border">
            <p className="text-chip text-muted-foreground uppercase tracking-wide">
              Translations & Guidance
            </p>
          </div>

          <div className="space-y-1">
            {availableLangs.map((lang) => (
              <ActiveLanguageItem
                key={lang.code}
                lang={lang}
                isSelected={locale === lang.code}
                onSelect={handleSelect}
              />
            ))}
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
        </div>
      )}
    </div>
  );
}
