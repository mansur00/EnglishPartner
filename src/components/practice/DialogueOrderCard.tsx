"use client";

import React, { useState, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  Cancel01Icon,
  SparklesIcon,
  RotateLeft01Icon,
  UndoIcon,
  VolumeHighIcon,
  HelpCircleIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import type { DialogueOrderExercise, DialogueOrderTurn } from "@/content/seed/exercises";
import {
  validateDialogueOrder,
  moveDialogueTurn,
  getDialogueOrderHint,
  DialogueOrderHint,
} from "@/lib/practice/dialogue-order";
import { Button } from "@/components/ui/button";
import { LocaleTitle } from "@/components/shared";
import { cn } from "@/lib/utils";

interface DialogueOrderCardProps {
  exercise: DialogueOrderExercise;
  onComplete?: () => void;
}

export function DialogueOrderCard({
  exercise,
  onComplete,
}: DialogueOrderCardProps) {
  const [turns, setTurns] = useState<DialogueOrderTurn[]>(() => [
    ...exercise.shuffledTurns,
  ]);
  const [history, setHistory] = useState<DialogueOrderTurn[][]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [misplacedTurnIds, setMisplacedTurnIds] = useState<string[]>([]);
  const [hint, setHint] = useState<DialogueOrderHint | null>(null);
  const [selectedTurnId, setSelectedTurnId] = useState<string | null>(null);

  // Audio pronunciation helper
  const handlePlayAudio = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Move turn up
  const handleMoveUp = useCallback(
    (index: number) => {
      if (index <= 0) return;
      setHistory((prev) => [...prev, turns]);
      setTurns((prev) => moveDialogueTurn(prev, index, index - 1));
      if (hasChecked) {
        setHasChecked(false);
        setIsCorrect(false);
        setMisplacedTurnIds([]);
      }
    },
    [turns, hasChecked]
  );

  // Move turn down
  const handleMoveDown = useCallback(
    (index: number) => {
      if (index >= turns.length - 1) return;
      setHistory((prev) => [...prev, turns]);
      setTurns((prev) => moveDialogueTurn(prev, index, index + 1));
      if (hasChecked) {
        setHasChecked(false);
        setIsCorrect(false);
        setMisplacedTurnIds([]);
      }
    },
    [turns, hasChecked]
  );

  // Tap-to-swap selection
  const handleSelectTurn = useCallback(
    (turnId: string) => {
      if (!selectedTurnId) {
        setSelectedTurnId(turnId);
        return;
      }

      if (selectedTurnId === turnId) {
        setSelectedTurnId(null);
        return;
      }

      // Swap the two selected items
      const idxA = turns.findIndex((t) => t.id === selectedTurnId);
      const idxB = turns.findIndex((t) => t.id === turnId);

      if (idxA !== -1 && idxB !== -1) {
        setHistory((prev) => [...prev, turns]);
        const updated = [...turns];
        const temp = updated[idxA];
        updated[idxA] = updated[idxB];
        updated[idxB] = temp;
        setTurns(updated);

        if (hasChecked) {
          setHasChecked(false);
          setIsCorrect(false);
          setMisplacedTurnIds([]);
        }
      }
      setSelectedTurnId(null);
    },
    [selectedTurnId, turns, hasChecked]
  );

  // Undo last reorder
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setTurns(previous);
    setHasChecked(false);
    setIsCorrect(false);
    setMisplacedTurnIds([]);
  }, [history]);

  // Reset to initial shuffled state
  const handleReset = useCallback(() => {
    setTurns([...exercise.shuffledTurns]);
    setHistory([]);
    setHasChecked(false);
    setIsCorrect(false);
    setMisplacedTurnIds([]);
    setHint(null);
    setSelectedTurnId(null);
  }, [exercise.shuffledTurns]);

  // Request pedagogical hint
  const handleHint = useCallback(() => {
    const hintData = getDialogueOrderHint(turns);
    setHint(hintData);
  }, [turns]);

  // Validate the current order
  const handleCheckOrder = useCallback(() => {
    const result = validateDialogueOrder(turns);
    setHasChecked(true);
    setIsCorrect(result.isCorrect);
    setMisplacedTurnIds(result.misplacedTurnIds);

    if (result.isCorrect && onComplete) {
      onComplete();
    }
  }, [turns, onComplete]);

  return (
    <div className="card-practice space-y-6">
      {/* Header Row */}
      <div className="practice-header-row">
        <div>
          <span className="text-chip text-muted-foreground uppercase font-mono">
            {exercise.stepSlug} • Dialogue Sequencing
          </span>
          <LocaleTitle
            as="h3"
            titleEn={exercise.title}
            titleBn={exercise.titleBn}
            className="text-card-title text-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && !isCorrect && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              className="gap-1.5 rounded-control cursor-pointer"
              title="Undo last move"
            >
              <HugeiconsIcon icon={UndoIcon} size={14} />
              <span className="text-bangla">পূর্বাবস্থায়</span>
            </Button>
          )}

          {!isCorrect && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 rounded-control cursor-pointer"
              title="Reset order"
            >
              <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
              <span className="text-bangla">পুনরায় সাজান</span>
            </Button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-3 bg-muted/40 rounded-control border border-border/60 text-meta text-muted-foreground">
        <p className="text-bangla">
          💡 <strong>নির্দেশনা:</strong> ওপর-নিচ তীরচিহ্নে ক্লিক করে বা যেকোনো দুটি ডায়লগে ট্যাপ করে স্থান বিনিময় করে সঠিক ধারাবাহিকতা তৈরি করুন। এরপর <strong>&quot;Check order&quot;</strong> বাটনে চাপ দিন।
        </p>
      </div>

      {/* Turns Ordering List */}
      <div className="space-y-3">
        {turns.map((turn, idx) => {
          const isSelected = selectedTurnId === turn.id;
          const isMisplaced = hasChecked && misplacedTurnIds.includes(turn.id);
          const isTurnCorrect = hasChecked && isCorrect;

          return (
            <div
              key={turn.id}
              className={cn(
                "p-4 rounded-panel border transition-all duration-fast flex items-center justify-between gap-3",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : isMisplaced
                  ? "border-destructive/60 bg-destructive/5"
                  : isTurnCorrect
                  ? "border-success/60 bg-success-bg/20"
                  : "border-border bg-card hover:border-border/80"
              )}
            >
              {/* Left: Position & Speaker */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  onClick={() => handleSelectTurn(turn.id)}
                  className={cn(
                    "size-control rounded-control flex items-center justify-center shrink-0 text-meta font-mono cursor-pointer transition-colors",
                    isMisplaced
                      ? "bg-destructive/15 text-destructive"
                      : isTurnCorrect
                      ? "bg-success-bg text-success"
                      : "bg-muted text-muted-foreground"
                  )}
                  title="Click to select for swap"
                >
                  {(idx + 1).toString().padStart(2, "0")}
                </div>

                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleSelectTurn(turn.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-label text-foreground">
                      {turn.speakerName}
                    </span>
                    <span className="text-chip text-muted-foreground">
                      ({turn.speakerRole})
                    </span>
                  </div>

                  <p className="text-body text-foreground break-words">
                    &ldquo;{turn.englishText}&rdquo;
                  </p>
                  <p className="text-chip-bn text-muted-foreground mt-0.5">
                    {turn.translationBn}
                  </p>
                </div>
              </div>

              {/* Right: Audio & Move Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePlayAudio(turn.englishText)}
                  className="rounded-control cursor-pointer hover:bg-muted"
                  title="Listen to turn"
                >
                  <HugeiconsIcon icon={VolumeHighIcon} size={16} />
                </Button>

                {!isCorrect && (
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="size-7 rounded-control cursor-pointer disabled:opacity-30"
                      title="Move up"
                    >
                      <HugeiconsIcon icon={ArrowUp01Icon} size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={idx === turns.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="size-7 rounded-control cursor-pointer disabled:opacity-30"
                      title="Move down"
                    >
                      <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hint Alert if requested */}
      {hint && !isCorrect && (
        <div className="p-4 rounded-panel bg-topic-tile border border-topic-border flex items-start gap-3">
          <div className="size-control rounded-control bg-topic-accent/20 text-topic-ink flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={HelpCircleIcon} size={18} />
          </div>
          <div>
            <h4 className="text-label text-topic-ink text-bangla">
              সহায়ক সংকেত (Hint)
            </h4>
            <p className="text-meta text-muted-foreground mt-0.5 text-bangla">
              {hint.explanationBn}
            </p>
          </div>
        </div>
      )}

      {/* Validation Result Feedback Banner */}
      {hasChecked && (
        <div
          className={cn(
            "p-4 rounded-panel border flex items-start gap-3 transition-all",
            isCorrect
              ? "bg-success-bg/30 border-success/40"
              : "bg-destructive/10 border-destructive/30"
          )}
        >
          <div
            className={cn(
              "size-control rounded-control flex items-center justify-center shrink-0",
              isCorrect
                ? "bg-success text-success-foreground"
                : "bg-destructive text-destructive-foreground"
            )}
          >
            <HugeiconsIcon
              icon={isCorrect ? CheckmarkCircle01Icon : Cancel01Icon}
              size={18}
            />
          </div>

          <div className="flex-1">
            <h4
              className={cn(
                "text-label",
                isCorrect ? "text-success" : "text-destructive"
              )}
            >
              {isCorrect ? "অসাধারণ! সম্পূর্ণ সংলাপটি সঠিক ক্রমে সাজানো হয়েছে।" : "কিছু ডায়লগ সঠিক স্থানে নেই।"}
            </h4>

            <p className="text-meta text-muted-foreground mt-0.5 text-bangla">
              {isCorrect
                ? "কথোপকথনের স্বাভাবিক নিয়ম: অভিবাদন ও দাম জানার পর বিক্রেতা পণ্যের বিবরণ দেন এবং ক্রেতা সন্তুষ্ট হয়ে ধন্যবাদ জানান।"
                : "লাল বর্ডারযুক্ত ডায়লগগুলোর অবস্থান পুনরায় পরীক্ষা করুন। কে প্রথমে কথা শুরু করে এবং কার জবাবে কী বলা হয় তা খেয়াল করুন।"}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
        {!isCorrect && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleHint}
            className="gap-2 rounded-control cursor-pointer"
          >
            <HugeiconsIcon icon={HelpCircleIcon} size={16} />
            <span className="text-bangla">হিন্ট দেখুন</span>
          </Button>
        )}

        <div className="flex items-center gap-3 ml-auto">
          {!isCorrect ? (
            <Button
              onClick={handleCheckOrder}
              className="gap-2 rounded-control text-label cursor-pointer px-6"
            >
              <HugeiconsIcon icon={SparklesIcon} size={16} />
              <span>Check order</span>
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleReset}
              className="gap-2 rounded-control text-label cursor-pointer"
            >
              <HugeiconsIcon icon={RotateLeft01Icon} size={16} />
              <span className="text-bangla">আবার অনুশীলন করুন</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
