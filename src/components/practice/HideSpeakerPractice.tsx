"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  PlayCircle02Icon,
  SparklesIcon,
  UserGroupIcon,
  ArrowRight01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { LadderDialogueLine, LadderSpeaker } from "@/content/seed/niche_shopping_money";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HideSpeakerPracticeProps {
  lines: LadderDialogueLine[];
  speakers: LadderSpeaker[];
}

export function HideSpeakerPractice({ lines, speakers }: HideSpeakerPracticeProps) {
  // Default to second speaker (usually customer/learner)
  const [learnerSpeakerId, setLearnerSpeakerId] = useState<string>(
    speakers[1]?.id || speakers[0]?.id || ""
  );
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentLine = lines[currentLineIndex];
  const isLearnerTurn = currentLine?.speakerId === learnerSpeakerId;

  const playLineAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextTurn = () => {
    if (currentLineIndex < lines.length - 1) {
      const nextIdx = currentLineIndex + 1;
      setCurrentLineIndex(nextIdx);
      setIsRevealed(false);

      // If next is partner's turn, auto-speak it
      const nextLine = lines[nextIdx];
      if (nextLine && nextLine.speakerId !== learnerSpeakerId) {
        setTimeout(() => playLineAudio(nextLine.englishText), 300);
      }
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentLineIndex(0);
    setIsRevealed(false);
    setIsFinished(false);
  };

  if (!currentLine) return null;

  if (isFinished) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-ecp-border text-center space-y-4 shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <HugeiconsIcon icon={SparklesIcon} size={28} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-ecp-text-primary font-bangla">
            রোলপ্লে অনুশীলন সম্পন্ন হয়েছে!
          </h3>
          <p className="text-xs sm:text-sm text-ecp-text-secondary mt-1 font-bangla">
            আপনি সফলভাবে পুরো কথোপকথনের নিজের সংলাপগুলো অনুশীলন করেছেন।
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-2.5">
          <Button onClick={handleRestart} variant="outline" className="font-bangla text-xs gap-1.5">
            <HugeiconsIcon icon={RefreshIcon} size={14} />
            <span>পুনরায় অনুশীলন করুন</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-ecp-border space-y-5 shadow-2xs">
      {/* Role Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ecp-border">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-ecp-violet" />
          <span className="text-xs font-bold text-ecp-text-primary font-bangla">
            আপনার চরিত্র বেছে নিন:
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-ecp-bg-canvas p-1 rounded-xl border border-ecp-border">
          {speakers.map((spk) => (
            <button
              key={spk.id}
              type="button"
              onClick={() => {
                setLearnerSpeakerId(spk.id);
                setCurrentLineIndex(0);
                setIsRevealed(false);
                setIsFinished(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                learnerSpeakerId === spk.id
                  ? "bg-ecp-violet text-white shadow-xs"
                  : "text-ecp-text-secondary hover:text-ecp-text-primary"
              }`}
            >
              {spk.name} ({spk.nameBn})
            </button>
          ))}
        </div>
      </div>

      {/* Turn Progress */}
      <div className="flex items-center justify-between text-xs text-ecp-text-muted">
        <span className="font-mono font-bold text-ecp-violet">
          বাক্য {currentLineIndex + 1} / {lines.length}
        </span>
        <Badge variant={isLearnerTurn ? "accent" : "neutral"} size="sm">
          {isLearnerTurn ? "আপনার পালা (Your Turn)" : "পার্টনারের পালা (Partner Speaking)"}
        </Badge>
      </div>

      {/* Turn Content Box */}
      {isLearnerTurn ? (
        /* Learner Turn: Hidden until revealed */
        <div className="p-6 rounded-2xl bg-ecp-warm-surface/40 border border-ecp-warm/30 text-center space-y-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              <span>আপনার বলার পালা! Speak your line in English</span>
            </span>
            <p className="text-sm font-bangla text-ecp-text-primary pt-2 font-medium">
              বাংলা ভাবার্থ: &ldquo;{currentLine.translationBn}&rdquo;
            </p>
          </div>

          {/* Reveal Button */}
          {!isRevealed ? (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsRevealed(true);
                  playLineAudio(currentLine.englishText);
                }}
                className="font-bangla text-xs gap-1.5"
              >
                <HugeiconsIcon icon={PlayCircle02Icon} size={15} />
                <span>ইংরেজি উত্তর দেখুন ও শুনুন (Reveal & Listen)</span>
              </Button>
            </div>
          ) : (
            /* Revealed Answer & Audio */
            <div className="space-y-3 pt-2 animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-white border border-ecp-border shadow-2xs">
                <p className="text-lg font-bold text-ecp-text-primary font-sans italic">
                  &ldquo;{currentLine.englishText}&rdquo;
                </p>
              </div>

              <button
                type="button"
                onClick={() => playLineAudio(currentLine.englishText)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-ecp-violet bg-ecp-violet-surface hover:bg-ecp-violet-surface/80 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                <span>উচ্চারণ আবার শুনুন</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Partner Turn: Visible with Audio */
        <div className="p-6 rounded-2xl bg-ecp-bg-canvas border border-ecp-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ecp-text-primary">
              {currentLine.speakerName} ({currentLine.speakerRole}):
            </span>
            <button
              type="button"
              onClick={() => playLineAudio(currentLine.englishText)}
              className="p-1.5 rounded-lg text-ecp-violet hover:bg-white transition-colors cursor-pointer"
              title="শুনুন"
            >
              <HugeiconsIcon icon={VolumeHighIcon} size={16} />
            </button>
          </div>

          <p className="text-base sm:text-lg font-medium text-ecp-text-primary font-sans leading-relaxed">
            &ldquo;{currentLine.englishText}&rdquo;
          </p>

          <p className="text-xs sm:text-sm font-bangla text-ecp-text-secondary pt-2 border-t border-ecp-border/60">
            {currentLine.translationBn}
          </p>
        </div>
      )}

      {/* Next Turn Button */}
      <div className="pt-2 flex justify-end">
        <Button onClick={handleNextTurn} className="gap-1.5 font-bangla text-xs">
          <span>{currentLineIndex < lines.length - 1 ? "পরবর্তী সংলাপ (Next)" : "অনুশীলন সমাপ্ত"}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Button>
      </div>
    </div>
  );
}
