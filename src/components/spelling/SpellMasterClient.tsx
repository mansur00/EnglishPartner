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
} from "@hugeicons/core-free-icons";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LocaleTitle } from "@/components/shared";
import { useLocale } from "@/lib/i18n";
import { speakText } from "@/lib/audio/speech-engine";
import { cn } from "@/lib/utils";
import {
  CURATED_SPELL_WORDS,
  SPELLING_RULES,
  SPELL_BADGES,
  SPELL_STORAGE_KEY,
  DEFAULT_SPELL_PROGRESS,
  getLevelFromXp,
  type SpellWord,
  type SpellRuleCategory,
  type SpellProgressState,
} from "@/lib/spelling/spell-data";
import type {
  SpellLookupResponse,
  SpellCoachResponse,
  SpellCheckTextResponse,
} from "@/lib/ai/spell-master";

type SpellTab = "learn" | "test" | "rules" | "ai" | "progress";
type TestMode = "dictation" | "jumbled";

const CATEGORY_LABELS: { id: "all" | SpellRuleCategory; label: string }[] = [
  { id: "all", label: "All Words" },
  { id: "common-traps", label: "Common Traps" },
  { id: "i-before-e", label: "I Before E" },
  { id: "silent-letter", label: "Silent Letters" },
  { id: "double-consonant", label: "Double Consonant" },
  { id: "suffix-rules", label: "Suffix Rules" },
];

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

  const [activeTab, setActiveTab] = useState<SpellTab>("learn");
  const [progress, setProgress] = useState<SpellProgressState>(DEFAULT_SPELL_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  // Learn Tab State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | SpellRuleCategory>("all");
  const [aiLookupLoading, setAiLookupLoading] = useState(false);
  const [aiLookupResult, setAiLookupResult] = useState<SpellLookupResponse | null>(null);
  const [aiLookupError, setAiLookupError] = useState<string | null>(null);

  // Test Tab State
  const [testMode, setTestMode] = useState<TestMode>("dictation");
  const [testIndex, setTestIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [jumbledPicked, setJumbledPicked] = useState<number[]>([]);
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
            weakWords: parsed.weakWords || {},
            masteredIds: Array.isArray(parsed.masteredIds) ? parsed.masteredIds : [],
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

  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allWords.filter((item) => {
      if (selectedCategory !== "all" && item.ruleCategory !== selectedCategory) {
        return false;
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
  }, [allWords, searchQuery, selectedCategory]);

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
    setTestFeedback(null);
    setNowMs(Date.now());
  };

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
    const newWord: SpellWord = {
      id: `custom-${Date.now()}`,
      word: lookup.word,
      syllables: lookup.syllables,
      phonetic: lookup.phonetic,
      meaningBn: lookup.meaningBn,
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
    const isCorrect = userAttempt.toLowerCase() === currentTestWord.word.toLowerCase();

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
        return {
          ...prev,
          streak: 0,
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

  return (
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

      {/* TAB 1: LEARN & SYLLABLES + AI SEARCH & ADD */}
      {activeTab === "learn" && (
        <div className="space-y-4">
          <Card className="p-4 sm:p-5 bg-card border border-border rounded-card space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
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

            <div className="flex flex-wrap gap-2">
              {CATEGORY_LABELS.map((cat) => (
                <Button
                  key={cat.id}
                  type="button"
                  size="xs"
                  variant={selectedCategory === cat.id ? "secondary" : "ghost"}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
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
                  <p className="text-chip text-primary font-semibold">AI Generated Word</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords.map((item) => {
              const isMastered = progress.masteredIds.includes(item.id);
              const isWeak = Boolean(progress.weakWords[item.id]);
              return (
                <Card
                  key={item.id}
                  className="p-4 sm:p-5 bg-card border border-border rounded-card flex flex-col justify-between gap-3.5 shadow-xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-card-title text-foreground font-semibold">
                            {item.word}
                          </h3>
                          {item.isCustom && (
                            <Badge variant="brand" size="sm">AI Added</Badge>
                          )}
                          {isMastered && (
                            <Badge variant="accent" size="sm">Mastered</Badge>
                          )}
                          {isWeak && (
                            <Badge variant="outline" size="sm">Needs Review</Badge>
                          )}
                        </div>
                        <p className="text-chip font-mono text-muted-foreground mt-0.5">
                          {item.phonetic} ·{" "}
                          <span className="text-primary font-semibold">
                            {item.syllables.join(" • ")}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          onClick={() => speakWord(item.word, false)}
                          title="Listen Normal"
                          className="gap-1"
                        >
                          <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                          <span>Speak</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => speakSyllables(item)}
                          title="Listen Syllable by Syllable"
                        >
                          Slow
                        </Button>
                      </div>
                    </div>

                    <p className="text-label text-foreground text-bangla">
                      {item.meaningBn}
                    </p>

                    <div className="rounded-panel bg-muted/40 border border-border/60 p-3 space-y-1.5 text-meta">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-chip text-destructive line-through">
                          ✗ {item.commonMistake}
                        </span>
                        <span className="text-chip text-primary font-semibold">
                          ✓ {item.word}
                        </span>
                      </div>
                      <p className={cn("text-chip text-muted-foreground", isBn && "text-bangla")}>
                        💡 {isBn ? item.mnemonicBn : item.mnemonicEn}
                      </p>
                    </div>
                  </div>

                  <p className="text-chip text-muted-foreground italic border-t border-border/60 pt-2">
                    &ldquo;{item.exampleSentence}&rdquo;
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SPELLING TEST (AUDIO DICTATION & JUMBLED LETTERS) */}
      {activeTab === "test" && (
        <Card className="p-5 sm:p-6 bg-card border border-border rounded-card space-y-5 shadow-xs max-w-2xl mx-auto">
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
            </div>
            <p className="text-chip text-muted-foreground">
              Hint: {currentTestWord.syllables.length} syllables ·{" "}
              {currentTestWord.word.length} letters
            </p>
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
              <div className="min-h-12 rounded-panel border border-border bg-background p-3 flex flex-wrap items-center justify-center gap-2">
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
                      className="size-9 rounded-control bg-primary text-primary-foreground font-semibold text-label cursor-pointer"
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
                      "size-10 rounded-control border border-border font-semibold text-label transition-all cursor-pointer",
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
              <div className="flex items-center gap-2 font-semibold text-label">
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

      {/* TAB 3: SPELLING RULES */}
      {activeTab === "rules" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SPELLING_RULES.map((rule) => (
            <Card
              key={rule.id}
              className="p-5 bg-card border border-border rounded-card space-y-3.5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-card-title text-foreground font-semibold">
                    {isBn ? rule.titleBn : rule.title}
                  </h3>
                  <p className="text-chip font-mono text-primary">{rule.formula}</p>
                </div>
                <HugeiconsIcon icon={BookOpen01Icon} size={20} className="text-primary shrink-0" />
              </div>

              <p className={cn("text-meta text-muted-foreground leading-relaxed", isBn && "text-bangla")}>
                {isBn ? rule.explanationBn : rule.explanationEn}
              </p>

              <div className="flex flex-wrap gap-2">
                {rule.examples.map((ex) => (
                  <button
                    key={ex.word}
                    type="button"
                    onClick={() => speakWord(ex.word)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-muted/50 hover:bg-accent text-chip text-foreground cursor-pointer transition-colors"
                  >
                    <HugeiconsIcon icon={VolumeHighIcon} size={13} className="text-primary" />
                    <span className="font-semibold">{ex.word}</span>
                    <span className="text-muted-foreground">({ex.note})</span>
                  </button>
                ))}
              </div>

              <p className="text-chip text-muted-foreground border-t border-border/60 pt-2">
                Note: {rule.exceptionNote}
              </p>
            </Card>
          ))}
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
                  <p className="text-chip font-semibold text-primary">AI Diagnosis</p>
                  <p className={cn("text-meta text-foreground leading-relaxed", isBn && "text-bangla")}>
                    {coachResult.diagnosis}
                  </p>
                </div>

                {coachResult.memoryTips.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-chip font-semibold text-muted-foreground uppercase">
                      Personalized Memory Tricks
                    </p>
                    {coachResult.memoryTips.map((m, idx) => (
                      <div key={idx} className="rounded-panel bg-muted/40 p-3 text-meta space-y-0.5">
                        <p className="font-semibold text-foreground">{m.word}</p>
                        <p className={cn("text-muted-foreground", isBn && "text-bangla")}>{m.tip}</p>
                      </div>
                    ))}
                  </div>
                )}

                {coachResult.quiz.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-chip font-semibold text-muted-foreground uppercase">
                      Custom Practice Quiz
                    </p>
                    {coachResult.quiz.map((q, qIdx) => {
                      const picked = coachQuizAnswers[qIdx];
                      return (
                        <div key={qIdx} className="rounded-panel border border-border p-3.5 space-y-2.5">
                          <p className={cn("text-label font-semibold text-foreground", isBn && "text-bangla")}>
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

            <textarea
              rows={5}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Example: I will definately recieve the seperate calender tommorow."
              className="w-full rounded-panel border border-border bg-background p-3.5 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                  <p className="text-chip font-semibold text-primary">Corrected Text</p>
                  <p className="text-meta text-foreground">{textCheckResult.correctedText}</p>
                </div>
                {textCheckResult.mistakes.map((m, idx) => (
                  <div key={idx} className="rounded-panel bg-muted/30 border border-border/60 p-3 space-y-1">
                    <div className="flex items-center gap-2 text-label">
                      <span className="line-through text-destructive">{m.wrong}</span>
                      <span>→</span>
                      <span className="font-semibold text-primary">{m.correct}</span>
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
                      <p className="text-label font-semibold text-foreground">{w.word}</p>
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
                      <span className="text-label font-semibold">
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
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
