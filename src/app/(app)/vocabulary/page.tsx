"use client";

import React, { useState, useEffect, useMemo } from "react";
import { speakText } from "@/lib/audio/speech-engine";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  BookmarkRemove01Icon,
  SparklesIcon,
  FilterIcon,
  Book01Icon,
  Search01Icon,
  Login01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupPrefix } from "@/components/ui/input-group";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LocaleTitle } from "@/components/shared/LocaleTitle";
import { useTranslations, useLiveTranslations } from "@/lib/i18n";
import { isRtlLanguage } from "@/lib/i18n/languages";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { ReviewQueue } from "@/components/learning/ReviewQueue";
import { MagicWordSidebar } from "@/components/vocabulary/MagicWordSidebar";
import {
  MAGIC_CARDS,
  MAGIC_CARD_CATEGORIES,
  type MagicCardCategory,
  type MagicCardDeck,
  type MagicWordItem,
} from "@/content/seed/magic-cards";
import { getDueReviewItems } from "@/lib/srs/sm2";
import {
  SEED_VOCABULARY,
  VocabularyEntry,
} from "@/content/seed/vocabulary";
import { GrammarProvider, useGrammar } from "@/lib/grammar/context";
import { GrammarText } from "@/components/grammar/GrammarText";
import { GrammarToggleButton } from "@/components/grammar/GrammarToggleButton";
import { createFallbackAnnotation } from "@/lib/grammar/fallback";
import { cn } from "@/lib/utils";

export default function VocabularyPage() {
  return (
    <GrammarProvider>
      <VocabularyContent />
    </GrammarProvider>
  );
}

