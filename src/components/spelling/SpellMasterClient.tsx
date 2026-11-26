"use client";

import React, { useState, useEffect, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  VolumeHighIcon,
  CheckmarkCircle02Icon,
  Alert01Icon,
  BookOpen01Icon,
  Award01Icon,
  FireIcon,
  Search01Icon,
  RefreshIcon,
  ArrowRight01Icon,
  BotIcon,
  CheckmarkBadge01Icon,
  Bookmark02Icon,
  AiLockIcon,
} from "@hugeicons/core-free-icons";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { LocaleTitle } from "@/components/shared";
import { useSessionAccess } from "@/components/auth/SessionIsolationProvider";
import { useFeatureFlags } from "@/lib/features/use-feature-flags";
import { FeatureDisabledCard } from "@/components/auth/FeatureDisabledCard";
import { GuestLimitBanner } from "@/components/auth/GuestLimitBanner";
import { useLocale } from "@/lib/i18n";
import { speakText } from "@/lib/audio/speech-engine";
import { cn } from "@/lib/utils";
import {
  CURATED_SPELL_WORDS,
  SPELLING_RULES_55,
  RULE_PARTS,
  getRulesForCategories,
  areSpellingVariantsEqual,
  SPELL_BADGES,
  SPELL_CATEGORIES,
  SPELL_CATEGORY_GROUPS,
  SPELL_STORAGE_KEY,
  DEFAULT_SPELL_PROGRESS,
  getLevelFromXp,
  type SpellWord,
  type SpellCategoryId,
  type SpellCategoryGroupId,
  type RulePartId,
  type RuleReliability,
  type SpellProgressState,
} from "@/lib/spelling/spell-data";
import type {
  SpellLookupResponse,
  SpellCoachResponse,
  SpellCheckTextResponse,
} from "@/lib/ai/spell-master";

type SpellTab = "learn" | "test" | "rules" | "ai" | "progress";
type TestMode = "dictation" | "jumbled";

const CATEGORY_MAP = new Map(SPELL_CATEGORIES.map((c) => [c.id, c]));
const PAGE_BATCH = 48;

function scrambleWord(word: string): string[] {
  const letters = word.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = (i * 7 + word.length) % (i + 1);
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  if (letters.join("") === word && letters.length > 1) {
    [letters[0], letters[letters.length - 1]] = [letters[letters.length - 1], letters[0]];
  }
  return letters;
}

