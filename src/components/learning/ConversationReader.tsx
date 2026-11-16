"use client";

import { useState, useEffect } from "react";
import { ConversationTurn } from "./ConversationTurn";
import { AudioPlayer } from "./AudioPlayer";
import { WordDetailPopover } from "./WordDetailPopover";
import { GrammarPanel } from "./GrammarPanel";
import { ReviewSummary } from "./ReviewSummary";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffIcon,
  Layers01Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons";
import type { ConversationVersionData } from "@/content/seed/dialogues";
import {
  SEED_VOCABULARY,
  SEED_GRAMMAR_EXPLANATIONS,
  VocabularyEntry,
  SentenceGrammarEntry,
} from "@/content/seed/vocabulary";

interface ConversationReaderProps {
  versions: ConversationVersionData[];
  scenarioTitleEn?: string;
  scenarioTitleBn?: string;
  scenarioSlug?: string;
}

export function ConversationReader({
  versions,
  scenarioTitleEn = "English Conversation Practice",
  scenarioTitleBn = "ইংরেজি কথোপকথন অনুশীলন",
  scenarioSlug,
}: ConversationReaderProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string>(
    versions[0]?.versionId || ""
  );
  const [isGlobalTranslationVisible, setIsGlobalTranslationVisible] = useState(true);
  const [accent, setAccent] = useState<"en-US" | "en-GB">("en-US");
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);

  // Milestone 1D states: Active Word Popover, Grammar Panel, Auth Prompt Modal
  const [selectedWordEntry, setSelectedWordEntry] = useState<VocabularyEntry | null>(null);
  const [isWordPopoverOpen, setIsWordPopoverOpen] = useState(false);

  const [selectedGrammarEntry, setSelectedGrammarEntry] = useState<SentenceGrammarEntry | null>(null);
  const [isGrammarPanelOpen, setIsGrammarPanelOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPurpose, setAuthModalPurpose] = useState<string>("");

  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const [isScenarioBookmarked, setIsScenarioBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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

  if (!currentVersion) {
    return (
      <div className="p-8 text-center text-sm text-[var(--ecp-text-muted)]">
        Dialogue content is being prepared.
      </div>
    );
  }

  const speakerMap = new Map(currentVersion.speakers.map((s) => [s.id, s]));

  // Word Lookup Function
  const handleWordClick = (word: string) => {
    const clean = word.toLowerCase().trim();
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
      foundEntry = {
        word: word.charAt(0).toUpperCase() + word.slice(1),
        lemma: clean,
        ipa: `/${clean}/`,
        partOfSpeech: "noun",
        contextualMeaningBn: `"${word}" শব্দটির অর্থ ও ব্যাকরণগত ব্যাখ্যা`,
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
        setAuthModalPurpose("শব্দভান্ডার সংরক্ষণ (Save Vocabulary)");
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
        setAuthModalPurpose("দৃশ্যপট বুকমার্ক (Bookmark Scenario)");
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
      // Find line text for dynamic fallback grammar breakdown
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

  // Gather vocabulary items used in this conversation
  const scenarioVocabList: VocabularyEntry[] = [];
  currentVersion.lines.forEach((line) => {
    if (line.wordHighlights) {
      line.wordHighlights.forEach((w) => {
        const key = w.toLowerCase();
        const found =
          SEED_VOCABULARY[key] ||
          Object.values(SEED_VOCABULARY).find((v) => v.lemma.toLowerCase() === key);
        if (found && !scenarioVocabList.some((item) => item.lemma === found.lemma)) {
          scenarioVocabList.push(found);
        }
      });
    }
  });

  return (
    <div className="space-y-6 relative pb-16">
      {/* Control Header: Version Switch & Global Translation Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[var(--ecp-surface)] border border-[var(--ecp-border)] rounded-2xl shadow-2xs">
        {/* Version Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--ecp-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <HugeiconsIcon icon={Layers01Icon} size={14} />
            সংস্করণ (Version):
          </span>
          <div className="flex items-center gap-1.5 bg-[var(--ecp-surface-muted)] p-1 rounded-xl border border-[var(--ecp-border)]">
            {versions.map((ver) => (
              <button
                key={ver.versionId}
                type="button"
                onClick={() => {
                  setSelectedVersionId(ver.versionId);
                  setActiveLineIndex(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedVersionId === ver.versionId
                    ? "bg-[var(--ecp-brand-800)] text-white shadow-xs"
                    : "text-[var(--ecp-text-secondary)] hover:text-[var(--ecp-text-primary)]"
                }`}
              >
                {ver.versionName} ({ver.lines.length} turns)
              </button>
            ))}
          </div>
        </div>

        {/* Global Translation Toggle & Completion Action */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGlobalTranslationVisible(!isGlobalTranslationVisible)}
            className="text-xs gap-1.5"
          >
            <HugeiconsIcon icon={isGlobalTranslationVisible ? ViewOffIcon : ViewIcon} size={15} />
            <span>
              {isGlobalTranslationVisible
                ? "অনুবাদ লুকান (Hide)"
                : "সব অনুবাদ (Show All)"}
            </span>
          </Button>

          <Button
            variant={isCompleted ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsCompleted(!isCompleted)}
            className="text-xs gap-1.5 font-bangla"
          >
            <HugeiconsIcon icon={CheckmarkBadge01Icon} size={15} />
            <span>{isCompleted ? "সম্পন্ন ✓" : "পাঠ সমাপ্ত করুন"}</span>
          </Button>
        </div>
      </div>

      {/* Ordered Dialogue Turns */}
      <div className="space-y-4">
        {currentVersion.lines.map((line, index) => {
          const speaker = speakerMap.get(line.speakerId) || {
            id: line.speakerId,
            name: "Speaker",
            nameBn: "বক্তা",
            role: "Participant",
            roleBn: "অংশগ্রহণকারী",
            avatarChar: "S",
            colorScheme: "brand" as const,
          };

          const hasGrammar = Boolean(SEED_GRAMMAR_EXPLANATIONS[line.id]);

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
              hasGrammarExplanation={hasGrammar}
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
      />

      {/* Word Detail Popover */}
      <WordDetailPopover
        entry={selectedWordEntry}
        isOpen={isWordPopoverOpen}
        onClose={() => setIsWordPopoverOpen(false)}
        onSaveToggle={handleSaveWordToggle}
        isSaved={selectedWordEntry ? savedWords.has(selectedWordEntry.lemma) : false}
      />

      {/* Sentence Grammar Panel */}
      <GrammarPanel
        entry={selectedGrammarEntry}
        isOpen={isGrammarPanelOpen}
        onClose={() => setIsGrammarPanelOpen(false)}
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