function VocabularyContent() {
  const { locale, translationLocale, t } = useTranslations();
  const { isLineActive, toggleLine } = useGrammar();
  const [activeView, setActiveView] = useState<"magic" | "words" | "srs">("magic");
  const [magicCategory, setMagicCategory] = useState<"all" | MagicCardCategory>("all");
  const [magicSearch, setMagicSearch] = useState("");
  const [activeDeckSlug, setActiveDeckSlug] = useState<string | null>(null);
  const [selectedMagicWord, setSelectedMagicWord] = useState<MagicWordItem | null>(null);
  const [isMobileWordSheetOpen, setIsMobileWordSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPos, setSelectedPos] = useState<string>("all");
  const [savedLemmas, setSavedLemmas] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load saved vocabulary from localStorage
  useEffect(() => {
    let resolvedList = ["excuse", "cost", "jacket", "certainly", "discount", "passport", "wireframes"];
    try {
      const stored = localStorage.getItem("ecp_saved_vocabulary");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          resolvedList = parsed;
        }
      }
    } catch {
      // LocalStorage unavailable
    }

    queueMicrotask(() => {
      setSavedLemmas(resolvedList);
      setIsLoaded(true);
    });
  }, []);

  const playWord = (word: string) => {
    speakText(word);
  };

  const handleRemoveWord = (lemma: string) => {
    const updated = savedLemmas.filter((item) => item !== lemma);
    setSavedLemmas(updated);
    try {
      localStorage.setItem("ecp_saved_vocabulary", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleToggleSaveLemma = (lemma: string) => {
    const exists = savedLemmas.includes(lemma);
    const updated = exists
      ? savedLemmas.filter((item) => item !== lemma)
      : [...savedLemmas, lemma];
    setSavedLemmas(updated);
    try {
      localStorage.setItem("ecp_saved_vocabulary", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const activeDeck: MagicCardDeck | null = useMemo(
    () => MAGIC_CARDS.find((d) => d.slug === activeDeckSlug) ?? null,
    [activeDeckSlug]
  );

  const filteredMagicCards = useMemo(() => {
    const q = magicSearch.trim().toLowerCase();
    return MAGIC_CARDS.filter((deck) => {
      if (magicCategory !== "all" && deck.category !== magicCategory) return false;
      if (!q) return true;
      return (
        deck.title.toLowerCase().includes(q) ||
        deck.tagline.toLowerCase().includes(q) ||
        deck.words.some((w) => w.word.toLowerCase().includes(q))
      );
    });
  }, [magicCategory, magicSearch]);

  const filteredDeckWords = useMemo(() => {
    if (!activeDeck) return [];
    const q = magicSearch.trim().toLowerCase();
    if (!q) return activeDeck.words;
    return activeDeck.words.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
    );
  }, [activeDeck, magicSearch]);

  const totalMagicWordsCount = useMemo(
    () => MAGIC_CARDS.reduce((sum, d) => sum + d.words.length, 0),
    []
  );

  // Resolve saved entries
  const allEntries: VocabularyEntry[] = useMemo(() => {
    return savedLemmas.map((lemma) => {
      const found =
        SEED_VOCABULARY[lemma] ||
        Object.values(SEED_VOCABULARY).find((v) => v.lemma.toLowerCase() === lemma.toLowerCase());
      if (found) return found;
      return {
        word: lemma.charAt(0).toUpperCase() + lemma.slice(1),
        lemma,
        ipa: `/${lemma}/`,
        partOfSpeech: "noun" as const,
        contextualMeaningBn: "সংরক্ষিত শব্দ",
        generalMeaningBn: "সংরক্ষিত শব্দ",
        exampleSentence: `Practice using "${lemma}" in your conversations.`,
      };
    });
  }, [savedLemmas]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const matchesSearch =
        entry.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.contextualMeaningBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.generalMeaningBn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPos =
        selectedPos === "all" || entry.partOfSpeech === selectedPos;
      return matchesSearch && matchesPos;
    });
  }, [allEntries, searchQuery, selectedPos]);

  const needsLiveVocab = translationLocale !== "none" && translationLocale !== "bn";
  const vocabTextsToTranslate = useMemo(() => {
    if (!needsLiveVocab) return [];
    const list: string[] = [];
    for (const item of filteredEntries) {
      if (item.contextualMeaningEn) list.push(item.contextualMeaningEn);
      if (item.generalMeaningEn && item.generalMeaningEn !== item.contextualMeaningEn) {
        list.push(item.generalMeaningEn);
      }
    }
    return list;
  }, [needsLiveVocab, filteredEntries]);

  const { translations: liveVocabMap } = useLiveTranslations(
    vocabTextsToTranslate,
    needsLiveVocab ? translationLocale : "none"
  );

  const dueCount = useMemo(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("ecp_vocabulary_srs")
          : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        return getDueReviewItems(Object.values(parsed), new Date()).length;
      }
    } catch {
      // ignore
    }
    return savedLemmas.length;
  }, [savedLemmas]);

  const posBadgeVariant = (pos: VocabularyEntry["partOfSpeech"]): "brand" | "neutral" | "accent" | "peach" => {
    switch (pos) {
      case "verb":
        return "brand";
      case "noun":
        return "neutral";
      case "adjective":
        return "accent";
      case "adverb":
        return "peach";
      default:
        return "brand";
    }
  };

  const showRightSidebar = activeView === "magic";

  return (
    <div className={cn("w-full", showRightSidebar && "lg:pr-80 xl:pr-96")}>
      <div className="w-full px-4 sm:px-6 lg:px-9 py-6 pb-16 space-y-6">
      {/* Unified Header, Tabs & Filter Card */}
      <Card className="p-5 sm:p-6 rounded-card bg-card border border-border/60 shadow-2xs space-y-4">
        {/* Row 1: Title + Guest/Cloud Sync */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="size-control rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Book01Icon} size={24} />
            </div>
            <div>
              <LocaleTitle
                as="h1"
                titleEn="My Vocabulary Notebook"
                titleBn="আমার শব্দভান্ডার"
                className="text-page-title text-foreground"
              />
              <p className="text-meta text-muted-foreground mt-0.5">
                {locale === "bn"
                  ? "ম্যাজিক কার্ড, সংরক্ষিত শব্দ এবং ফ্ল্যাশকার্ড অনুশীলন"
                  : "40 Magic Cards, saved words, and daily flashcard review"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("text-chip text-muted-foreground bg-muted/60 px-2.5 py-1.5 rounded-control", locale === "bn" && "text-bangla")}>
              ✨ {savedLemmas.length} {locale === "bn" ? "টি শব্দ সেভ করা" : "saved"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAuthModalOpen(true)}
              className={cn("text-label gap-1.5 rounded-control", locale === "bn" && "text-bangla")}
            >
              <HugeiconsIcon icon={Login01Icon} size={15} className="text-primary" />
              <span>{t("vocabulary.syncCloud")}</span>
            </Button>
          </div>
        </div>

        {/* Row 2: Mode Tabs + Search (when browsing Magic Cards) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveView("magic")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-control text-meta transition-all cursor-pointer",
                activeView === "magic"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <HugeiconsIcon icon={SparklesIcon} size={15} />
              <span className={locale === "bn" ? "text-bangla" : ""}>
                {locale === "bn"
                  ? `ম্যাজিক কার্ডস (${MAGIC_CARDS.length})`
                  : `Magic Cards (${MAGIC_CARDS.length})`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("words")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-control text-meta transition-all cursor-pointer",
                activeView === "words"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <HugeiconsIcon icon={Book01Icon} size={15} />
              <span className={locale === "bn" ? "text-bangla" : ""}>
                {t("vocabulary.savedWordsTab").replace("{count}", String(allEntries.length))}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("srs")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-control text-meta transition-all cursor-pointer",
                activeView === "srs"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <HugeiconsIcon icon={SparklesIcon} size={15} />
              <span className={locale === "bn" ? "text-bangla" : ""}>
                {t("vocabulary.flashcardsTab")}
              </span>
              {dueCount > 0 && (
                <Pill variant="warning" size="sm" className="font-mono">
                  {dueCount} {t("vocabulary.dueBadge")}
                </Pill>
              )}
            </button>
          </div>

          {activeView === "magic" && !activeDeck && (
            <div className="relative w-full lg:w-72 shrink-0">
              <HugeiconsIcon
                icon={Search01Icon}
                size={15}
                className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <Input
                type="text"
                value={magicSearch}
                onChange={(e) => setMagicSearch(e.target.value)}
                placeholder={
                  locale === "bn"
                    ? "৪০টি ম্যাজিক কার্ড বা শব্দ খুঁজুন..."
                    : "Search 40 magic cards or words..."
                }
                className="pl-9 h-9 bg-muted/40 border-border/60 rounded-control"
              />
            </div>
          )}
        </div>

        {/* Row 3: Category Filter Pills (when browsing Magic Cards) */}
        {activeView === "magic" && !activeDeck && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/40">
            {MAGIC_CARD_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setMagicCategory(cat.id)}
                className={cn(
                  "px-3 py-1 rounded-pill text-chip transition-all cursor-pointer",
                  magicCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </Card>

      {activeView === "magic" ? (
        <div className="space-y-5">
          {!activeDeck ? (
            <>
              {/* 40 Magic Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredMagicCards.map((deck) => (
                  <Card
                    key={deck.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setActiveDeckSlug(deck.slug);
                      setMagicSearch("");
                      setSelectedMagicWord(deck.words[0] || null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveDeckSlug(deck.slug);
                        setMagicSearch("");
                        setSelectedMagicWord(deck.words[0] || null);
                      }
                    }}
                    className="p-5 bg-card rounded-card border border-border/60 shadow-2xs hover:shadow-card hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-page-title leading-none">{deck.emoji}</span>
                          <Badge variant="neutral" size="sm" className="font-mono">
                            #{String(deck.number).padStart(2, "0")}
                          </Badge>
                        </div>
                        <Badge variant="brand" size="sm">
                          {deck.level}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="font-heading text-card-title text-foreground">
                          {deck.title}
                        </h3>
                        <p className="text-chip text-muted-foreground mt-1 leading-relaxed">
                          {deck.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50 text-chip">
                      <span className="font-mono text-primary font-medium">
                        {deck.words.length} {locale === "bn" ? "টি শব্দ" : "words"}
                      </span>
                      <span className="text-muted-foreground">
                        {locale === "bn" ? "কার্ড খুলুন →" : "Open Card →"}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            /* Open Magic Card View (25+ Words Grid) */
            <Card className="p-5 sm:p-6 bg-card rounded-card border border-border/60 shadow-card space-y-5">
              {/* Deck Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDeckSlug(null);
                      setMagicSearch("");
                      setSelectedMagicWord(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-chip text-primary hover:underline cursor-pointer mb-1"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                    <span>
                      {locale === "bn" ? "সব ৪০টি ম্যাজিক কার্ডে ফিরুন" : "Back to 40 Magic Cards"}
                    </span>
                  </button>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-page-title leading-none">{activeDeck.emoji}</span>
                    <h2 className="font-heading text-section-heading text-foreground">
                      {activeDeck.title}
                    </h2>
                    <Badge variant="brand" size="sm">
                      {activeDeck.level}
                    </Badge>
                    <Badge variant="neutral" size="sm" className="font-mono">
                      {activeDeck.words.length} {locale === "bn" ? "শব্দ" : "words"}
                    </Badge>
                  </div>
                  <p className="text-chip text-muted-foreground">{activeDeck.tagline}</p>
                </div>

                <InputGroup className="bg-muted/40 rounded-control w-full sm:w-64">
                  <InputGroupPrefix>
                    <HugeiconsIcon icon={Search01Icon} size={15} className="text-muted-foreground" />
                  </InputGroupPrefix>
                  <Input
                    type="text"
                    value={magicSearch}
                    onChange={(e) => setMagicSearch(e.target.value)}
                    placeholder={locale === "bn" ? "কার্ডে শব্দ খুঁজুন..." : "Filter words in deck..."}
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-9"
                  />
                </InputGroup>
              </div>

              {/* Words Grid inside Open Magic Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {filteredDeckWords.map((w) => {
                  const isSelected = selectedMagicWord?.id === w.id;
                  return (
                    <div
                      key={w.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedMagicWord(w);
                        if (typeof window !== "undefined" && window.innerWidth < 1024) {
                          setIsMobileWordSheetOpen(true);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedMagicWord(w);
                          if (typeof window !== "undefined" && window.innerWidth < 1024) {
                            setIsMobileWordSheetOpen(true);
                          }
                        }
                      }}
                      className={cn(
                        "p-3 rounded-control border text-left transition-all cursor-pointer flex items-start justify-between gap-2",
                        isSelected
                          ? "bg-primary/10 border-primary ring-2 ring-primary/30 shadow-xs"
                          : "bg-muted/40 border-border/60 hover:bg-muted/80 hover:border-primary/40"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="font-heading text-label font-semibold text-foreground truncate">
                          {w.word}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-chip text-primary font-medium">{w.pos}</span>
                          <span className="text-chip font-mono text-muted-foreground truncate">
                            {w.ipa}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(w.word);
                        }}
                        aria-label={`Pronounce ${w.word}`}
                        className="size-7 rounded-pill bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary shrink-0 cursor-pointer"
                      >
                        <HugeiconsIcon icon={VolumeHighIcon} size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      ) : activeView === "srs" ? (
        <ReviewQueue savedLemmas={savedLemmas} />
      ) : (
        <>
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input using Design System InputGroup */}
        <div className="flex-1">
          <InputGroup className="bg-card">
            <InputGroupPrefix>
              <HugeiconsIcon icon={Search01Icon} size={18} />
            </InputGroupPrefix>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("vocabulary.searchPlaceholder")}
              variant="ghost"
              inputSize="default"
              className="pl-10 text-body"
            />
          </InputGroup>
        </div>

        {/* Part of Speech Filter using Design System Tag */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <div className="text-muted-foreground shrink-0 hidden sm:block ml-2">
            <HugeiconsIcon icon={FilterIcon} size={16} />
          </div>
          {[
            { id: "all", label: t("vocabulary.posAll") },
            { id: "verb", label: t("vocabulary.posVerbs") },
            { id: "noun", label: t("vocabulary.posNouns") },
            { id: "adjective", label: t("vocabulary.posAdjectives") },
            { id: "adverb", label: t("vocabulary.posAdverbs") },
            { id: "phrase", label: t("vocabulary.posPhrases") },
          ].map((cat) => (
            <Tag
              key={cat.id}
              selected={selectedPos === cat.id}
              onClick={() => setSelectedPos(cat.id)}
              variant={selectedPos === cat.id ? "brand" : "outline"}
              size="default"
              className="whitespace-nowrap cursor-pointer text-chip"
            >
              {cat.label}
            </Tag>
          ))}
        </div>
      </div>

      {/* Word Cards Grid */}
      {isLoaded && filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((item) => (
            <div
              key={item.lemma}
              className="p-5 rounded-card bg-card shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Word & Audio */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-card-title text-foreground font-sans">
                        {item.word}
                      </h3>
                      <Badge variant={posBadgeVariant(item.partOfSpeech)} size="sm" className="text-chip">
                        {item.partOfSpeech}
                      </Badge>
                    </div>
                    <span className="text-chip font-mono text-muted-foreground mt-1 block">
                      {item.ipa}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => playWord(item.word)}
                      aria-label={`${t("reader.listen")}: ${item.word}`}
                      className="size-control rounded-control text-primary bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer flex items-center justify-center"
                      title={t("reader.listen")}
                    >
                      <HugeiconsIcon icon={VolumeHighIcon} size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveWord(item.lemma)}
                      aria-label={`${t("vocabulary.removeWord")}: ${item.word}`}
                      className="size-control rounded-control text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer flex items-center justify-center"
                      title={t("vocabulary.removeWord")}
                    >
                      <HugeiconsIcon icon={BookmarkRemove01Icon} size={18} />
                    </button>
                  </div>
                </div>

                {/* Meanings */}
                <div className="py-3 space-y-2">
                  <div
                    dir={isRtlLanguage(translationLocale) ? "rtl" : "ltr"}
                    className={cn("text-body text-foreground leading-relaxed", translationLocale === "bn" && "text-bangla")}
                  >
                    {translationLocale === "bn"
                      ? item.contextualMeaningBn
                      : translationLocale === "none"
                      ? (item.contextualMeaningEn || item.contextualMeaningBn)
                      : (liveVocabMap[(item.contextualMeaningEn || "").trim()] ||
                         item.contextualMeaningEn ||
                         item.contextualMeaningBn)}
                  </div>
                  {((translationLocale === "bn" && item.generalMeaningBn && item.generalMeaningBn !== item.contextualMeaningBn) ||
                    (translationLocale !== "bn" && item.generalMeaningEn && item.generalMeaningEn !== item.contextualMeaningEn)) && (
                    <div
                      dir={isRtlLanguage(translationLocale) ? "rtl" : "ltr"}
                      className={cn("text-meta text-muted-foreground", translationLocale === "bn" && "text-bangla")}
                    >
                      {t("vocabulary.generalMeaningLabel")}:{" "}
                      {translationLocale === "bn"
                        ? item.generalMeaningBn
                        : translationLocale === "none"
                        ? item.generalMeaningEn
                        : (liveVocabMap[(item.generalMeaningEn || "").trim()] || item.generalMeaningEn)}
                    </div>
                  )}

                  {/* Example Sentence with Grammar Support */}
                  {item.exampleSentence && (
                    <div className="pt-2.5 border-t border-border/60 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("text-chip text-muted-foreground uppercase tracking-wider", locale === "bn" && "text-bangla")}>
                          {t("vocabulary.exampleSentenceLabel")}
                        </span>
                        <GrammarToggleButton
                          isActive={isLineActive(`vocab-${item.lemma}`)}
                          onToggle={() => toggleLine(`vocab-${item.lemma}`)}
                          lang={locale === "bn" ? "bn" : "en"}
                        />
                      </div>
                      {isLineActive(`vocab-${item.lemma}`) ? (
                        <div className="text-body py-1">
                          <GrammarText
                            annotation={createFallbackAnnotation(`vocab-${item.lemma}`, item.exampleSentence)}
                          />
                        </div>
                      ) : (
                        <p className="text-meta text-muted-foreground italic">
                          &ldquo;{item.exampleSentence}&rdquo;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Word Forms / Synonyms footer */}
              {item.wordForms && (
                <div className="pt-2 text-chip text-muted-foreground flex flex-wrap gap-2">
                  {item.wordForms.past && <span>Past: {item.wordForms.past}</span>}
                  {item.wordForms.plural && <span>Plural: {item.wordForms.plural}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={t("vocabulary.emptyTitle")}
          description={
            searchQuery
              ? (locale === "bn"
                  ? `"${searchQuery}" এর সাথে মিলে এমন কোনো শব্দ আপনার তালিকায় নেই।`
                  : `No saved words found matching "${searchQuery}".`)
              : t("vocabulary.emptyDescription")
          }
          action={
            <Link href="/explore">
              <Button size="sm" className={locale === "bn" ? "text-bangla" : ""}>
                {locale === "bn" ? "কথোপকথন এক্সপ্লোর করুন" : "Explore Conversations"}
              </Button>
            </Link>
          }
        />
      )}
        </>
      )}

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title={locale === "bn" ? "শব্দভান্ডার ক্লাউডে সিঙ্ক করুন" : "Sync Vocabulary to Cloud"}
        description={locale === "bn" ? "লগইন করলে আপনার সব ডিভাইসে সংরক্ষিত শব্দভান্ডার পাওয়া যাবে এবং কখনো মুছে যাবে না।" : "Sign in to keep your vocabulary synced across devices permanently."}
      />
      </div>

      {/* Fixed Right Word Inspector Sidebar (Desktop lg+ on Magic Cards tab) */}
      {showRightSidebar && (
        <aside className="hidden lg:flex flex-col fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4">
          <MagicWordSidebar
            activeDeck={activeDeck}
            selectedWord={selectedMagicWord}
            isSaved={selectedMagicWord ? savedLemmas.includes(selectedMagicWord.lemma) : false}
            onToggleSave={handleToggleSaveLemma}
            totalCards={MAGIC_CARDS.length}
            totalWords={totalMagicWordsCount}
            savedCount={savedLemmas.length}
          />
        </aside>
      )}

      {/* Mobile / Tablet Word Inspector Sheet (< lg) */}
      <Sheet open={isMobileWordSheetOpen} onOpenChange={setIsMobileWordSheetOpen}>
        <SheetContent
          side="bottom"
          className="lg:hidden max-h-[85vh] overflow-y-auto rounded-t-card p-4 sm:p-5 bg-background"
        >
          <SheetHeader className="pb-3 border-b border-border/60 text-left">
            <SheetTitle className="text-card-title text-foreground">
              {selectedMagicWord?.word || (locale === "bn" ? "শব্দের বিস্তারিত" : "Word Details")}
            </SheetTitle>
          </SheetHeader>
          <div className="pt-4">
            <MagicWordSidebar
              activeDeck={activeDeck}
              selectedWord={selectedMagicWord}
              isSaved={selectedMagicWord ? savedLemmas.includes(selectedMagicWord.lemma) : false}
              onToggleSave={handleToggleSaveLemma}
              totalCards={MAGIC_CARDS.length}
              totalWords={totalMagicWordsCount}
              savedCount={savedLemmas.length}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
