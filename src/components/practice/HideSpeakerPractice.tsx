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
      <div className="card-practice-result space-y-4">
        <div className="badge-success-icon">
          <HugeiconsIcon icon={SparklesIcon} size={28} />
        </div>

        <div>
          <h3 className="text-card-title-bn">
            রোলপ্লে অনুশীলন সম্পন্ন হয়েছে!
          </h3>
          <p className="text-meta text-muted-foreground mt-1 text-bangla">
            আপনি সফলভাবে পুরো কথোপকথনের নিজের সংলাপগুলো অনুশীলন করেছেন।
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-2.5">
          <Button onClick={handleRestart} variant="outline" className="text-bangla text-label rounded-control gap-1.5">
            <HugeiconsIcon icon={RefreshIcon} size={14} />
            <span>পুনরায় অনুশীলন করুন</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-practice space-y-5">
      {/* Role Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-primary" />
          <span className="text-label text-foreground text-bangla">
            আপনার চরিত্র বেছে নিন:
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-control border border-border">
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
              className={`px-3 py-1 rounded-control text-chip transition-all cursor-pointer ${
                learnerSpeakerId === spk.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {spk.name} ({spk.nameBn})
            </button>
          ))}
        </div>
      </div>

      {/* Turn Progress */}
      <div className="flex items-center justify-between text-chip text-muted-foreground">
        <span className="font-mono text-primary">
          বাক্য {currentLineIndex + 1} / {lines.length}
        </span>
        <Badge variant={isLearnerTurn ? "accent" : "neutral"} size="sm">
          {isLearnerTurn ? "আপনার পালা (Your Turn)" : "পার্টনারের পালা (Partner Speaking)"}
        </Badge>
      </div>

      {/* Turn Content Box */}
      {isLearnerTurn ? (
        /* Learner Turn: Hidden until revealed */
        <div className="p-6 rounded-panel bg-warning-bg border border-warning/30 text-center space-y-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-chip bg-warning-bg text-warning border border-warning/40">
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              <span>আপনার বলার পালা! Speak your line in English</span>
            </span>
            <p className="text-meta text-bangla text-foreground pt-2">
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
                className="text-bangla text-label rounded-control gap-1.5"
              >
                <HugeiconsIcon icon={PlayCircle02Icon} size={15} />
                <span>ইংরেজি উত্তর দেখুন ও শুনুন (Reveal & Listen)</span>
              </Button>
            </div>
          ) : (
            /* Revealed Answer & Audio */
            <div className="space-y-3 pt-2 animate-in fade-in">
              <div className="p-3.5 rounded-control bg-card border border-border shadow-2xs">
                <p className="text-card-title text-foreground font-sans italic">
                  &ldquo;{currentLine.englishText}&rdquo;
                </p>
              </div>

              <button
                type="button"
                onClick={() => playLineAudio(currentLine.englishText)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-control text-chip text-primary bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                <span className="text-bangla">উচ্চারণ আবার শুনুন</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Partner Turn: Visible with Audio */
        <div className="p-6 rounded-panel bg-muted/40 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-label text-foreground">
              {currentLine.speakerName} ({currentLine.speakerRole}):
            </span>
            <button
              type="button"
              onClick={() => playLineAudio(currentLine.englishText)}
              className="p-1.5 rounded-control text-primary hover:bg-card transition-colors cursor-pointer"
              title="শুনুন"
            >
              <HugeiconsIcon icon={VolumeHighIcon} size={16} />
            </button>
          </div>

          <p className="text-lead text-foreground font-sans leading-relaxed">
            &ldquo;{currentLine.englishText}&rdquo;
          </p>

          <p className="text-meta text-bangla text-muted-foreground pt-2 border-t border-border/60">
            {currentLine.translationBn}
          </p>
        </div>
      )}

      {/* Next Turn Button */}
      <div className="pt-2 flex justify-end">
        <Button onClick={handleNextTurn} className="btn-nav-action">
          <span>{currentLineIndex < lines.length - 1 ? "পরবর্তী সংলাপ (Next)" : "অনুশীলন সমাপ্ত"}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Button>
      </div>
    </div>
  );
}
