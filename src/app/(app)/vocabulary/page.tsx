"use client";

import React, { useState, useEffect, useMemo } from "react";
import { speakText } from "@/lib/audio/speech-engine";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  SparklesIcon,
  Book01Icon,
  Search01Icon,
  Login01Icon,
  ArrowLeft01Icon,
  Add01Icon,
  CheckmarkCircle02Icon,
  AiLockIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useSessionAccess } from "@/components/auth/SessionIsolationProvider";
import { GuestLimitBanner } from "@/components/auth/GuestLimitBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LocaleTitle } from "@/components/shared/LocaleTitle";
import { useTranslations } from "@/lib/i18n";
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
import {
  DEFAULT_CATEGORY_EMOJIS,
  addLemmaToCategory,
  createCategoryInList,
  loadSavedCategories,
  persistSavedCategories,
  removeLemmaFromCategory,
  type SavedVocabCategory,
} from "@/lib/vocabulary/saved-categories";
import { getDueReviewItems } from "@/lib/srs/sm2";
import { SEED_VOCABULARY } from "@/content/seed/vocabulary";
import { GrammarProvider } from "@/lib/grammar/context";
import { cn } from "@/lib/utils";

export default function VocabularyPage() {
  return (
    <GrammarProvider>
      <VocabularyContent />
    </GrammarProvider>
  );
}

