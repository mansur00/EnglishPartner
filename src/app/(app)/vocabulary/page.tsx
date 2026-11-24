"use client";

import React, { useState, useEffect, useMemo } from "react";
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
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupPrefix } from "@/components/ui/input-group";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import { PageContainer } from "@/components/shared/PageContainer";
import { LocaleTitle } from "@/components/shared/LocaleTitle";
import { useTranslations } from "@/lib/i18n";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { ReviewQueue } from "@/components/learning/ReviewQueue";
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
  const { locale, t } = useTranslations();
  const { isLineActive, toggleLine } = useGrammar();
  const [activeView, setActiveView] = useState<"words" | "srs">("words");
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
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
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

  return (
    <PageContainer className="space-y-6 pb-16">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-6 rounded-card bg-card shadow-2xs">
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
                ? "কথোপকথন থেকে সংরক্ষিত শব্দ এবং ব্যাকরণগত অর্থ"
                : "Saved words from conversations with contextual grammar definitions"}
            </p>
          </div>
        </div>

        {/* Sync / Sign-in prompt button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAuthModalOpen(true)}
          className={cn("text-label gap-2 rounded-control", locale === "bn" && "text-bangla")}
        >
          <HugeiconsIcon icon={Login01Icon} size={16} className="text-primary" />
          <span>{t("vocabulary.syncCloud")}</span>
        </Button>
      </div>

      {/* Guest Mode Notice */}
      <div className={cn("flex items-center justify-between gap-3 p-4 rounded-panel bg-primary/10 text-chip text-muted-foreground", locale === "bn" && "text-bangla")}>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} size={16} className="text-sun-500 shrink-0" />
          <span>
            {t("vocabulary.guestNotice").replace("{count}", String(savedLemmas.length))}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          className="text-primary hover:underline shrink-0 cursor-pointer text-label"
        >
          {t("vocabulary.guestLoginCta")}
        </button>
      </div>

      {/* Mode View Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-card rounded-panel shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveView("words")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-control text-meta transition-all cursor-pointer",
            activeView === "words"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          <HugeiconsIcon icon={Book01Icon} size={16} />
          <span className={locale === "bn" ? "text-bangla" : ""}>
            {t("vocabulary.savedWordsTab").replace("{count}", String(allEntries.length))}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView("srs")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-control text-meta transition-all cursor-pointer",
            activeView === "srs"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          <HugeiconsIcon icon={SparklesIcon} size={16} />
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

      {activeView === "srs" ? (
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
                      aria-label={`উচ্চারণ শুনুন: ${item.word}`}
                      className="size-control rounded-control text-primary bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer flex items-center justify-center"
                      title="উচ্চারণ শুনুন"
                    >
                      <HugeiconsIcon icon={VolumeHighIcon} size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveWord(item.lemma)}
                      aria-label={`তালিকা থেকে মুছুন: ${item.word}`}
                      className="size-control rounded-control text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer flex items-center justify-center"
                      title="তালিকা থেকে বাদ দিন"
                    >
                      <HugeiconsIcon icon={BookmarkRemove01Icon} size={18} />
                    </button>
                  </div>
                </div>

                {/* Meanings */}
                <div className="py-3 space-y-2">
                  <div className={cn("text-body text-foreground leading-relaxed", locale === "bn" && "text-bangla")}>
                    {locale === "bn"
                      ? item.contextualMeaningBn
                      : (item.contextualMeaningEn || item.contextualMeaningBn)}
                  </div>
                  {((locale === "bn" && item.generalMeaningBn && item.generalMeaningBn !== item.contextualMeaningBn) ||
                    (locale !== "bn" && item.generalMeaningEn && item.generalMeaningEn !== item.contextualMeaningEn)) && (
                    <div className={cn("text-meta text-muted-foreground", locale === "bn" && "text-bangla")}>
                      {t("vocabulary.generalMeaningLabel")}: {locale === "bn" ? item.generalMeaningBn : item.generalMeaningEn}
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
    </PageContainer>
  );
}
