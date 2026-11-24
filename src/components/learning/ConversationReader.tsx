"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ConversationTurn } from "./ConversationTurn";
import { AudioPlayer } from "./AudioPlayer";
import { WordDetailPopover } from "./WordDetailPopover";
import { GrammarPanel } from "./GrammarPanel";
import { ReviewSummary } from "./ReviewSummary";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { LoadingBox } from "@/components/shared/LoadingBox";
import { Button } from "@/components/ui/button";
import { GrammarProvider } from "@/lib/grammar/context";
import { GrammarModeSwitch } from "@/components/grammar/GrammarModeSwitch";
import { GrammarLayerPicker } from "@/components/grammar/GrammarLayerPicker";
import { GrammarLegend } from "@/components/grammar/GrammarLegend";
import { RuleCardDialog } from "@/components/grammar/RuleCard";
import { loadConversationAnnotation } from "@/lib/grammar/loader";
import type { ConversationAnnotation, RenderToken } from "@/lib/grammar/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffIcon,
  Layers01Icon,
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

interface ConversationReaderProps {
  versions: ConversationVersionData[];
  scenarioTitleEn?: string;
  scenarioTitleBn?: string;
  scenarioSlug?: string;
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
  prevStepSlug,
  nextStepSlug,
  nextStepTitle,
}: ConversationReaderProps) {
  const { locale, translationLocale } = useTranslations();
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    versions[0]?.versionId || ""
  );
  const [isGlobalTranslationVisible, setIsGlobalTranslationVisible] = useState(true);
  const [accent, setAccent] = useState<"en-US" | "en-GB">("en-US");
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);

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

  const currentVersion =
    versions.find((v) => v.versionId === selectedVersionId) || versions[0];

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
    <div className="space-y-6">
      {/* Top Controls Bar: Versions, Global Grammar Switches, Translation Toggle & Step Navigation */}
      <div className="flex flex-col gap-3 p-3 sm:p-4 bg-card rounded-panel border-0 shadow-xs">
        {/* Dialogue Version Selector (if multiple versions exist) */}
        {versions.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-chip">
            <span className={cn("text-muted-foreground whitespace-nowrap flex items-center gap-1", locale === "bn" && "text-bangla")}>
              <HugeiconsIcon icon={Layers01Icon} size={14} />
              <span>{locale === "bn" ? "সংস্করণ:" : "Version:"}</span>
            </span>
            <div className="flex items-center gap-1.5">
              {versions.map((ver) => (
                <button
                  key={ver.versionId}
                  type="button"
                  onClick={() => {
                    setSelectedVersionId(ver.versionId);
                    setActiveLineIndex(null);
                  }}
                  className={`px-3 py-1 rounded-control text-chip transition-all cursor-pointer ${selectedVersionId === ver.versionId
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                >
                  {ver.versionName} ({ver.lines.length} {locale === "bn" ? "বাক্য" : "turns"})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Grammar Controls (Global Switch + Layer Picker) */}
          <div className="flex flex-wrap items-center gap-2">
            <GrammarModeSwitch lang={locale === "bn" ? "bn" : "en"} />
            <GrammarLayerPicker lang={locale === "bn" ? "bn" : "en"} />
          </div>

          {/* Right: Navigation, Translation Toggle & Complete */}
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

            {translationLocale !== "none" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsGlobalTranslationVisible(!isGlobalTranslationVisible)}
                className="h-9 text-label rounded-control gap-1.5"
              >
                <HugeiconsIcon icon={isGlobalTranslationVisible ? ViewOffIcon : ViewIcon} size={15} />
                <span>
                  {isGlobalTranslationVisible
                    ? t("reader.hideTranslation", locale)
                    : t("reader.showTranslation", locale)}
                </span>
              </Button>
            )}

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

        {/* Contextual Grammar Legend */}
        <GrammarLegend presentCategories={presentCategories} lang={locale === "bn" ? "bn" : "en"} />
      </div>

      {/* Ordered Dialogue Turns */}
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

          const hasGrammar = Boolean(SEED_GRAMMAR_EXPLANATIONS[line.id]);

          // Match static line annotation if loaded
          const lineAnnotation = annotation?.lines.find(
            (l) => l.lineId === line.id || l.text.trim() === line.englishText.trim()
          );

          return (
            <ConversationTurn
              key={line.id}
              line={line}
              speaker={speaker}
              accent={accent}
              isGlobalTranslationVisible={isGlobalTranslationVisible}
              isCurrentlyPlaying={activeLineIndex === index}
              onLinePlayStart={() => setActiveLineIndex(index)}
              onLinePlayEnd={() => setActiveLineIndex(null)}
              onWordClick={handleWordClick}
              onGrammarClick={handleGrammarClick}
              onRuleClick={handleRuleClick}
              hasGrammarExplanation={hasGrammar}
              annotation={lineAnnotation}
            />
          );
        })}
      </div>

      {/* Review Summary (shown when marked complete or always available at bottom) */}
      <ReviewSummary
        scenarioTitleEn={scenarioTitleEn}
        scenarioTitleBn={scenarioTitleBn}
        vocabularyList={scenarioVocabList}
        onRestart={() => {
          setActiveLineIndex(0);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onBookmarkScenario={handleBookmarkScenario}
        isScenarioBookmarked={isScenarioBookmarked}
        savedWords={savedWords}
        onSaveWordToggle={handleSaveWordToggle}
        nextScenarioSlug={nextStepSlug}
        nextScenarioTitle={nextStepTitle}
      />

      {/* Word Detail Popover (with enhanced Grammar Breakdown) */}
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

      {/* Sentence Grammar Panel */}
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

      {/* Sticky Full Audio Player */}
      <AudioPlayer
        lines={currentVersion.lines}
        accent={accent}
        onAccentChange={setAccent}
        activeLineIndex={activeLineIndex}
        onActiveLineChange={setActiveLineIndex}
      />
    </div>
  );
}