export function SpellMasterClient() {
  const locale = useLocale();
  const isBn = locale === "bn";
  const { isGuest, config, getGuestLimit } = useSessionAccess();
  const { isEnabled } = useFeatureFlags();

  const [activeTab, setActiveTab] = useState<SpellTab>("learn");
  const [progress, setProgress] = useState<SpellProgressState>(DEFAULT_SPELL_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  // Learn Tab State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<SpellCategoryGroupId>("all");
  const [selectedCategory, setSelectedCategory] = useState<"all" | SpellCategoryId>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_BATCH);
  const [selectedWordId, setSelectedWordId] = useState<string>(CURATED_SPELL_WORDS[0].id);
  const [aiLookupLoading, setAiLookupLoading] = useState(false);
  const [aiLookupResult, setAiLookupResult] = useState<SpellLookupResponse | null>(null);
  const [aiLookupError, setAiLookupError] = useState<string | null>(null);

  // Rules Tab State
  const [rulePart, setRulePart] = useState<RulePartId>("all");
  const [ruleReliability, setRuleReliability] = useState<"all" | RuleReliability>("all");
  const [ruleSearch, setRuleSearch] = useState("");
  const [selectedRuleId, setSelectedRuleId] = useState<string>(SPELLING_RULES_55[0].id);

  // Test Tab State
  const [testMode, setTestMode] = useState<TestMode>("dictation");
  const [testIndex, setTestIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [jumbledPicked, setJumbledPicked] = useState<number[]>([]);
  const [showTestHint, setShowTestHint] = useState(false);
  const [nowMs, setNowMs] = useState(0);
  const [testFeedback, setTestFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    correctWord: string;
    mnemonic: string;
  } | null>(null);

  // AI Coach & Text Checker State
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachResult, setCoachResult] = useState<SpellCoachResponse | null>(null);
  const [coachQuizAnswers, setCoachQuizAnswers] = useState<Record<number, number>>({});
  const [pasteText, setPasteText] = useState("");
  const [textCheckLoading, setTextCheckLoading] = useState(false);
  const [textCheckResult, setTextCheckResult] = useState<SpellCheckTextResponse | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(SPELL_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<SpellProgressState>;
          setProgress({
            ...DEFAULT_SPELL_PROGRESS,
            ...parsed,
            mistakePatterns: {
              ...DEFAULT_SPELL_PROGRESS.mistakePatterns,
              ...(parsed.mistakePatterns || {}),
            },
            ruleMistakes: parsed.ruleMistakes || {},
            weakWords: parsed.weakWords || {},
            masteredIds: Array.isArray(parsed.masteredIds) ? parsed.masteredIds : [],
            savedIds: Array.isArray(parsed.savedIds) ? parsed.savedIds : [],
            customWords: Array.isArray(parsed.customWords) ? parsed.customWords : [],
          });
        }
      } catch {
        // Ignore storage errors
      }
      setNowMs(Date.now());
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SPELL_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage errors
    }
  }, [progress, hydrated]);

  const allWords = useMemo(
    () => [...progress.customWords, ...CURATED_SPELL_WORDS],
    [progress.customWords]
  );

  const dailyWordId = useMemo(() => {
    if (CURATED_SPELL_WORDS.length === 0) return "";
    const dayIndex = nowMs > 0 ? Math.floor(nowMs / (24 * 60 * 60 * 1000)) : 0;
    return CURATED_SPELL_WORDS[dayIndex % CURATED_SPELL_WORDS.length].id;
  }, [nowMs]);

  const wordMatchesCategory = (item: SpellWord, cat: "all" | SpellCategoryId) => {
    if (cat === "all") return true;
    if (cat === "my-mistakes") return Boolean(progress.weakWords[item.id]);
    if (cat === "saved-words") return progress.savedIds.includes(item.id);
    if (cat === "daily-word") return item.id === dailyWordId;
    if (cat === "ai-added-words") return Boolean(item.isCustom);
    return item.categories?.includes(cat) || item.ruleCategory === cat;
  };

  const activeGroupCategories = useMemo(() => {
    if (selectedGroup === "all") return SPELL_CATEGORIES;
    return SPELL_CATEGORIES.filter((c) => c.group === selectedGroup);
  }, [selectedGroup]);

  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allWords.filter((item) => {
      if (selectedCategory !== "all") {
        if (!wordMatchesCategory(item, selectedCategory)) return false;
      } else if (selectedGroup !== "all") {
        const matchesGroup = activeGroupCategories.some((c) =>
          wordMatchesCategory(item, c.id)
        );
        if (!matchesGroup) return false;
      }
      if (q) {
        return (
          item.word.toLowerCase().includes(q) ||
          item.meaningBn.toLowerCase().includes(q) ||
          item.commonMistake.toLowerCase().includes(q)
        );
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allWords, searchQuery, selectedCategory, selectedGroup, activeGroupCategories, progress.weakWords, progress.savedIds, dailyWordId]);

  const visibleWords = useMemo(
    () => filteredWords.slice(0, visibleCount),
    [filteredWords, visibleCount]
  );
  const guestUnlockedCount = isGuest ? getGuestLimit(filteredWords.length, 5) : filteredWords.length;

  const toggleSaveWord = (wordId: string) => {
    setProgress((prev) => {
      const exists = prev.savedIds.includes(wordId);
      return {
        ...prev,
        savedIds: exists
          ? prev.savedIds.filter((id) => id !== wordId)
          : [wordId, ...prev.savedIds],
      };
    });
  };

  // Spaced Repetition prioritized test queue (due weak words first)
  const testQueue = useMemo(() => {
    const dueWeakIds = Object.values(progress.weakWords)
      .filter((w) => nowMs > 0 && w.nextReviewAt <= nowMs)
      .sort((a, b) => b.mistakes - a.mistakes)
      .map((w) => w.wordId);
    const dueSet = new Set(dueWeakIds);
    const dueWords = allWords.filter((w) => dueSet.has(w.id));
    const restWords = allWords.filter((w) => !dueSet.has(w.id));
    return [...dueWords, ...restWords];
  }, [allWords, progress.weakWords, nowMs]);

  const currentTestWord: SpellWord = testQueue[testIndex % Math.max(1, testQueue.length)] || CURATED_SPELL_WORDS[0];

  const jumbledPool = useMemo(() => {
    const usedSet = new Set(jumbledPicked);
    return scrambleWord(currentTestWord.word).map((char, idx) => ({
      char,
      used: usedSet.has(idx),
    }));
  }, [currentTestWord.word, jumbledPicked]);

  const resetTestTurn = (nextIndex?: number, nextMode?: TestMode) => {
    if (typeof nextIndex === "number") setTestIndex(nextIndex);
    if (nextMode) setTestMode(nextMode);
    setJumbledPicked([]);
    setTypedAnswer("");
    setShowTestHint(false);
    setTestFeedback(null);
    setNowMs(Date.now());
  };

  const currentWordRules = useMemo(
    () => getRulesForCategories(currentTestWord.categories ?? [currentTestWord.ruleCategory]),
    [currentTestWord]
  );

  const filteredRules = useMemo(() => {
    const q = ruleSearch.trim().toLowerCase();
    return SPELLING_RULES_55.filter((r) => {
      if (rulePart !== "all" && r.part !== rulePart) return false;
      if (ruleReliability !== "all" && r.reliability !== ruleReliability) return false;
      if (q) {
        return (
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.titleBn.toLowerCase().includes(q) ||
          r.summaryEn.toLowerCase().includes(q) ||
          r.examples.some((ex) => ex.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [rulePart, ruleReliability, ruleSearch]);

  const selectedRule = useMemo(
    () => filteredRules.find((r) => r.id === selectedRuleId) ?? filteredRules[0] ?? null,
    [filteredRules, selectedRuleId]
  );

  const levelInfo = getLevelFromXp(progress.xp);
  const weakList = Object.values(progress.weakWords).sort((a, b) => b.mistakes - a.mistakes);
  const unlockedBadges = SPELL_BADGES.filter((b) => b.check(progress));

  const speakWord = (word: string, slow = false) => {
    speakText(word, { rate: slow ? 0.65 : 0.95 });
  };

  const speakSyllables = (word: SpellWord) => {
    speakText(word.syllables.join(" ... "), { rate: 0.72 });
  };

  // AI Lookup & Add Word
  const handleAiLookup = async () => {
    const q = searchQuery.trim();
    if (q.length < 2 || aiLookupLoading) return;
    setAiLookupLoading(true);
    setAiLookupError(null);
    setAiLookupResult(null);

    try {
      const res = await fetch("/api/v1/ai/spell-master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lookup", word: q }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiLookupError(data.message || "Could not look up word.");
      } else {
        setAiLookupResult(data as SpellLookupResponse);
      }
    } catch {
      setAiLookupError("Network error while looking up word.");
    } finally {
      setAiLookupLoading(false);
    }
  };

  const handleAddCustomWord = (lookup: SpellLookupResponse) => {
    const exists = allWords.some((w) => w.word.toLowerCase() === lookup.word.toLowerCase());
    if (exists) {
      setAiLookupResult(null);
      return;
    }
    const validCats = (lookup.categories || []).filter((c): c is SpellCategoryId =>
      CATEGORY_MAP.has(c as SpellCategoryId)
    );
    const newWord: SpellWord = {
      id: `custom-${Date.now()}`,
      word: lookup.word,
      syllables: lookup.syllables,
      phonetic: lookup.phonetic,
      meaningBn: lookup.meaningBn,
      categories: validCats.length > 0 ? [...new Set([...validCats, "ai-added-words" as SpellCategoryId])] : [lookup.ruleCategory, "ai-added-words"],
      ruleCategory: lookup.ruleCategory,
      commonMistake: lookup.commonMistake,
      mnemonicBn: lookup.mnemonicBn,
      mnemonicEn: lookup.mnemonicEn,
      exampleSentence: lookup.exampleSentence,
      difficulty: lookup.difficulty,
      isCustom: true,
    };
    setProgress((prev) => ({
      ...prev,
      xp: prev.xp + 10,
      customWords: [newWord, ...prev.customWords],
    }));
    setAiLookupResult(null);
    setSearchQuery(lookup.word);
  };

  // Submit Spelling Test Answer
  const handleCheckTestAnswer = () => {
    if (testFeedback) return;
    const userAttempt =
      testMode === "dictation"
        ? typedAnswer.trim()
        : jumbledPicked.map((i) => jumbledPool[i]?.char ?? "").join("");

    if (!userAttempt) return;
    const isCorrect = areSpellingVariantsEqual(userAttempt, currentTestWord.word);

    if (isCorrect) {
      setProgress((prev) => {
        const nextStreak = prev.streak + 1;
        const nextWeak = { ...prev.weakWords };
        if (nextWeak[currentTestWord.id]) {
          const updatedStreak = nextWeak[currentTestWord.id].correctStreak + 1;
          if (updatedStreak >= 2) {
            delete nextWeak[currentTestWord.id];
          } else {
            nextWeak[currentTestWord.id] = {
              ...nextWeak[currentTestWord.id],
              correctStreak: updatedStreak,
              nextReviewAt: Date.now() + 24 * 60 * 60 * 1000,
            };
          }
        }
        const mastered = prev.masteredIds.includes(currentTestWord.id)
          ? prev.masteredIds
          : [...prev.masteredIds, currentTestWord.id];
        return {
          ...prev,
          xp: prev.xp + 15,
          score: prev.score + 10,
          streak: nextStreak,
          bestStreak: Math.max(prev.bestStreak, nextStreak),
          masteredIds: mastered,
          weakWords: nextWeak,
        };
      });
      setTestFeedback({
        isCorrect: true,
        message: isBn ? "চমৎকার! বানানটি একদম সঠিক (+15 XP)।" : "Awesome! Exact spelling (+15 XP).",
        correctWord: currentTestWord.word,
        mnemonic: isBn ? currentTestWord.mnemonicBn : currentTestWord.mnemonicEn,
      });
    } else {
      setProgress((prev) => {
        const existing = prev.weakWords[currentTestWord.id];
        const nextRuleMistakes = { ...(prev.ruleMistakes || {}) };
        for (const r of currentWordRules.slice(0, 2)) {
          nextRuleMistakes[r.id] = (nextRuleMistakes[r.id] || 0) + 1;
        }
        return {
          ...prev,
          streak: 0,
          ruleMistakes: nextRuleMistakes,
          mistakePatterns: {
            ...prev.mistakePatterns,
            [currentTestWord.ruleCategory]:
              (prev.mistakePatterns[currentTestWord.ruleCategory] || 0) + 1,
          },
          weakWords: {
            ...prev.weakWords,
            [currentTestWord.id]: {
              wordId: currentTestWord.id,
              word: currentTestWord.word,
              ruleCategory: currentTestWord.ruleCategory,
              mistakes: (existing?.mistakes || 0) + 1,
              correctStreak: 0,
              lastWrongAttempt: userAttempt,
              nextReviewAt: Date.now() + 60 * 1000, // due again in 1 min
            },
          },
        };
      });
      setTestFeedback({
        isCorrect: false,
        message: isBn
          ? `আপনার উত্তর "${userAttempt}" — সঠিক বানান হবে "${currentTestWord.word}"। এটি দুর্বল তালিকায় সেভ করা হয়েছে।`
          : `You wrote "${userAttempt}" — correct spelling is "${currentTestWord.word}". Saved for spaced repetition.`,
        correctWord: currentTestWord.word,
        mnemonic: isBn ? currentTestWord.mnemonicBn : currentTestWord.mnemonicEn,
      });
    }
  };

  const handleRunCoach = async () => {
    if (coachLoading) return;
    setCoachLoading(true);
    setCoachQuizAnswers({});
    try {
      const res = await fetch("/api/v1/ai/spell-master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "coach",
          weakWords: weakList.map((w) => w.word),
          mistakePatterns: progress.mistakePatterns,
          locale: isBn ? "bn" : "en",
        }),
      });
      if (res.ok) {
        setCoachResult((await res.json()) as SpellCoachResponse);
      }
    } finally {
      setCoachLoading(false);
    }
  };

  const handleCheckPastedText = async () => {
    if (pasteText.trim().length < 3 || textCheckLoading) return;
    setTextCheckLoading(true);
    try {
      const res = await fetch("/api/v1/ai/spell-master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check-text",
          text: pasteText.trim(),
          locale: isBn ? "bn" : "en",
        }),
      });
      if (res.ok) {
        setTextCheckResult((await res.json()) as SpellCheckTextResponse);
      }
    } finally {
      setTextCheckLoading(false);
    }
  };

  const selectedWord = useMemo(
    () =>
      filteredWords.find((w) => w.id === selectedWordId) ??
      filteredWords[0] ??
      allWords[0],
    [filteredWords, selectedWordId, allWords]
  );

  const wordDetailsSidebar = selectedWord ? (
    <div className="space-y-4">
      {/* Top Category & Difficulty */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {(selectedWord.categories ?? [selectedWord.ruleCategory]).slice(0, 2).map((catId) => (
            <Badge key={catId} variant="brand" size="sm">
              {CATEGORY_MAP.get(catId)?.label ?? catId}
            </Badge>
          ))}
        </div>
        <Badge variant="outline" size="sm">
          {selectedWord.difficulty}
        </Badge>
      </div>

      {/* Save / Bookmark Button */}
      <Button
        type="button"
        variant={progress.savedIds.includes(selectedWord.id) ? "default" : "outline"}
        size="sm"
        onClick={() => toggleSaveWord(selectedWord.id)}
        className="w-full gap-2"
      >
        <HugeiconsIcon icon={Bookmark02Icon} size={16} />
        <span>
          {progress.savedIds.includes(selectedWord.id)
            ? isBn
              ? "সেভ করা হয়েছে"
              : "Saved to My Words"
            : isBn
            ? "শব্দটি সেভ করুন"
            : "Save Word"}
        </span>
      </Button>

      {/* Word Title + Listen Buttons */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-card-title text-foreground">
            {selectedWord.word}
          </h2>
          <p className="text-chip font-mono text-muted-foreground mt-0.5">
            {selectedWord.phonetic}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => speakWord(selectedWord.word, false)}
            className="gap-1"
          >
            <HugeiconsIcon icon={VolumeHighIcon} size={14} />
            <span>Listen</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => speakSyllables(selectedWord)}
          >
            Slow
          </Button>
        </div>
      </div>

      {/* Syllable Breakdown Pills */}
      <div className="space-y-1.5 pt-2 border-t border-border/60">
        <p className="text-chip uppercase tracking-wider text-muted-foreground">
          {isBn ? "সিলেবল বিভাজন" : "Syllables"}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {selectedWord.syllables.map((syl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => speakText(syl, { rate: 0.75 })}
              className="px-2.5 py-1 rounded-control bg-primary/10 text-primary text-chip hover:bg-primary/20 transition-colors cursor-pointer"
            >
              {syl}
            </button>
          ))}
        </div>
      </div>

      {/* Bangla Meaning */}
      <div className="rounded-panel bg-muted/40 border border-border/60 p-3.5 space-y-1">
        <p className="text-chip text-muted-foreground">
          {isBn ? "বাংলা অর্থ" : "Bengali Meaning"}
        </p>
        <p className="text-label text-foreground text-bangla">
          {selectedWord.meaningBn}
        </p>
      </div>

      {/* Common Mistake Trap */}
      <div className="rounded-panel bg-muted/40 border border-border/60 p-3.5 space-y-2">
        <p className="text-chip uppercase tracking-wider text-muted-foreground">
          {isBn ? "সাধারণ ভুল ও মেমরি ট্রিক" : "Common Mistake & Trick"}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-label">
          <span className="text-destructive line-through">
            ✗ {selectedWord.commonMistake}
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="text-label text-primary">
            ✓ {selectedWord.word}
          </span>
        </div>
        <p className={cn("text-meta text-muted-foreground leading-relaxed", isBn && "text-bangla")}>
          💡 {isBn ? selectedWord.mnemonicBn : selectedWord.mnemonicEn}
        </p>
      </div>

      {/* Example Sentence */}
      <div className="space-y-1.5 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between gap-2">
          <p className="text-chip uppercase tracking-wider text-muted-foreground">
            Example
          </p>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => speakWord(selectedWord.exampleSentence, false)}
            className="gap-1"
          >
            <HugeiconsIcon icon={VolumeHighIcon} size={13} />
            <span>Play</span>
          </Button>
        </div>
        <p className="text-meta text-foreground italic leading-relaxed">
          &ldquo;{selectedWord.exampleSentence}&rdquo;
        </p>
      </div>

      <Button
        type="button"
        variant="cta"
        size="sm"
        className="w-full"
        onClick={() => {
          const idx = testQueue.findIndex((w) => w.id === selectedWord.id);
          resetTestTurn(idx >= 0 ? idx : 0);
          setActiveTab("test");
        }}
      >
        {isBn ? "এই শব্দটি টেস্ট করুন" : "Test This Word"}
      </Button>
    </div>
  ) : null;

  const ruleDetailsSidebar = selectedRule ? (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="brand" size="sm" className="font-mono">
            {selectedRule.id}
          </Badge>
          <Badge
            variant={
              selectedRule.reliability === "high"
                ? "success"
                : selectedRule.reliability === "medium"
                  ? "warning"
                  : "error"
            }
            size="sm"
          >
            {selectedRule.reliability === "high"
              ? "High"
              : selectedRule.reliability === "medium"
                ? "Medium"
                : "Low (Guideline)"}
          </Badge>
        </div>
        <HugeiconsIcon icon={BookOpen01Icon} size={18} className="text-primary shrink-0" />
      </div>

      <div className="space-y-1">
        <p className="text-chip text-muted-foreground">
          {RULE_PARTS.find((p) => p.id === selectedRule.part)?.label}
        </p>
        <h2 className="text-card-title text-foreground">
          {isBn ? selectedRule.titleBn : selectedRule.title}
        </h2>
        {isBn && (
          <p className="text-meta text-muted-foreground">{selectedRule.title}</p>
        )}
      </div>

      <div className="rounded-panel bg-muted/40 border border-border/60 p-3 space-y-1.5">
        <p className="text-chip uppercase tracking-wider text-muted-foreground">
          {isBn ? "নিয়মের ব্যাখ্যা" : "Rule Explanation"}
        </p>
        <p className={cn("text-meta text-foreground leading-relaxed", isBn && "text-bangla")}>
          {isBn ? selectedRule.summaryBn : selectedRule.summaryEn}
        </p>
      </div>

      {selectedRule.reliability === "low" && (
        <p className="text-chip text-sun-700 bg-sun-100/70 rounded-control px-3 py-2 text-bangla">
          ⚠️ এটি শুধু একটি গাইডলাইন—অডিও শুনে ও অনুশীলন করে মুখস্থ করাই বেশি কার্যকর।
        </p>
      )}

      <div className="space-y-2 pt-2 border-t border-border/60">
        <p className="text-chip uppercase tracking-wider text-muted-foreground">
          {isBn ? "উদাহরণ (Examples)" : "Examples"}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {selectedRule.examples.map((ex, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-control bg-muted/50 text-chip text-foreground font-mono"
            >
              {ex}
            </span>
          ))}
        </div>
      </div>

      {selectedRule.exceptions.length > 0 && (
        <div className="rounded-panel bg-muted/35 border border-border/60 p-3 space-y-1.5">
          <p className="text-chip text-foreground">
            {isBn ? "ব্যতিক্রম (Exceptions):" : "Exceptions:"}
          </p>
          <p className="text-chip text-muted-foreground leading-relaxed">
            {selectedRule.exceptions.join(" · ")}
          </p>
        </div>
      )}

      {selectedRule.mnemonic && (
        <p className="text-chip text-primary">
          💡 {selectedRule.mnemonic}
        </p>
      )}

      {selectedRule.categories.length > 0 && (
        <Button
          type="button"
          variant="cta"
          size="sm"
          className="w-full gap-2"
          onClick={() => {
            setSelectedGroup("all");
            setSelectedCategory(selectedRule.categories[0]);
            setVisibleCount(PAGE_BATCH);
            setActiveTab("learn");
          }}
        >
          <span>{isBn ? "এই নিয়মের শব্দ প্র্যাকটিস করুন" : "Practice Words for this Rule"}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Button>
      )}
    </div>
  ) : null;

  if (!isEnabled("spell_master")) {
    return (
      <PageContainer className="py-6">
        <FeatureDisabledCard
          featureName={isBn ? "স্পেল মাস্টার" : "Spell Master"}
        />
      </PageContainer>
    );
  }

  return (
    <div
      className={cn(
        "w-full",
        (activeTab === "learn" || activeTab === "rules") && "lg:pr-80 xl:pr-96"
      )}
    >
      <PageContainer className="py-5 sm:py-6 space-y-5 pb-24 md:pb-16">
      {/* Top Header & Gamification Bar */}
      <Card className="p-4 sm:p-6 bg-card border border-border rounded-card space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" size="sm">
                Level {levelInfo.level} · {isBn ? levelInfo.titleBn : levelInfo.title}
              </Badge>
              <Badge variant="accent" size="sm">
                {allWords.length} Words
              </Badge>
            </div>
            <LocaleTitle
              as="h1"
              titleEn="Spell Master"
              titleBn="বানান মাস্টার (Spell Master)"
              className="text-page-title text-foreground"
            />
            <p className={cn("text-meta text-muted-foreground", isBn && "text-bangla")}>
              {isBn
                ? "সিলেবল ভেঙে উচ্চারণ শুনুন, বানান পরীক্ষা দিন, নিয়ম শিখুন এবং AI কোচের সাথে দুর্বল শব্দ ঠিক করুন।"
                : "Master English spelling with syllable breakdowns, audio dictation, rules, spaced repetition, and AI coaching."}
            </p>
          </div>

          {/* Gamification Stats */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="rounded-panel bg-muted/40 border border-border/60 px-3 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-chip text-muted-foreground">
                <HugeiconsIcon icon={FireIcon} size={14} className="text-sun-600" />
                <span>Streak</span>
              </div>
              <p className="text-card-title font-mono text-foreground">{progress.streak}</p>
            </div>
            <div className="rounded-panel bg-muted/40 border border-border/60 px-3 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-chip text-muted-foreground">
                <HugeiconsIcon icon={SparklesIcon} size={14} className="text-primary" />
                <span>XP</span>
              </div>
              <p className="text-card-title font-mono text-foreground">{progress.xp}</p>
            </div>
            <div className="rounded-panel bg-muted/40 border border-border/60 px-3 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-chip text-muted-foreground">
                <HugeiconsIcon icon={Award01Icon} size={14} className="text-primary" />
                <span>Badges</span>
              </div>
              <p className="text-card-title font-mono text-foreground">
                {unlockedBadges.length}/{SPELL_BADGES.length}
              </p>
            </div>
          </div>
        </div>

        {/* XP Level Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-chip text-muted-foreground">
            <span>Level {levelInfo.level} Progress</span>
            <span className="font-mono">
              {levelInfo.currentXpInLevel} / {levelInfo.xpForNextLevel} XP
            </span>
          </div>
          <div className="w-full h-2 rounded-pill bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(levelInfo.currentXpInLevel / levelInfo.xpForNextLevel) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      {/* 5-Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { id: "learn", label: isBn ? "শব্দ ও সিলেবল" : "Learn & Syllables" },
            { id: "test", label: isBn ? "বানান পরীক্ষা" : "Spelling Test" },
            { id: "rules", label: isBn ? "বানানের নিয়ম" : "Spelling Rules" },
            { id: "ai", label: isBn ? "AI স্পেল মাস্টার" : "AI Spell Master" },
            {
              id: "progress",
              label: isBn
                ? `দুর্বল শব্দ (${weakList.length})`
                : `Weak & Badges (${weakList.length})`,
            },
          ] as const
        ).map((tab) => (
          <Button
            key={tab.id}
            type="button"
            size="sm"
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {isGuest && (
        <GuestLimitBanner
          previewPercent={config.guest_preview_percent}
          featureName={isBn ? "Spell Master" : "Spell Master"}
          nextPath="/spell-master"
        />
      )}

      {/* TAB 1: LEARN & SYLLABLES + AI SEARCH & ADD */}
      {activeTab === "learn" && (
        <div className="space-y-4">
          <Card className="p-4 sm:p-5 bg-card border border-border rounded-card space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2.5">
              {/* 1. Search Input (+ Ask AI button when >= 2 chars) */}
              <div className="flex flex-1 min-w-0 flex-col sm:flex-row gap-2">
                <div className="relative flex-1 min-w-0">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setAiLookupResult(null);
                      setAiLookupError(null);
                    }}
                    placeholder={
                      isBn
                        ? "যেকোনো ইংরেজি শব্দ খুঁজুন বা AI দিয়ে যোগ করুন..."
                        : "Search any English word or ask AI to add it..."
                    }
                    className="pl-10"
                  />
                </div>
                {searchQuery.trim().length >= 2 && (
                  <Button
                    type="button"
                    variant="cta"
                    size="md"
                    onClick={handleAiLookup}
                    disabled={aiLookupLoading}
                    className="gap-2 shrink-0"
                  >
                    <HugeiconsIcon
                      icon={aiLookupLoading ? RefreshIcon : SparklesIcon}
                      size={16}
                      className={cn(aiLookupLoading && "animate-spin")}
                    />
                    <span>
                      {aiLookupLoading
                        ? "Searching AI..."
                        : `Ask AI: "${searchQuery.trim()}"`}
                    </span>
                  </Button>
                )}
              </div>

              {/* 2. Main Category Dropdown */}
              <Select
                value={selectedGroup}
                onValueChange={(val) => {
                  setSelectedGroup((val ?? "all") as SpellCategoryGroupId | "all");
                  setSelectedCategory("all");
                  setVisibleCount(PAGE_BATCH);
                }}
              >
                <SelectTrigger className="w-full lg:w-52 shrink-0">
                  <SelectValue>
                    {(() => {
                      const grp = SPELL_CATEGORY_GROUPS.find((g) => g.id === selectedGroup);
                      return grp ? (isBn ? grp.labelBn : grp.label) : "All Categories";
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SPELL_CATEGORY_GROUPS.map((grp) => (
                    <SelectItem key={grp.id} value={grp.id}>
                      {isBn ? grp.labelBn : grp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 3. Subcategory Dropdown */}
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  setSelectedCategory((val ?? "all") as SpellCategoryId | "all");
                  setVisibleCount(PAGE_BATCH);
                }}
              >
                <SelectTrigger className="w-full lg:w-56 shrink-0">
                  <SelectValue>
                    {selectedCategory === "all"
                      ? `${isBn ? "সব সাব-ক্যাটাগরি" : "All Subcategories"} (${selectedGroup === "all" ? allWords.length : filteredWords.length})`
                      : CATEGORY_MAP.get(selectedCategory)?.label ?? selectedCategory}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {isBn ? "সব সাব-ক্যাটাগরি" : "All Subcategories"} ({selectedGroup === "all" ? allWords.length : filteredWords.length})
                  </SelectItem>
                  {activeGroupCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory !== "all" && CATEGORY_MAP.get(selectedCategory) && (
              <div className="space-y-1.5 pt-1">
                <p className="text-chip text-muted-foreground">
                  {CATEGORY_MAP.get(selectedCategory)?.description} ·{" "}
                  <span className="font-mono text-primary">
                    {filteredWords.length} words
                  </span>
                </p>
                {getRulesForCategories([selectedCategory]).length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-chip text-muted-foreground">Rules:</span>
                    {getRulesForCategories([selectedCategory]).map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setRulePart(r.part);
                          setRuleSearch(r.id);
                          setSelectedRuleId(r.id);
                          setActiveTab("rules");
                        }}
                        className="px-2 py-0.5 rounded-pill bg-primary/10 text-primary text-chip hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        {r.id}: {r.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          {aiLookupError && (
            <Card className="p-4 bg-destructive/10 border border-destructive/30 text-meta text-destructive">
              {aiLookupError}
            </Card>
          )}

          {aiLookupResult && (
            <Card className="p-5 bg-accent/40 border border-primary/40 rounded-card space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-chip text-primary">AI Generated Word</p>
                  <h3 className="text-card-title text-foreground">
                    {aiLookupResult.word}{" "}
                    <span className="text-meta font-mono text-muted-foreground">
                      ({aiLookupResult.syllables.join(" • ")})
                    </span>
                  </h3>
                  <p className="text-meta text-muted-foreground text-bangla">
                    {aiLookupResult.meaningBn}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="cta"
                  size="sm"
                  onClick={() => handleAddCustomWord(aiLookupResult)}
                >
                  + Add to Word List
                </Button>
              </div>
              <p className="text-meta text-foreground text-bangla">
                💡 {isBn ? aiLookupResult.mnemonicBn : aiLookupResult.mnemonicEn}
              </p>
            </Card>
          )}

          {/* Mobile Selected Word Details Card */}
          {wordDetailsSidebar && (
            <Card className="lg:hidden p-4 bg-card border border-border rounded-card shadow-xs">
              {wordDetailsSidebar}
            </Card>
          )}

          {/* Vocabulary-Style Compact 4-Column Word Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {visibleWords.map((item, idx) => {
              const isLocked = isGuest && idx >= guestUnlockedCount;
              const isSelected = !isLocked && selectedWord?.id === item.id;
              if (isLocked) {
                return (
                  <Link
                    key={item.id}
                    href="/auth/login?next=/spell-master"
                    className="rounded-card border border-border bg-muted/25 p-3.5 flex items-center justify-between gap-2 opacity-70 hover:opacity-100 transition-all text-left"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-label text-foreground truncate">
                        {item.word}
                      </p>
                      <p className="text-chip text-muted-foreground font-mono truncate">
                        {item.syllables.join(" • ")}
                      </p>
                    </div>
                    <Badge variant="warning" size="sm" className="shrink-0 gap-1">
                      <HugeiconsIcon icon={AiLockIcon} size={12} />
                      <span>{isBn ? "লক" : "Lock"}</span>
                    </Badge>
                  </Link>
                );
              }
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedWordId(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedWordId(item.id);
                    }
                  }}
                  className={cn(
                    "rounded-card border p-3.5 flex items-center justify-between gap-2 transition-all cursor-pointer text-left",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-2xs"
                      : "border-border bg-card hover:bg-muted/40"
                  )}
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-label text-foreground truncate">
                      {item.word}
                    </p>
                    <p className="text-chip text-primary font-mono truncate">
                      {item.syllables.join(" • ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWordId(item.id);
                      speakWord(item.word, false);
                    }}
                    aria-label={`Listen to ${item.word}`}
                    className="size-8 rounded-pill flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-colors shrink-0 cursor-pointer"
                  >
                    <HugeiconsIcon icon={VolumeHighIcon} size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {filteredWords.length > visibleCount && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setVisibleCount((c) => c + PAGE_BATCH)}
              >
                Show More ({filteredWords.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SPELLING TEST (AUDIO DICTATION & JUMBLED LETTERS) */}
      {activeTab === "test" && (
        <Card className="p-5 sm:p-6 bg-card border border-border rounded-card space-y-5 shadow-xs max-w-reading mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={testMode === "dictation" ? "default" : "outline"}
                onClick={() => resetTestTurn(undefined, "dictation")}
              >
                {isBn ? "অডিও শুনে টাইপ" : "Audio Dictation"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant={testMode === "jumbled" ? "default" : "outline"}
                onClick={() => resetTestTurn(undefined, "jumbled")}
              >
                {isBn ? "অক্ষর সাজানো" : "Jumbled Letters"}
              </Button>
            </div>
            <Badge variant="outline" size="sm" className="font-mono">
              Word {(testIndex % testQueue.length) + 1} / {testQueue.length}
            </Badge>
          </div>

          <div className="rounded-panel bg-muted/35 border border-border/60 p-5 text-center space-y-3">
            <p className="text-chip text-muted-foreground">
              {isBn ? "অর্থ:" : "Meaning:"}{" "}
              <strong className="text-foreground text-bangla">{currentTestWord.meaningBn}</strong>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <Button
                type="button"
                variant="cta"
                size="md"
                onClick={() => speakWord(currentTestWord.word, false)}
                className="gap-2"
              >
                <HugeiconsIcon icon={VolumeHighIcon} size={18} />
                <span>{isBn ? "শব্দটি শুনুন" : "Play Word"}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => speakSyllables(currentTestWord)}
              >
                {isBn ? "সিলেবল ভেঙে শুনুন" : "Slow Syllables"}
              </Button>
              {currentWordRules.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setShowTestHint((v) => !v)}
                >
                  {showTestHint
                    ? isBn ? "হিন্ট লুকান" : "Hide Hint"
                    : isBn ? "নিয়মের হিন্ট" : "Rule Hint"}
                </Button>
              )}
            </div>
            <p className="text-chip text-muted-foreground">
              {currentTestWord.syllables.length} syllables ·{" "}
              {currentTestWord.word.length} letters
            </p>
            {showTestHint && currentWordRules[0] && (
              <div className="rounded-panel bg-card border border-border p-3 text-left space-y-1">
                <p className="text-chip text-primary">
                  {currentWordRules[0].id}: {currentWordRules[0].title}
                </p>
                <p className={cn("text-chip text-muted-foreground", isBn && "text-bangla")}>
                  {isBn ? currentWordRules[0].summaryBn : currentWordRules[0].summaryEn}
                </p>
              </div>
            )}
          </div>

          {testMode === "dictation" ? (
            <div className="space-y-3">
              <Input
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCheckTestAnswer();
                }}
                placeholder={isBn ? "সঠিক বানানটি এখানে লিখুন..." : "Type the exact spelling..."}
                disabled={Boolean(testFeedback)}
                className="text-center text-lead"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected Letters Slot */}
              <div className="min-h-tap rounded-panel border border-border bg-background p-3 flex flex-wrap items-center justify-center gap-2">
                {jumbledPicked.length === 0 ? (
                  <span className="text-chip text-muted-foreground">
                    {isBn ? "নিচের অক্ষরগুলোতে ক্লিক করে শব্দ তৈরি করুন" : "Tap letters below to build the word"}
                  </span>
                ) : (
                  jumbledPicked.map((poolIdx, pos) => (
                    <button
                      key={`${poolIdx}-${pos}`}
                      type="button"
                      disabled={Boolean(testFeedback)}
                      onClick={() => {
                        setJumbledPicked((prev) => prev.filter((_, i) => i !== pos));
                      }}
                      className="size-9 rounded-control bg-primary text-primary-foreground text-label cursor-pointer"
                    >
                      {jumbledPool[poolIdx]?.char}
                    </button>
                  ))
                )}
              </div>

              {/* Letter Pool */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {jumbledPool.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={item.used || Boolean(testFeedback)}
                    onClick={() => {
                      setJumbledPicked((prev) => [...prev, idx]);
                    }}
                    className={cn(
                      "size-10 rounded-control border border-border text-label transition-all cursor-pointer",
                      item.used
                        ? "bg-muted text-muted-foreground/30 cursor-not-allowed"
                        : "bg-card hover:bg-accent text-foreground shadow-2xs"
                    )}
                  >
                    {item.char}
                  </button>
                ))}
              </div>
            </div>
          )}

          {testFeedback && (
            <div
              className={cn(
                "rounded-panel p-4 border space-y-1.5",
                testFeedback.isCorrect
                  ? "bg-primary/10 border-primary/30 text-foreground"
                  : "bg-destructive/10 border-destructive/30 text-foreground"
              )}
            >
              <div className="flex items-center gap-2 text-label">
                <HugeiconsIcon
                  icon={testFeedback.isCorrect ? CheckmarkCircle02Icon : Alert01Icon}
                  size={18}
                  className={testFeedback.isCorrect ? "text-primary" : "text-destructive"}
                />
                <span>{testFeedback.message}</span>
              </div>
              <p className={cn("text-meta text-muted-foreground", isBn && "text-bangla")}>
                💡 {testFeedback.mnemonic}
              </p>
              {!testFeedback.isCorrect && currentWordRules[0] && (
                <div className="mt-2 pt-2 border-t border-border/60 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-chip text-primary">
                      {currentWordRules[0].id}: {currentWordRules[0].title}
                    </p>
                    <Badge
                      variant={
                        currentWordRules[0].reliability === "high"
                          ? "success"
                          : currentWordRules[0].reliability === "medium"
                            ? "warning"
                            : "error"
                      }
                      size="sm"
                    >
                      {currentWordRules[0].reliability === "high"
                        ? "High"
                        : currentWordRules[0].reliability === "medium"
                          ? "Medium"
                          : "Guideline"}
                    </Badge>
                  </div>
                  <p className={cn("text-chip text-muted-foreground", isBn && "text-bangla")}>
                    {isBn ? currentWordRules[0].summaryBn : currentWordRules[0].summaryEn}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            {!testFeedback ? (
              <Button
                type="button"
                variant="cta"
                size="md"
                onClick={handleCheckTestAnswer}
                className="w-full"
              >
                {isBn ? "উত্তর যাচাই করুন" : "Check Spelling"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="default"
                size="md"
                onClick={() => resetTestTurn(testIndex + 1)}
                className="w-full gap-2"
              >
                <span>{isBn ? "পরবর্তী শব্দ" : "Next Word"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* TAB 3: SPELLING RULES (55 RULES WITH RELIABILITY & EXCEPTIONS) */}
      {activeTab === "rules" && (
        <div className="space-y-4">
          {/* Reliability Legend + Filters */}
          <Card className="p-4 sm:p-5 bg-card border border-border rounded-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-chip">
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <span className="text-label text-foreground">Reliability:</span>
                <span className="inline-flex items-center gap-1.5">
                  <Badge variant="success" size="sm">High</Badge>
                  <span>(প্রায় সব জায়গায় খাটে)</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Badge variant="warning" size="sm">Medium</Badge>
                  <span>(কিছু ব্যতিক্রম আছে)</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Badge variant="error" size="sm">Low</Badge>
                  <span>(শুধু গাইডলাইন, মুখস্থ ভালো)</span>
                </span>
              </div>
              <Badge variant="outline" size="sm" className="font-mono">
                {filteredRules.length} / {SPELLING_RULES_55.length} Rules
              </Badge>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-2.5">
              {/* 1. Rule Search Input */}
              <div className="relative flex-1 min-w-0">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  value={ruleSearch}
                  onChange={(e) => setRuleSearch(e.target.value)}
                  placeholder={
                    isBn
                      ? "রুল নম্বর (R6), নাম বা উদাহরণ খুঁজুন..."
                      : "Search rule (R6), keyword, or example..."
                  }
                  className="pl-9"
                />
              </div>

              {/* 2. Rule Group / Category Dropdown */}
              <Select
                value={rulePart}
                onValueChange={(val) => setRulePart((val ?? "all") as RulePartId)}
              >
                <SelectTrigger className="w-full lg:w-56 shrink-0">
                  <SelectValue>
                    {RULE_PARTS.find((p) => p.id === rulePart)?.label ?? "All Rules (55)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {RULE_PARTS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 3. Reliability Dropdown */}
              <Select
                value={ruleReliability}
                onValueChange={(val) =>
                  setRuleReliability((val ?? "all") as "all" | RuleReliability)
                }
              >
                <SelectTrigger className="w-full lg:w-44 shrink-0">
                  <SelectValue>
                    {ruleReliability === "high"
                      ? "High"
                      : ruleReliability === "medium"
                        ? "Medium"
                        : ruleReliability === "low"
                          ? "Low"
                          : isBn
                            ? "সব Reliability"
                            : "All Reliability"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {isBn ? "সব Reliability" : "All Reliability"}
                  </SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Mobile Selected Rule Details Card */}
          {ruleDetailsSidebar && (
            <Card className="lg:hidden p-4 bg-card border border-border rounded-card shadow-xs">
              {ruleDetailsSidebar}
            </Card>
          )}

          {/* Compact Rule Title Grid (Details in Right Sidebar) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredRules.map((rule) => {
              const isSelected = selectedRule?.id === rule.id;
              return (
                <div
                  key={rule.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedRuleId(rule.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedRuleId(rule.id);
                    }
                  }}
                  className={cn(
                    "rounded-card border p-3.5 flex flex-col justify-between gap-2 transition-all cursor-pointer text-left",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-2xs"
                      : "border-border bg-card hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="brand" size="sm" className="font-mono">
                      {rule.id}
                    </Badge>
                    <Badge
                      variant={
                        rule.reliability === "high"
                          ? "success"
                          : rule.reliability === "medium"
                            ? "warning"
                            : "error"
                      }
                      size="sm"
                    >
                      {rule.reliability === "high"
                        ? "High"
                        : rule.reliability === "medium"
                          ? "Medium"
                          : "Low"}
                    </Badge>
                  </div>
                  <p className="text-label text-foreground line-clamp-2">
                    {isBn ? rule.titleBn : rule.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AI SPELL MASTER (COACH + TEXT CHECKER) */}
      {activeTab === "ai" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* AI Mistake Pattern Coach & Quiz */}
          <Card className="p-5 bg-card border border-border rounded-card space-y-4 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={BotIcon} size={20} />
                </div>
                <div>
                  <h3 className="text-card-title text-foreground">
                    {isBn ? "AI ভুল প্যাটার্ন ও কুইজ কোচ" : "AI Pattern Coach & Quiz"}
                  </h3>
                  <p className="text-chip text-muted-foreground">
                    {isBn
                      ? "আপনার দুর্বল শব্দ ও ভুলের ধরন বিশ্লেষণ"
                      : "Personalized diagnosis, mnemonics & practice quiz"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="cta"
                size="sm"
                onClick={handleRunCoach}
                disabled={coachLoading}
                className="shrink-0 gap-1.5"
              >
                <HugeiconsIcon
                  icon={coachLoading ? RefreshIcon : SparklesIcon}
                  size={15}
                  className={cn(coachLoading && "animate-spin")}
                />
                <span>{coachLoading ? "Analyzing..." : isBn ? "বিশ্লেষণ করুন" : "Analyze"}</span>
              </Button>
            </div>

            {coachResult ? (
              <div className="space-y-4">
                <div className="rounded-panel bg-primary/5 border border-primary/20 p-4 space-y-1">
                  <p className="text-chip text-primary">AI Diagnosis</p>
                  <p className={cn("text-meta text-foreground leading-relaxed", isBn && "text-bangla")}>
                    {coachResult.diagnosis}
                  </p>
                </div>

                {coachResult.memoryTips.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-chip text-muted-foreground uppercase">
                      Personalized Memory Tricks
                    </p>
                    {coachResult.memoryTips.map((m, idx) => (
                      <div key={idx} className="rounded-panel bg-muted/40 p-3 text-meta space-y-0.5">
                        <p className="text-label text-foreground">{m.word}</p>
                        <p className={cn("text-muted-foreground", isBn && "text-bangla")}>{m.tip}</p>
                      </div>
                    ))}
                  </div>
                )}

                {coachResult.quiz.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-chip text-muted-foreground uppercase">
                      Custom Practice Quiz
                    </p>
                    {coachResult.quiz.map((q, qIdx) => {
                      const picked = coachQuizAnswers[qIdx];
                      return (
                        <div key={qIdx} className="rounded-panel border border-border p-3.5 space-y-2.5">
                          <p className={cn("text-label text-foreground", isBn && "text-bangla")}>
                            {qIdx + 1}. {q.question}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, oIdx) => {
                              const answered = picked !== undefined;
                              const isRight = oIdx === q.correctIndex;
                              const isSelected = picked === oIdx;
                              return (
                                <Button
                                  key={oIdx}
                                  type="button"
                                  size="sm"
                                  variant={
                                    answered
                                      ? isRight
                                        ? "default"
                                        : isSelected
                                        ? "destructive"
                                        : "outline"
                                      : "outline"
                                  }
                                  onClick={() =>
                                    setCoachQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                                  }
                                >
                                  {opt}
                                </Button>
                              );
                            })}
                          </div>
                          {picked !== undefined && (
                            <p className={cn("text-chip text-muted-foreground", isBn && "text-bangla")}>
                              💡 {q.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <p className={cn("text-meta text-muted-foreground py-6 text-center", isBn && "text-bangla")}>
                {isBn
                  ? '"বিশ্লেষণ করুন" বাটনে ক্লিক করলে AI আপনার ভুলের প্যাটার্ন দেখে কাস্টম কুইজ ও মেমরি ট্রিক তৈরি করবে।'
                  : 'Click "Analyze" to get personalized mistake pattern feedback and a custom quiz.'}
              </p>
            )}
          </Card>

          {/* Paste Text Spell Checker */}
          <Card className="p-5 bg-card border border-border rounded-card space-y-4 shadow-xs">
            <div className="space-y-1">
              <h3 className="text-card-title text-foreground">
                {isBn ? "টেক্সট পেস্ট করে বানান চেক করুন" : "Paste Text Spell Checker"}
              </h3>
              <p className={cn("text-chip text-muted-foreground", isBn && "text-bangla")}>
                {isBn
                  ? "যেকোনো ইংরেজি প্যারাগ্রাফ পেস্ট করলে AI বানান ভুল ধরে ব্যাখ্যা করে দেবে।"
                  : "Paste any paragraph and AI will highlight spelling errors with explanations."}
              </p>
            </div>

            <Textarea
              rows={5}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Example: I will definately recieve the seperate calender tommorow."
            />

            <Button
              type="button"
              variant="default"
              size="md"
              disabled={pasteText.trim().length < 3 || textCheckLoading}
              onClick={handleCheckPastedText}
              className="w-full gap-2"
            >
              <HugeiconsIcon
                icon={textCheckLoading ? RefreshIcon : CheckmarkBadge01Icon}
                size={18}
                className={cn(textCheckLoading && "animate-spin")}
              />
              <span>
                {textCheckLoading
                  ? "Checking..."
                  : isBn
                  ? "বানান ভুল খুঁজুন"
                  : "Check Spelling Errors"}
              </span>
            </Button>

            {textCheckResult && (
              <div className="space-y-3 pt-1">
                <div className="rounded-panel bg-muted/40 border border-border/60 p-3.5 space-y-1">
                  <p className="text-chip text-primary">Corrected Text</p>
                  <p className="text-meta text-foreground">{textCheckResult.correctedText}</p>
                </div>
                {textCheckResult.mistakes.map((m, idx) => (
                  <div key={idx} className="rounded-panel bg-muted/30 border border-border/60 p-3 space-y-1">
                    <div className="flex items-center gap-2 text-label">
                      <span className="line-through text-destructive">{m.wrong}</span>
                      <span>→</span>
                      <span className="text-label text-primary">{m.correct}</span>
                    </div>
                    <p className={cn("text-chip text-muted-foreground", isBn && "text-bangla")}>
                      {m.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 5: WEAK WORDS (SPACED REPETITION) & BADGES */}
      {activeTab === "progress" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-5 bg-card border border-border rounded-card space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-card-title text-foreground">
                {isBn ? "দুর্বল শব্দের তালিকা (Spaced Repetition)" : "Weak Words for Review"}
              </h3>
              {weakList.length > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="cta"
                  onClick={() => {
                    setTestIndex(0);
                    setActiveTab("test");
                  }}
                >
                  Practice Weak Words
                </Button>
              )}
            </div>

            {weakList.length === 0 ? (
              <p className={cn("text-meta text-muted-foreground py-6 text-center", isBn && "text-bangla")}>
                {isBn
                  ? "এখনো কোনো দুর্বল শব্দ নেই! বানান পরীক্ষায় ভুল করলে এখানে সেভ হবে।"
                  : "No weak words yet! Missed words from Spelling Test are saved here automatically."}
              </p>
            ) : (
              <div className="space-y-2.5">
                {weakList.map((w) => (
                  <div
                    key={w.wordId}
                    className="rounded-panel bg-muted/35 border border-border/60 p-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-label text-foreground">{w.word}</p>
                      <p className="text-chip text-muted-foreground">
                        Last wrong: <span className="text-destructive">{w.lastWrongAttempt}</span> ·{" "}
                        {w.mistakes}x missed
                      </p>
                    </div>
                    <Badge variant="outline" size="sm">{w.ruleCategory}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5 bg-card border border-border rounded-card space-y-4 shadow-xs">
            <h3 className="text-card-title text-foreground">
              {isBn ? "অর্জিত ব্যাজসমূহ" : "Achievements & Badges"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPELL_BADGES.map((badge) => {
                const earned = badge.check(progress);
                return (
                  <div
                    key={badge.id}
                    className={cn(
                      "rounded-panel border p-3.5 space-y-1 transition-all",
                      earned
                        ? "bg-primary/10 border-primary/40 text-foreground"
                        : "bg-muted/30 border-border/50 text-muted-foreground opacity-65"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-label">
                        {isBn ? badge.titleBn : badge.title}
                      </span>
                      <HugeiconsIcon
                        icon={Award01Icon}
                        size={16}
                        className={earned ? "text-primary" : "text-muted-foreground"}
                      />
                    </div>
                    <p className="text-chip">{badge.description}</p>
                  </div>
                );
              })}
            </div>

            {Object.keys(progress.ruleMistakes || {}).length > 0 && (
              <div className="pt-3 border-t border-border/60 space-y-2">
                <p className="text-chip text-foreground uppercase">
                  {isBn ? "যে রুলগুলোতে বেশি ভুল হচ্ছে" : "Weak Rules Tracker"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(progress.ruleMistakes)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([rId, count]) => (
                      <button
                        key={rId}
                        type="button"
                        onClick={() => {
                          setRulePart("all");
                          setRuleSearch(rId);
                          setSelectedRuleId(rId);
                          setActiveTab("rules");
                        }}
                        className="px-3 py-1 rounded-pill bg-destructive/10 text-destructive text-chip cursor-pointer"
                      >
                        {rId} · {count}x missed
                      </button>
                    ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </PageContainer>

      {/* Fixed Right Sidebar: Selected Word or Rule Details */}
      {activeTab === "learn" && wordDetailsSidebar && (
        <aside className="hidden lg:flex flex-col fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4">
          {wordDetailsSidebar}
        </aside>
      )}
      {activeTab === "rules" && ruleDetailsSidebar && (
        <aside className="hidden lg:flex flex-col fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4">
          {ruleDetailsSidebar}
        </aside>
      )}
    </div>
  );
}
