"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChatTurnBubble } from "./ChatTurnBubble";
import { ConversationInspectorSidebar } from "./ConversationInspectorSidebar";
import { AudioPlayer } from "./AudioPlayer";
import { WordDetailPopover } from "./WordDetailPopover";
import { GrammarPanel } from "./GrammarPanel";
import { ReviewSummary } from "./ReviewSummary";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { LoadingBox } from "@/components/shared/LoadingBox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GrammarProvider } from "@/lib/grammar/context";
import { RuleCardDialog } from "@/components/grammar/RuleCard";
import { loadConversationAnnotation } from "@/lib/grammar/loader";
import type { ConversationAnnotation, RenderToken } from "@/lib/grammar/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SlidersHorizontalIcon,
  CheckmarkBadge01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import type { ConversationVersionData } from "@/content/seed/dialogues";
import {
  SEED_VOCABULARY,
  SEED_GRAMMAR_EXPLANATIONS,
  VocabularyEntry,
  SentenceGrammarEntry,
} from "@/content/seed/vocabulary";
import { useTranslations, t } from "@/lib/i18n";
import {
  getLengthTiersForLevel,
  getLengthTierById,
  getDefaultLengthTierForLevel,
  CONVERSATION_STYLES,
  type CefrLevelCode,
  type ConversationStyle,
} from "@/lib/content/length-tiers";
import { buildProgressiveDialogueVersion } from "@/lib/content/dialogue-builder";
import { ConversationQuizDialog } from "@/components/quiz/ConversationQuizDialog";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import { getQuestionCountForLevel } from "@/lib/quiz/types";

interface ConversationReaderProps {
  versions: ConversationVersionData[];
  scenarioTitleEn?: string;
  scenarioTitleBn?: string;
  scenarioSlug?: string;
  scenarioLevel?: CefrLevelCode;
  scenarioDescription?: string;
  stepNumber?: number;
  totalSteps?: number;
  stepFocus?: string;
  prevStepSlug?: string;
  nextStepSlug?: string;
  nextStepTitle?: string;
}

export function ConversationReader(props: ConversationReaderProps) {
  return (
    <GrammarProvider>
      <ConversationReaderInner {...props} />
    </GrammarProvider>
  );
}

