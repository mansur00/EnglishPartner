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
import { EmptyState } from "@/components/ui/empty-state";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import {
  SEED_VOCABULARY,
  VocabularyEntry,
} from "@/content/seed/vocabulary";

export default function VocabularyPage() {
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
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-ecp-border shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-ecp-violet-surface text-ecp-violet flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={Book01Icon} size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-ecp-text-primary font-bangla">
              আমার শব্দভান্ডার (My Vocabulary Notebook)
            </h1>
            <p className="text-xs sm:text-sm text-ecp-text-secondary mt-0.5">
              কথোপকথন থেকে সংরক্ষিত শব্দ এবং ব্যাকরণগত অর্থ
            </p>
          </div>
        </div>

        {/* Sync / Sign-in prompt button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAuthModalOpen(true)}
          className="text-xs gap-2 font-bangla"
        >
          <HugeiconsIcon icon={Login01Icon} size={16} className="text-ecp-violet" />
          <span>ক্লাউডে সিঙ্ক করুন</span>
        </Button>
      </div>

      {/* Guest Mode Notice */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-ecp-warm-surface/60 border border-ecp-warm/20 text-xs text-ecp-text-secondary font-bangla">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} size={16} className="text-ecp-warm shrink-0" />
          <span>
            আপনি বর্তমানে গেস্ট হিসেবে শব্দ সংরক্ষণ করছেন ({savedLemmas.length}টি শব্দ সংরক্ষিত)।
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          className="font-semibold text-ecp-violet hover:underline shrink-0 cursor-pointer"
        >
          লগইন করে সুরক্ষিত রাখুন
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ecp-text-muted">
            <HugeiconsIcon icon={Search01Icon} size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="শব্দ বা অর্থ দিয়ে খুঁজুন (Search English or Bangla)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ecp-border bg-white text-sm text-ecp-text-primary placeholder:text-ecp-text-muted focus:outline-hidden focus:border-ecp-violet focus:ring-1 focus:ring-ecp-violet transition-all"
          />
        </div>

        {/* Part of Speech Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <div className="text-ecp-text-muted shrink-0 hidden sm:block ml-2">
            <HugeiconsIcon icon={FilterIcon} size={16} />
          </div>
          {[
            { id: "all", label: "All / সব" },
            { id: "verb", label: "Verbs" },
            { id: "noun", label: "Nouns" },
            { id: "adjective", label: "Adjectives" },
            { id: "adverb", label: "Adverbs" },
            { id: "phrase", label: "Phrases" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedPos(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedPos === cat.id
                  ? "bg-ecp-violet text-white shadow-xs"
                  : "bg-white border border-ecp-border text-ecp-text-secondary hover:text-ecp-text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Word Cards Grid */}
      {isLoaded && filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((item) => (
            <div
              key={item.lemma}
              className="p-5 rounded-2xl bg-white border border-ecp-border shadow-2xs hover:shadow-xs hover:border-ecp-violet/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Word & Audio */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-ecp-border">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl font-bold text-ecp-text-primary font-sans">
                        {item.word}
                      </h3>
                      <Badge variant={posBadgeVariant(item.partOfSpeech)} size="sm">
                        {item.partOfSpeech}
                      </Badge>
                    </div>
                    <span className="text-xs font-mono text-ecp-text-muted mt-1 block">
                      {item.ipa}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => playWord(item.word)}
                      aria-label={`উচ্চারণ শুনুন: ${item.word}`}
                      className="p-2 rounded-lg text-ecp-violet bg-ecp-violet-surface hover:bg-ecp-violet-surface/80 transition-colors cursor-pointer"
                      title="উচ্চারণ শুনুন"
                    >
                      <HugeiconsIcon icon={VolumeHighIcon} size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveWord(item.lemma)}
                      aria-label={`তালিকা থেকে মুছুন: ${item.word}`}
                      className="p-2 rounded-lg text-ecp-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="তালিকা থেকে বাদ দিন"
                    >
                      <HugeiconsIcon icon={BookmarkRemove01Icon} size={16} />
                    </button>
                  </div>
                </div>

                {/* Meanings */}
                <div className="py-3 space-y-2">
                  <div className="text-xs sm:text-sm font-bangla text-ecp-text-primary font-medium leading-relaxed">
                    {item.contextualMeaningBn}
                  </div>
                  {item.generalMeaningBn && item.generalMeaningBn !== item.contextualMeaningBn && (
                    <div className="text-xs font-bangla text-ecp-text-muted">
                      সাধারণ অর্থ: {item.generalMeaningBn}
                    </div>
                  )}

                  {/* Example Sentence */}
                  {item.exampleSentence && (
                    <p className="text-xs text-ecp-text-secondary italic pt-1 border-t border-ecp-border/60">
                      &ldquo;{item.exampleSentence}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Word Forms / Synonyms footer */}
              {item.wordForms && (
                <div className="pt-2 text-[11px] text-ecp-text-muted flex flex-wrap gap-2">
                  {item.wordForms.past && <span>Past: {item.wordForms.past}</span>}
                  {item.wordForms.plural && <span>Plural: {item.wordForms.plural}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="কোনো শব্দ পাওয়া যায়নি"
          description={
            searchQuery
              ? `"${searchQuery}" এর সাথে মিলে এমন কোনো শব্দ আপনার তালিকায় নেই।`
              : "আপনার শব্দভান্ডারে এখনও কোনো শব্দ যোগ করা হয়নি।"
          }
          action={
            <Link href="/explore">
              <Button size="sm" className="font-bangla">
                কথোপকথন এক্সপ্লোর করুন
              </Button>
            </Link>
          }
        />
      )}

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="শব্দভান্ডার ক্লাউডে সিঙ্ক করুন (Sync to Cloud)"
        description="লগইন করলে আপনার সব ডিভাইসে সংরক্ষিত শব্দভান্ডার পাওয়া যাবে এবং কখনো মুছে যাবে না।"
      />
    </div>
  );
}