function VocabularyContent() {
  const { locale, t } = useTranslations();
  const { isGuest, config, getGuestLimit } = useSessionAccess();
  const [activeView, setActiveView] = useState<"magic" | "words" | "srs">("magic");
  const [magicCategory, setMagicCategory] = useState<"all" | MagicCardCategory>("all");
  const [magicSearch, setMagicSearch] = useState("");
  const [activeDeckSlug, setActiveDeckSlug] = useState<string | null>(null);
  const [selectedMagicWord, setSelectedMagicWord] = useState<MagicWordItem | null>(null);
  const [isMobileWordSheetOpen, setIsMobileWordSheetOpen] = useState(false);

  // Saved Vocabulary Categories state
  const [savedCategories, setSavedCategories] = useState<SavedVocabCategory[]>([]);
  const [activeSavedCatId, setActiveSavedCatId] = useState<string | null>(null);
  const [savedSearch, setSavedSearch] = useState("");
  const [savePickerLemma, setSavePickerLemma] = useState<string | null>(null);
  const [isCreateCatOpen, setIsCreateCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("⭐");

  const [savedLemmas, setSavedLemmas] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load saved vocabulary & categories from localStorage
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

    const cats = loadSavedCategories(resolvedList);
    const mergedLemmas = Array.from(
      new Set([...resolvedList, ...cats.flatMap((c) => c.lemmas)])
    );

    queueMicrotask(() => {
      setSavedCategories(cats);
      setSavedLemmas(mergedLemmas);
    });
  }, []);

  const handleOpenSavePicker = (lemma: string) => {
    setSavePickerLemma(lemma.toLowerCase().trim());
  };

  const handleAssignToCategory = (lemma: string, categoryId: string) => {
    const clean = lemma.toLowerCase().trim();
    const targetCat = savedCategories.find((c) => c.id === categoryId);
    const alreadyInCat = targetCat?.lemmas.includes(clean);
    const nextCats = alreadyInCat
      ? removeLemmaFromCategory(savedCategories, clean, categoryId)
      : addLemmaToCategory(savedCategories, clean, categoryId);
    setSavedCategories(nextCats);
    const nextAll = persistSavedCategories(nextCats);
    setSavedLemmas(nextAll);
  };

  const handleCreateCategoryAndSave = () => {
    if (!newCatName.trim()) return;
    const { categories: withNew, created } = createCategoryInList(
      savedCategories,
      newCatName,
      newCatEmoji
    );
    const nextCats = savePickerLemma
      ? addLemmaToCategory(withNew, savePickerLemma, created.id)
      : withNew;
    setSavedCategories(nextCats);
    const nextAll = persistSavedCategories(nextCats);
    setSavedLemmas(nextAll);
    setNewCatName("");
    setNewCatEmoji("⭐");
    setIsCreateCatOpen(false);
    if (savePickerLemma) {
      setSavePickerLemma(null);
    }
  };

  const handleRemoveFromActiveCategory = (lemma: string) => {
    if (!activeSavedCatId) return;
    const nextCats = removeLemmaFromCategory(savedCategories, lemma, activeSavedCatId);
    setSavedCategories(nextCats);
    const nextAll = persistSavedCategories(nextCats);
    setSavedLemmas(nextAll);
    if (selectedMagicWord?.lemma === lemma) {
      setSelectedMagicWord(null);
    }
  };

  // Lookup any lemma across MAGIC_CARDS and SEED_VOCABULARY
  const magicWordByLemma = useMemo(() => {
    const map = new Map<string, MagicWordItem>();
    for (const deck of MAGIC_CARDS) {
      for (const w of deck.words) {
        if (!map.has(w.lemma)) map.set(w.lemma, w);
      }
    }
    return map;
  }, []);

  const resolveLemmaToWordItem = useMemo(() => {
    return (lemma: string): MagicWordItem => {
      const clean = lemma.toLowerCase().trim();
      const fromMagic = magicWordByLemma.get(clean);
      if (fromMagic) return fromMagic;

      const fromSeed =
        SEED_VOCABULARY[clean] ||
        Object.values(SEED_VOCABULARY).find((v) => v.lemma.toLowerCase() === clean);
      if (fromSeed) {
        return {
          id: `saved-${clean}`,
          word: fromSeed.word,
          lemma: fromSeed.lemma,
          pos: fromSeed.partOfSpeech,
          ipa: fromSeed.ipa,
          meaning: fromSeed.contextualMeaningEn || fromSeed.contextualMeaningBn,
          example: fromSeed.exampleSentence,
        };
      }
      return {
        id: `saved-${clean}`,
        word: clean.charAt(0).toUpperCase() + clean.slice(1),
        lemma: clean,
        pos: "noun",
        ipa: `/${clean}/`,
        meaning: "Saved vocabulary word",
        example: `Practice using "${clean}" in your daily conversations.`,
      };
    };
  }, [magicWordByLemma]);

  const activeSavedCategory = useMemo(
    () => savedCategories.find((c) => c.id === activeSavedCatId) ?? null,
    [savedCategories, activeSavedCatId]
  );

  const activeSavedWords = useMemo(() => {
    if (!activeSavedCategory) return [];
    const items = activeSavedCategory.lemmas.map(resolveLemmaToWordItem);
    const q = savedSearch.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (w) => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)
    );
  }, [activeSavedCategory, resolveLemmaToWordItem, savedSearch]);

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

  const showRightSidebar = activeView === "magic" || activeView === "words";

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

          {/* Row 2: Mode Tabs (Full-width single row) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant={activeView === "magic" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("magic")}
            >
              <HugeiconsIcon icon={SparklesIcon} size={15} />
              <span className={locale === "bn" ? "text-bangla" : ""}>
                {locale === "bn"
                  ? `ম্যাজিক কার্ডস (${MAGIC_CARDS.length})`
                  : `Magic Cards (${MAGIC_CARDS.length})`}
              </span>
            </Button>

            <Button
              type="button"
              variant={activeView === "words" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("words")}
            >
              <HugeiconsIcon icon={Book01Icon} size={15} />
              <span className={locale === "bn" ? "text-bangla" : ""}>
                {t("vocabulary.savedWordsTab").replace("{count}", String(savedLemmas.length))}
              </span>
            </Button>

            <Button
              type="button"
              variant={activeView === "srs" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("srs")}
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
            </Button>
          </div>

          {/* Row 3: Search + Category Dropdown on One Line (when browsing Magic Cards) */}
          {activeView === "magic" && !activeDeck && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-3 border-t border-border/40 items-center">
              <div className="md:col-span-7 relative">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={16}
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
                  className="pl-9 h-11 bg-muted/40 border-border/60 rounded-control"
                />
              </div>

              <div className="md:col-span-5">
                <Select
                  value={magicCategory}
                  onValueChange={(val) =>
                    setMagicCategory((val ?? "all") as MagicCardCategory | "all")
                  }
                >
                  <SelectTrigger
                    aria-label={locale === "bn" ? "কার্ড ক্যাটাগরি নির্বাচন করুন" : "Filter Magic Cards by category"}
                    className="w-full h-11 text-label"
                  >
                    <SelectValue>
                      {MAGIC_CARD_CATEGORIES.find((c) => c.id === magicCategory)?.label ?? "All"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {MAGIC_CARD_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </Card>

        {activeView === "magic" ? (
          <div className="space-y-5">
            {!activeDeck ? (
              <>
                {isGuest && (
                  <GuestLimitBanner
                    previewPercent={config.guest_preview_percent}
                    featureName={locale === "bn" ? "ম্যাজিক কার্ডস (Vocabulary)" : "Magic Cards"}
                    nextPath="/vocabulary"
                  />
                )}
                {/* 40 Magic Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredMagicCards.map((deck, idx) => {
                    const guestUnlockedCount = getGuestLimit(filteredMagicCards.length, 2);
                    const isLocked = isGuest && idx >= guestUnlockedCount;
                    if (isLocked) {
                      return (
                        <Link
                          key={deck.id}
                          href="/auth/login?next=/vocabulary"
                          className="block"
                        >
                          <Card className="p-5 bg-card rounded-card border border-border/60 opacity-65 hover:opacity-95 transition-all flex flex-col justify-between gap-3 h-full">
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-page-title leading-none">{deck.emoji}</span>
                                  <Badge variant="neutral" size="sm" className="font-mono">
                                    #{String(deck.number).padStart(2, "0")}
                                  </Badge>
                                </div>
                                <Badge variant="warning" size="sm" className="gap-1">
                                  <HugeiconsIcon icon={AiLockIcon} size={12} />
                                  <span>{locale === "bn" ? "লকড" : "Locked"}</span>
                                </Badge>
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-heading text-card-title text-foreground line-clamp-2 break-words">
                                  {deck.title}
                                </h3>
                                <p className="text-chip text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                                  {deck.tagline}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-border/50 text-chip">
                              <span className="font-mono text-muted-foreground">
                                {deck.words.length} {locale === "bn" ? "টি শব্দ" : "words"}
                              </span>
                              <span className="text-label text-primary">
                                {locale === "bn" ? "লগইন করে খুলুন →" : "Log in to unlock →"}
                              </span>
                            </div>
                          </Card>
                        </Link>
                      );
                    }
                    return (
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

                        <div className="min-w-0">
                          <h3 className="font-heading text-card-title text-foreground line-clamp-2 break-words">
                            {deck.title}
                          </h3>
                          <p className="text-chip text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                            {deck.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/50 text-chip">
                        <span className="text-chip-mono text-primary">
                          {deck.words.length} {locale === "bn" ? "টি শব্দ" : "words"}
                        </span>
                        <span className="text-muted-foreground">
                          {locale === "bn" ? "কার্ড খুলুন →" : "Open Card →"}
                        </span>
                      </div>
                    </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Open Magic Card View (25+ Words Grid) */
              <Card className="p-5 sm:p-6 bg-card rounded-card border border-border/60 shadow-card space-y-5">
                {/* Deck Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
                  <div className="space-y-1">
                    <Button
                      type="button"
                      variant="link"
                      size="xs"
                      onClick={() => {
                        setActiveDeckSlug(null);
                        setMagicSearch("");
                        setSelectedMagicWord(null);
                      }}
                      className="px-0 mb-1"
                    >
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                      <span>
                        {locale === "bn" ? "সব ৪০টি ম্যাজিক কার্ডে ফিরুন" : "Back to 40 Magic Cards"}
                      </span>
                    </Button>
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

                  <div className="relative w-full sm:w-64">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={15}
                      className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <Input
                      type="text"
                      value={magicSearch}
                      onChange={(e) => setMagicSearch(e.target.value)}
                      placeholder={locale === "bn" ? "কার্ডে শব্দ খুঁজুন..." : "Filter words in deck..."}
                      className="pl-9 h-9 bg-muted/40 border-border/60 rounded-control"
                    />
                  </div>
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
                          <p className="font-heading text-label text-foreground truncate">
                            {w.word}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-chip text-primary">{w.pos}</span>
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
          /* SAVED VOCABULARY: Category Cards + Magic Word Tiles + Right Sidebar */
          <div className="space-y-5">
            {!activeSavedCategory ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {savedCategories.map((cat) => (
                  <Card
                    key={cat.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setActiveSavedCatId(cat.id);
                      setSavedSearch("");
                      const first = cat.lemmas[0] ? resolveLemmaToWordItem(cat.lemmas[0]) : null;
                      setSelectedMagicWord(first);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveSavedCatId(cat.id);
                        setSavedSearch("");
                        const first = cat.lemmas[0] ? resolveLemmaToWordItem(cat.lemmas[0]) : null;
                        setSelectedMagicWord(first);
                      }
                    }}
                    className="p-5 bg-card rounded-card border border-border/60 shadow-2xs hover:shadow-card hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-page-title leading-none">{cat.emoji}</span>
                      <Badge variant="brand" size="sm" className="font-mono">
                        {cat.lemmas.length} {locale === "bn" ? "শব্দ" : "words"}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-heading text-card-title text-foreground">
                        {cat.name}
                      </h3>
                      <p className="text-chip text-muted-foreground mt-1">
                        {locale === "bn"
                          ? "আপনার সেভ করা শব্দের নিজস্ব কালেকশন"
                          : "Your custom saved word collection"}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-border/50 text-chip text-primary">
                      {locale === "bn" ? "ক্যাটাগরি খুলুন →" : "Open Category →"}
                    </div>
                  </Card>
                ))}

                {/* Create New Category Card */}
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsCreateCatOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsCreateCatOpen(true);
                    }
                  }}
                  className="p-5 bg-muted/30 rounded-card border border-dashed border-border hover:border-primary/60 hover:bg-muted/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 min-h-36"
                >
                  <div className="size-10 rounded-pill bg-primary/10 text-primary flex items-center justify-center">
                    <HugeiconsIcon icon={Add01Icon} size={20} />
                  </div>
                  <p className="font-heading text-label text-foreground">
                    {locale === "bn" ? "নতুন ক্যাটাগরি তৈরি করুন" : "Create New Category"}
                  </p>
                  <p className="text-chip text-muted-foreground">
                    {locale === "bn" ? "পছন্দের শব্দ আলাদা করে সাজিয়ে রাখুন" : "Organize your favorite words your way"}
                  </p>
                </Card>
              </div>
            ) : (
              /* Open Saved Category View (Magic Word Tiles) */
              <Card className="p-5 sm:p-6 bg-card rounded-card border border-border/60 shadow-card space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
                  <div className="space-y-1">
                    <Button
                      type="button"
                      variant="link"
                      size="xs"
                      onClick={() => {
                        setActiveSavedCatId(null);
                        setSavedSearch("");
                        setSelectedMagicWord(null);
                      }}
                      className="px-0 mb-1"
                    >
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                      <span>
                        {locale === "bn" ? "সব সেভ করা ক্যাটাগরিতে ফিরুন" : "Back to Saved Categories"}
                      </span>
                    </Button>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-page-title leading-none">{activeSavedCategory.emoji}</span>
                      <h2 className="font-heading text-section-heading text-foreground">
                        {activeSavedCategory.name}
                      </h2>
                      <Badge variant="neutral" size="sm" className="font-mono">
                        {activeSavedCategory.lemmas.length} {locale === "bn" ? "শব্দ" : "words"}
                      </Badge>
                    </div>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={15}
                      className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <Input
                      type="text"
                      value={savedSearch}
                      onChange={(e) => setSavedSearch(e.target.value)}
                      placeholder={locale === "bn" ? "শব্দ খুঁজুন..." : "Filter saved words..."}
                      className="pl-9 h-9 bg-muted/40 border-border/60 rounded-control"
                    />
                  </div>
                </div>

                {activeSavedWords.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                    {activeSavedWords.map((w) => {
                      const isSelected = selectedMagicWord?.lemma === w.lemma;
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
                            <p className="font-heading text-label text-foreground truncate">
                              {w.word}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-chip text-primary">{w.pos}</span>
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
                ) : (
                  <div className="py-10 text-center space-y-2 text-meta text-muted-foreground">
                    <p>
                      {locale === "bn"
                        ? "এই ক্যাটাগরিতে এখনো কোনো শব্দ নেই। Magic Cards থেকে শব্দ সেভ করুন!"
                        : "No words in this category yet. Save words from Magic Cards!"}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveView("magic")}
                    >
                      {locale === "bn" ? "Magic Cards দেখুন" : "Browse Magic Cards"}
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* Save-to-Category Picker Dialog */}
        <Dialog open={Boolean(savePickerLemma)} onOpenChange={(o) => !o && setSavePickerLemma(null)}>
          <DialogContent className="sm:max-w-md bg-card rounded-card border border-border">
            <DialogHeader>
              <DialogTitle className="font-heading text-card-title text-foreground">
                {locale === "bn" ? "কোন ক্যাটাগরিতে সেভ করবেন?" : "Save Word to Category"}
              </DialogTitle>
              <DialogDescription className="text-chip text-muted-foreground">
                {locale === "bn"
                  ? `"${savePickerLemma}" শব্দটি কোন ক্যাটাগরিতে রাখবেন বেছে নিন অথবা নতুন তৈরি করুন।`
                  : `Choose a category for "${savePickerLemma}" or create a new one.`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 max-h-60 overflow-y-auto py-1">
              {savedCategories.map((cat) => {
                const inCat = savePickerLemma ? cat.lemmas.includes(savePickerLemma) : false;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => savePickerLemma && handleAssignToCategory(savePickerLemma, cat.id)}
                    className={cn(
                      "w-full p-3 rounded-control border flex items-center justify-between gap-2 transition-all cursor-pointer text-left",
                      inCat
                        ? "bg-primary/10 border-primary text-foreground"
                        : "bg-muted/40 border-border/60 hover:bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-card-title">{cat.emoji}</span>
                      <div>
                        <p className="text-meta">{cat.name}</p>
                        <p className="text-chip text-muted-foreground font-mono">
                          {cat.lemmas.length} {locale === "bn" ? "শব্দ" : "words"}
                        </p>
                      </div>
                    </div>
                    {inCat && (
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="text-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-border/60 space-y-2.5">
              <p className="text-chip text-foreground">
                {locale === "bn" ? "+ নতুন ক্যাটাগরি তৈরি করে সেভ করুন" : "+ Create New Category & Save"}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {DEFAULT_CATEGORY_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setNewCatEmoji(em)}
                    className={cn(
                      "size-8 rounded-control border flex items-center justify-center cursor-pointer transition-all",
                      newCatEmoji === em
                        ? "bg-primary/15 border-primary"
                        : "bg-muted/40 border-border/60 hover:bg-muted"
                    )}
                  >
                    {em}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder={locale === "bn" ? "ক্যাটাগরির নাম..." : "New category name..."}
                  className="h-9"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateCategoryAndSave}
                  disabled={!newCatName.trim()}
                >
                  {locale === "bn" ? "তৈরি ও সেভ" : "Create & Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Standalone Create Category Dialog */}
        <Dialog open={isCreateCatOpen} onOpenChange={setIsCreateCatOpen}>
          <DialogContent className="sm:max-w-sm bg-card rounded-card border border-border">
            <DialogHeader>
              <DialogTitle className="font-heading text-card-title text-foreground">
                {locale === "bn" ? "নতুন ক্যাটাগরি তৈরি করুন" : "Create Saved Category"}
              </DialogTitle>
              <DialogDescription className="text-chip text-muted-foreground">
                {locale === "bn"
                  ? "আপনার পছন্দের শব্দগুলো গুছিয়ে রাখতে একটি নাম ও আইকন দিন।"
                  : "Pick an icon and name for your new vocabulary collection."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {DEFAULT_CATEGORY_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setNewCatEmoji(em)}
                    className={cn(
                      "size-8 rounded-control border flex items-center justify-center cursor-pointer transition-all",
                      newCatEmoji === em
                        ? "bg-primary/15 border-primary"
                        : "bg-muted/40 border-border/60 hover:bg-muted"
                    )}
                  >
                    {em}
                  </button>
                ))}
              </div>
              <Input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder={locale === "bn" ? "যেমন: Office Power Words" : "e.g., Office Power Words"}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateCatOpen(false)}>
                {locale === "bn" ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleCreateCategoryAndSave}
                disabled={!newCatName.trim()}
              >
                {locale === "bn" ? "তৈরি করুন" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
            activeDeck={activeView === "magic" ? activeDeck : null}
            selectedWord={selectedMagicWord}
            isSaved={selectedMagicWord ? savedLemmas.includes(selectedMagicWord.lemma) : false}
            onToggleSave={handleOpenSavePicker}
            onRemoveFromCategory={
              activeView === "words" && activeSavedCategory
                ? handleRemoveFromActiveCategory
                : undefined
            }
            activeCategoryLabel={
              activeView === "words" && activeSavedCategory
                ? `${activeSavedCategory.emoji} ${activeSavedCategory.name}`
                : null
            }
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
              activeDeck={activeView === "magic" ? activeDeck : null}
              selectedWord={selectedMagicWord}
              isSaved={selectedMagicWord ? savedLemmas.includes(selectedMagicWord.lemma) : false}
              onToggleSave={handleOpenSavePicker}
              onRemoveFromCategory={
                activeView === "words" && activeSavedCategory
                  ? handleRemoveFromActiveCategory
                  : undefined
              }
              activeCategoryLabel={
                activeView === "words" && activeSavedCategory
                  ? `${activeSavedCategory.emoji} ${activeSavedCategory.name}`
                  : null
              }
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