function ConversationReaderInner({
  versions,
  scenarioTitleEn = "English Conversation Practice",
  scenarioTitleBn = "ইংরেজি কথোপকথন অনুশীলন",
  scenarioSlug,
  scenarioLevel,
  scenarioDescription,
  prevStepSlug,
  nextStepSlug,
  nextStepTitle,
}: ConversationReaderProps) {
  const { locale } = useTranslations();
  const searchParams = useSearchParams();
  const effectiveLevel = (scenarioLevel || (versions[0]?.level as CefrLevelCode) || "A1") as CefrLevelCode;
  const levelTiers = useMemo(() => getLengthTiersForLevel(effectiveLevel), [effectiveLevel]);

  const initialLengthParam = searchParams.get("length");
  const initialStyleParam = searchParams.get("style") as ConversationStyle | null;

  const [selectedTierId, setSelectedTierId] = useState<string>(() => {
    const matched = initialLengthParam ? getLengthTierById(initialLengthParam) : undefined;
    if (matched && matched.cefrLevel === effectiveLevel) return matched.id;
    return getDefaultLengthTierForLevel(effectiveLevel).id;
  });

  const [selectedStyle, setSelectedStyle] = useState<ConversationStyle>(() => {
    if (initialStyleParam && CONVERSATION_STYLES.includes(initialStyleParam)) {
      return initialStyleParam;
    }
    return (versions[0]?.communicationStyle as ConversationStyle) || "neutral";
  });

  const [aiVersionsMap, setAiVersionsMap] = useState<Record<string, ConversationVersionData>>({});
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    versions[0]?.versionId || ""
  );
  const [accent, setAccent] = useState<"en-US" | "en-GB">("en-US");
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number>(0);
  const [isMobileInspectorOpen, setIsMobileInspectorOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Active Word Popover, Grammar Panel, Auth Prompt Modal
  const [selectedWordEntry, setSelectedWordEntry] = useState<VocabularyEntry | null>(null);
  const [selectedTokenData, setSelectedTokenData] = useState<RenderToken | null>(null);
  const [isWordPopoverOpen, setIsWordPopoverOpen] = useState(false);

  const [selectedGrammarEntry, setSelectedGrammarEntry] = useState<SentenceGrammarEntry | null>(null);
  const [isGrammarPanelOpen, setIsGrammarPanelOpen] = useState(false);

  // Grammar System State
  const [annotation, setAnnotation] = useState<ConversationAnnotation | null>(null);
  const [selectedRuleKey, setSelectedRuleKey] = useState<string | null>(null);
  const [isRuleCardOpen, setIsRuleCardOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPurpose, setAuthModalPurpose] = useState<string>("");

  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const [isScenarioBookmarked, setIsScenarioBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load static grammar annotations lazily
  useEffect(() => {
    if (scenarioSlug) {
      loadConversationAnnotation(scenarioSlug).then((data) => {
        if (data) {
          setAnnotation(data);
        }
      });
    }
  }, [scenarioSlug]);

  // Initialize saved words from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ecp_saved_vocabulary");
      const storedBookmarks = localStorage.getItem("ecp_scenario_bookmarks");

      queueMicrotask(() => {
        if (stored) {
          setSavedWords(new Set(JSON.parse(stored)));
        }
        if (storedBookmarks && scenarioSlug) {
          const bookmarks = JSON.parse(storedBookmarks);
          if (bookmarks.includes(scenarioSlug)) {
            setIsScenarioBookmarked(true);
          }
        }
      });
    } catch {
      // LocalStorage unavailable
    }
  }, [scenarioSlug]);

  const dynamicKey = `${selectedTierId}:${selectedStyle}`;

  useEffect(() => {
    if (!scenarioLevel || !scenarioSlug) return;
    if (aiVersionsMap[dynamicKey]) return;

    let cancelled = false;
    fetch("/api/v1/conversations/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: scenarioSlug,
        title: scenarioTitleEn,
        description: scenarioDescription || scenarioTitleEn,
        level: effectiveLevel,
        lengthTierId: selectedTierId,
        style: selectedStyle,
        speakers: versions[0]?.speakers,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.version) {
          setAiVersionsMap((prev) => ({ ...prev, [dynamicKey]: data.version }));
        }
      })
      .catch(() => { });

    return () => {
      cancelled = true;
    };
  }, [scenarioLevel, scenarioSlug, scenarioTitleEn, scenarioDescription, effectiveLevel, selectedTierId, selectedStyle, dynamicKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentVersion = useMemo(() => {
    if (scenarioLevel) {
      return (
        aiVersionsMap[dynamicKey] ||
        buildProgressiveDialogueVersion({
          slug: scenarioSlug || "conversation",
          title: scenarioTitleEn,
          level: effectiveLevel,
          lengthTierId: selectedTierId,
          style: selectedStyle,
          speakers: versions[0]?.speakers,
        })
      );
    }
    return versions.find((v) => v.versionId === selectedVersionId) || versions[0];
  }, [scenarioLevel, aiVersionsMap, dynamicKey, scenarioSlug, scenarioTitleEn, effectiveLevel, selectedTierId, selectedStyle, versions, selectedVersionId]);

  const presentCategories = useMemo(() => {
    const set = new Set<string>();
    if (annotation) {
      for (const line of annotation.lines) {
        for (const tok of line.tokens) {
          if (tok.pos && tok.pos !== "punctuation") set.add(tok.pos);
          if (tok.role) set.add(tok.role);
        }
        if (line.groups) {
          for (const grp of line.groups) {
            if (grp.time && grp.aspect) set.add(`${grp.time}-${grp.aspect}`);
            if (grp.key) set.add(grp.key);
          }
        }
      }
    } else {
      ["noun", "verb", "adjective", "pronoun", "determiner", "preposition"].forEach((k) =>
        set.add(k)
      );
    }
    return Array.from(set);
  }, [annotation]);

  if (!currentVersion) {
    return <LoadingBox message="Dialogue content is being prepared." />;
  }

  const speakerMap = new Map(currentVersion.speakers.map((s) => [s.id, s]));
  const primaryLeftSpeakerId = currentVersion.speakers[0]?.id;

  const safeSelectedLineIndex =
    selectedLineIndex >= 0 && selectedLineIndex < currentVersion.lines.length
      ? selectedLineIndex
      : 0;
  const selectedLine = currentVersion.lines[safeSelectedLineIndex] || null;
  const selectedSpeaker = selectedLine
    ? speakerMap.get(selectedLine.speakerId) || currentVersion.speakers[0] || null
    : null;
  const selectedLineAnnotation = selectedLine
    ? annotation?.lines.find(
      (l) => l.lineId === selectedLine.id || l.text.trim() === selectedLine.englishText.trim()
    )
    : undefined;

  // Word Lookup Function
  const handleWordClick = (word: string, tokenData?: RenderToken) => {
    const clean = word.toLowerCase().trim();
    setSelectedTokenData(tokenData || null);

    // 1. Direct match in dictionary
    let foundEntry: VocabularyEntry | undefined = SEED_VOCABULARY[clean];

    // 2. Search by lemma or word in SEED_VOCABULARY
    if (!foundEntry) {
      foundEntry = Object.values(SEED_VOCABULARY).find(
        (v) =>
          v.lemma.toLowerCase() === clean ||
          v.word.toLowerCase() === clean ||
          v.word.toLowerCase().includes(clean)
      );
    }

    // 3. Fallback entry if not in static seed
    if (!foundEntry) {
      const pos = tokenData && tokenData.pos !== "unannotated" ? (tokenData.pos as VocabularyEntry["partOfSpeech"]) : "noun";
      foundEntry = {
        word: word.charAt(0).toUpperCase() + word.slice(1),
        lemma: clean,
        ipa: `/${clean}/`,
        partOfSpeech: pos,
        contextualMeaningBn: `"${word}" শব্দটির অর্থ ও ব্যাকরণগত প্রয়োগ`,
        generalMeaningBn: `প্রসঙ্গ অনুযায়ী এর প্রয়োগ লক্ষ্য করুন।`,
        exampleSentence: `Practice using "${word}" in your daily conversations.`,
      };
    }

    setSelectedWordEntry(foundEntry);
    setIsWordPopoverOpen(true);
  };

  // Toggle Save Word (A-01: saves in guest memory and shows non-blocking auth prompt)
  const handleSaveWordToggle = (lemma: string) => {
    setSavedWords((prev) => {
      const updated = new Set(prev);
      if (updated.has(lemma)) {
        updated.delete(lemma);
      } else {
        updated.add(lemma);
        // Prompt guest user to sign in to sync with cloud
        setAuthModalPurpose(locale === "bn" ? "শব্দভান্ডার সংরক্ষণ" : "Save Vocabulary");
        setIsAuthModalOpen(true);
      }
      try {
        localStorage.setItem("ecp_saved_vocabulary", JSON.stringify(Array.from(updated)));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Toggle Scenario Bookmark
  const handleBookmarkScenario = () => {
    setIsScenarioBookmarked((prev) => {
      const next = !prev;
      if (next) {
        setAuthModalPurpose(locale === "bn" ? "দৃশ্যপট বুকমার্ক" : "Bookmark Scenario");
        setIsAuthModalOpen(true);
      }
      try {
        const stored = localStorage.getItem("ecp_scenario_bookmarks");
        const list: string[] = stored ? JSON.parse(stored) : [];
        const nextList = next
          ? Array.from(new Set([...list, scenarioSlug || ""]))
          : list.filter((s) => s !== scenarioSlug);
        localStorage.setItem("ecp_scenario_bookmarks", JSON.stringify(nextList));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Grammar Panel Click
  const handleGrammarClick = (lineId: string) => {
    const entry = SEED_GRAMMAR_EXPLANATIONS[lineId];
    if (entry) {
      setSelectedGrammarEntry(entry);
    } else {
      const targetLine = currentVersion.lines.find((l) => l.id === lineId);
      setSelectedGrammarEntry({
        lineId,
        sentenceText: targetLine?.englishText || "Sentence Analysis",
        structure: {
          subject: "Identified Subject",
          verb: "Main Action / Verb Phrase",
          objectOrComplement: "Predicate Object / Complement Clause",
          tenseName: "Standard Conversational English",
          tensePattern: "Subject + Verb Phrase + Complement",
          whyUsedBn: "দৈনন্দিন স্বাভাবিক কথোপকথনে এই বাক্যটি ব্যবহৃত হয়।",
        },
        politeAlternatives: [
          targetLine?.englishText || "Alternative expression",
        ],
        commonMistakes: [],
      });
    }
    setIsGrammarPanelOpen(true);
  };

  const handleRuleClick = (ruleKey: string) => {
    setSelectedRuleKey(ruleKey);
    setIsRuleCardOpen(true);
  };

  // Gather vocabulary items used in this conversation
  const scenarioVocabList: VocabularyEntry[] = [];
  currentVersion.lines.forEach((line) => {
    if (line.wordHighlights) {
      line.wordHighlights.forEach((w) => {
        const key = w.toLowerCase();
        if (SEED_VOCABULARY[key]) {
          scenarioVocabList.push(SEED_VOCABULARY[key]);
        }
      });
    }
  });

  return (
    <div>
      {/* CENTER: Conversation Content Area */}
      <div className="space-y-5 min-w-0">
        {/* Single Unified 2-Sided Chat Conversation Card */}
        <Card className="p-4 sm:p-6 bg-card rounded-card shadow-card border border-border/60 space-y-5">
          {/* Conversation Card Header (with Step Nav, Mobile Controls & Finish Lesson) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading text-card-title text-foreground">
                  {locale === "bn" ? "কথোপকথন ও লিসেনিং অনুশীলন" : "Dialogue Turns & Listening Practice"}
                </h2>
                <Badge variant="neutral" size="sm" className="font-mono">
                  {currentVersion.lines.length} {locale === "bn" ? "বাক্য" : "turns"}
                </Badge>
                <Badge variant="brand" size="sm" className="capitalize">
                  {selectedStyle}
                </Badge>
              </div>
              <p className="text-chip text-muted-foreground">
                {locale === "bn"
                  ? "যেকোনো বাক্যে ট্যাপ করলে ডানপাশে অনুবাদ ও গ্রামার দেখাবে"
                  : "Tap any sentence to view its translation and grammar in the sidebar"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {prevStepSlug && (
                <Link href={`/conversations/${prevStepSlug}`}>
                  <Button variant="outline" size="sm" className="h-9 text-label rounded-control gap-1">
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                    <span>{t("reader.previousStep", locale)}</span>
                  </Button>
                </Link>
              )}
              {nextStepSlug && (
                <Link href={`/conversations/${nextStepSlug}`}>
                  <Button variant="default" size="sm" className="h-9 text-label rounded-control gap-1">
                    <span>{t("reader.nextStep", locale)}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </Button>
                </Link>
              )}

              {/* Mobile Inspector & Style/Length Drawer Trigger */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsMobileInspectorOpen(true)}
                className="lg:hidden h-9 text-label rounded-control gap-1.5"
              >
                <HugeiconsIcon icon={SlidersHorizontalIcon} size={15} />
                <span>{locale === "bn" ? "স্টাইল, গ্রামার ও অনুবাদ" : "Style, Grammar & Translate"}</span>
              </Button>

              <Button
                variant={isCompleted ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIsCompleted(!isCompleted)}
                className="h-9 text-label rounded-control gap-1.5"
              >
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={15} />
                <span>{isCompleted ? t("reader.completedLesson", locale) : t("reader.finishLesson", locale)}</span>
              </Button>
            </div>
          </div>

          {/* 2-Sided Chat Bubbles Stream (Pure English Only) */}
          <div className="space-y-4">
            {currentVersion.lines.map((line, index) => {
              const speaker = speakerMap.get(line.speakerId) || {
                id: line.speakerId,
                name: t("reader.speaker", locale),
                nameBn: "বক্তা",
                role: t("reader.participant", locale),
                roleBn: "অংশগ্রহণকারী",
                avatarChar: "S",
                colorScheme: "brand" as const,
              };

              const lineAnnotation = annotation?.lines.find(
                (l) => l.lineId === line.id || l.text.trim() === line.englishText.trim()
              );

              // Alternate left/right by speaker (first speaker on left, second on right; fallback by index)
              const isLeft = primaryLeftSpeakerId
                ? line.speakerId === primaryLeftSpeakerId
                : index % 2 === 0;

              return (
                <ChatTurnBubble
                  key={line.id}
                  line={line}
                  speaker={speaker}
                  side={isLeft ? "left" : "right"}
                  accent={accent}
                  isSelected={safeSelectedLineIndex === index}
                  isCurrentlyPlaying={activeLineIndex === index}
                  annotation={lineAnnotation}
                  onSelect={() => {
                    setSelectedLineIndex(index);
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      setIsMobileInspectorOpen(true);
                    }
                  }}
                  onLinePlayStart={() => {
                    setActiveLineIndex(index);
                    setSelectedLineIndex(index);
                  }}
                  onLinePlayEnd={() => setActiveLineIndex(null)}
                  onWordClick={handleWordClick}
                />
              );
            })}
          </div>
        </Card>

        {/* Sticky Full Audio Player (Mobile/Tablet only — Desktop uses Right Sidebar) */}
        <div className="lg:hidden">
          <AudioPlayer
            lines={currentVersion.lines}
            accent={accent}
            onAccentChange={setAccent}
            activeLineIndex={activeLineIndex}
            onActiveLineChange={(idx) => {
              setActiveLineIndex(idx);
              if (idx !== null) setSelectedLineIndex(idx);
            }}
          />
        </div>

        {/* Review Summary */}
        <ReviewSummary
          scenarioTitleEn={scenarioTitleEn}
          scenarioTitleBn={scenarioTitleBn}
          vocabularyList={scenarioVocabList}
          onRestart={() => {
            setActiveLineIndex(0);
            setSelectedLineIndex(0);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onBookmarkScenario={handleBookmarkScenario}
          isScenarioBookmarked={isScenarioBookmarked}
          savedWords={savedWords}
          onSaveWordToggle={handleSaveWordToggle}
          nextScenarioSlug={nextStepSlug}
          nextScenarioTitle={nextStepTitle}
          onStartQuiz={() => setIsQuizOpen(true)}
          quizQuestionCount={getQuestionCountForLevel(effectiveLevel)}
        />
      </div>

      {/* RIGHT FIXED SIDEBAR (Exact mirror of Left Sidebar: fixed right-0, top-header, h-below-header, bg-card, border-l) */}
      <aside className="hidden lg:flex flex-col fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4">
        <ConversationInspectorSidebar
          scenarioLevel={scenarioLevel}
          effectiveLevel={effectiveLevel}
          levelTiers={levelTiers}
          selectedTierId={selectedTierId}
          onSelectTier={(tierId) => {
            setSelectedTierId(tierId);
            setActiveLineIndex(null);
            setSelectedLineIndex(0);
          }}
          selectedStyle={selectedStyle}
          onSelectStyle={(style) => {
            setSelectedStyle(style);
            setActiveLineIndex(null);
            setSelectedLineIndex(0);
          }}
          versions={versions}
          selectedVersionId={selectedVersionId}
          onSelectVersion={(verId) => {
            setSelectedVersionId(verId);
            setActiveLineIndex(null);
            setSelectedLineIndex(0);
          }}
          presentCategories={presentCategories}
          selectedLine={selectedLine}
          selectedSpeaker={selectedSpeaker}
          selectedAnnotation={selectedLineAnnotation}
          accent={accent}
          onAccentChange={setAccent}
          lines={currentVersion.lines}
          activeLineIndex={activeLineIndex}
          onActiveLineChange={(idx) => {
            setActiveLineIndex(idx);
            if (idx !== null) setSelectedLineIndex(idx);
          }}
          onOpenFullGrammarModal={handleGrammarClick}
          onRuleClick={handleRuleClick}
        />
      </aside>

      {/* MOBILE / TABLET SLIDE-UP DRAWER */}
      <Sheet open={isMobileInspectorOpen} onOpenChange={setIsMobileInspectorOpen}>
        <SheetContent
          side="bottom"
          className="lg:hidden max-h-[85vh] overflow-y-auto rounded-t-card p-4 sm:p-5 bg-background"
        >
          <SheetHeader className="pb-3 border-b border-border/60 text-left">
            <SheetTitle className="text-card-title text-foreground">
              {locale === "bn" ? "বাক্য বিশ্লেষণ ও সেটিংস" : "Sentence Inspector & Controls"}
            </SheetTitle>
          </SheetHeader>
          <div className="pt-4">
            <ConversationInspectorSidebar
              scenarioLevel={scenarioLevel}
              effectiveLevel={effectiveLevel}
              levelTiers={levelTiers}
              selectedTierId={selectedTierId}
              onSelectTier={(tierId) => {
                setSelectedTierId(tierId);
                setActiveLineIndex(null);
                setSelectedLineIndex(0);
              }}
              selectedStyle={selectedStyle}
              onSelectStyle={(style) => {
                setSelectedStyle(style);
                setActiveLineIndex(null);
                setSelectedLineIndex(0);
              }}
              versions={versions}
              selectedVersionId={selectedVersionId}
              onSelectVersion={(verId) => {
                setSelectedVersionId(verId);
                setActiveLineIndex(null);
                setSelectedLineIndex(0);
              }}
              presentCategories={presentCategories}
              selectedLine={selectedLine}
              selectedSpeaker={selectedSpeaker}
              selectedAnnotation={selectedLineAnnotation}
              accent={accent}
              onOpenFullGrammarModal={handleGrammarClick}
              onRuleClick={handleRuleClick}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Word Detail Popover */}
      <WordDetailPopover
        entry={selectedWordEntry}
        isOpen={isWordPopoverOpen}
        onClose={() => {
          setIsWordPopoverOpen(false);
          setSelectedTokenData(null);
        }}
        onSaveToggle={handleSaveWordToggle}
        isSaved={selectedWordEntry ? savedWords.has(selectedWordEntry.lemma) : false}
        tokenData={selectedTokenData}
        onRuleClick={handleRuleClick}
      />

      {/* Full Sentence Grammar Panel Modal */}
      <GrammarPanel
        entry={selectedGrammarEntry}
        isOpen={isGrammarPanelOpen}
        onClose={() => setIsGrammarPanelOpen(false)}
      />

      {/* Rule Card Dialog */}
      <RuleCardDialog
        ruleKey={selectedRuleKey}
        isOpen={isRuleCardOpen}
        onClose={() => {
          setIsRuleCardOpen(false);
          setSelectedRuleKey(null);
        }}
      />

      {/* Non-Blocking Auth Prompt Modal (A-01) */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title={`${authModalPurpose} সুরক্ষিত রাখতে সাইন-ইন করুন`}
        description="আপনার অনুশীলন ডিভাইস পরিবর্তনের পরও বজায় রাখতে লগইন করুন। আপনি কোনো পৃষ্ঠা না হারিয়ে তাৎক্ষণিকভাবে চালিয়ে যেতে পারেন।"
      />

      {/* Conversation Quiz Popup */}
      <ConversationQuizDialog
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        scenario={
          SEED_SCENARIOS.find((s) => s.slug === scenarioSlug) ?? {
            id: scenarioSlug || "custom",
            slug: scenarioSlug || "conversation",
            title: scenarioTitleEn,
            titleBn: scenarioTitleBn,
            description: scenarioDescription || scenarioTitleEn,
            descriptionBn: scenarioTitleBn,
            context: scenarioDescription || scenarioTitleEn,
            learningObjective: scenarioTitleEn,
            categories: [],
            level: effectiveLevel,
            lengthType: "short",
            communicationStyle: selectedStyle,
            estimatedMinutes: 5,
            exchangesCount: currentVersion.lines.length,
            keywords: [],
            languages: ["en", "bn"],
          }
        }
        lines={currentVersion.lines}
        level={effectiveLevel}
        lengthTierId={selectedTierId}
        lengthTierLabel={
          levelTiers.find((t) => t.id === selectedTierId)?.labelEn ||
          currentVersion.versionName
        }
        style={selectedStyle}
      />
    </div>
  );
}
