"use client";

import React, { useState } from "react";
import { speakText } from "@/lib/audio/speech-engine";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  SparklesIcon,
  UserGroupIcon,
  ArrowRight01Icon,
  RefreshIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { LadderDialogueLine, LadderSpeaker } from "@/content/seed/niche_shopping_money";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { ChatBubble } from "@/components/shared/ChatBubble";
import { EmojiTile } from "@/components/shared/EmojiTile";
import { resolveSpeakerPerspective, isLearnerLine } from "@/lib/practice/hide-speaker";
import { useLocale } from "@/lib/i18n";

interface HideSpeakerPracticeProps {
  lines: LadderDialogueLine[];
  speakers: LadderSpeaker[];
}

export function HideSpeakerPractice({ lines, speakers }: HideSpeakerPracticeProps) {
  const locale = useLocale();
  // Default to second speaker (typically the customer/learner)
  const [learnerSpeakerId, setLearnerSpeakerId] = useState<string>(
    speakers[1]?.id || speakers[0]?.id || ""
  );
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const { learnerSpeaker, partnerSpeaker } = resolveSpeakerPerspective(speakers, learnerSpeakerId);
  const currentLine = lines[currentLineIndex];
  const isLearnerTurn = currentLine ? isLearnerLine(currentLine, learnerSpeakerId) : false;

  const playLineAudio = (text: string) => {
    speakText(text);
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
          <Button
            onClick={handleRestart}
            variant="outline"
            className="btn-restart-action"
          >
            <HugeiconsIcon icon={RefreshIcon} size={14} />
            <span>পুনরায় অনুশীলন করুন</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-practice space-y-6">
      {/* Role Selection Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={UserGroupIcon} size={18} className="text-primary" />
          <span className="text-label text-foreground text-bangla">
            {locale === "bn" ? "আপনার চরিত্র বেছে নিন:" : "Choose Your Role:"}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {speakers.map((spk) => {
            const isSelected = learnerSpeakerId === spk.id;
            return (
              <Tag
                key={spk.id}
                selected={isSelected}
                variant={isSelected ? "brand" : "outline"}
                size="default"
                onClick={() => {
                  setLearnerSpeakerId(spk.id);
                  setCurrentLineIndex(0);
                  setIsRevealed(false);
                  setIsFinished(false);
                }}
                className="cursor-pointer text-chip"
              >
                {spk.name} ({spk.nameBn})
              </Tag>
            );
          })}
        </div>
      </div>

      {/* Progress & Turn Indicator */}
      <div className="flex items-center justify-between text-chip text-muted-foreground">
        <Pill variant="default" size="sm" className="font-mono">
          {locale === "bn" ? "সংলাপ" : "Turn"} {currentLineIndex + 1} / {lines.length}
        </Pill>
        <Pill variant={isLearnerTurn ? "warning" : "neutral"} size="sm" dot>
          {isLearnerTurn
            ? (locale === "bn" ? `আপনার পালা (${learnerSpeaker.name})` : `Your turn (${learnerSpeaker.name})`)
            : `${partnerSpeaker.name} (${partnerSpeaker.role})`}
        </Pill>
      </div>

      {/* Conversational Stream using ChatBubble & EmojiTile */}
      <div className="space-y-4 py-2">
        {!isLearnerTurn ? (
          /* Partner's Turn: Left-aligned Bubble */
          <div className="flex items-start gap-3 max-w-reading">
            <EmojiTile emoji={partnerSpeaker.avatarChar || "👤"} className="size-control" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-label text-foreground">
                  {currentLine.speakerName}
                </span>
                <span className="text-chip text-muted-foreground">
                  ({currentLine.speakerRole})
                </span>
              </div>

              <ChatBubble speaker="1" className="space-y-2">
                <p className="text-conversation text-foreground">
                  &ldquo;{currentLine.englishText}&rdquo;
                </p>
                <p className="text-meta text-bangla text-muted-foreground border-t border-border/60 pt-1.5">
                  {currentLine.translationBn}
                </p>
              </ChatBubble>

              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => playLineAudio(currentLine.englishText)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-chip text-primary bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                  <span className="text-bangla">অডিও শুনুন</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Learner's Turn: Right-aligned Bubble with Reveal/Playback */
          <div className="flex items-start justify-end gap-3 max-w-reading ml-auto">
            <div className="space-y-2 flex-1 min-w-0 text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-chip text-muted-foreground">
                  ({learnerSpeaker.role})
                </span>
                <span className="text-label text-foreground">
                  {learnerSpeaker.name} ({locale === "bn" ? "আপনি" : "You"})
                </span>
              </div>

              <ChatBubble speaker="2" className="text-left space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1.5">
                  <span className="text-chip text-primary text-bangla flex items-center gap-1">
                    <HugeiconsIcon icon={SparklesIcon} size={14} />
                    <span>{locale === "bn" ? "আপনার বলার পালা!" : "Your turn to speak!"}</span>
                  </span>
                  <span className="text-chip text-muted-foreground">
                    {locale === "bn" ? "ইংরেজি বাক্যটি নিজে বলার চেষ্টা করুন" : "Speak your line in English"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-chip text-muted-foreground block">
                    বাংলা ভাবার্থ:
                  </span>
                  <p className="text-meta text-bangla text-foreground">
                    &ldquo;{currentLine.translationBn}&rdquo;
                  </p>
                </div>

                {/* Target English Text (Hidden or Revealed) */}
                {!isRevealed ? (
                  <div className="pt-2 flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsRevealed(true);
                        playLineAudio(currentLine.englishText);
                      }}
                      className="text-bangla text-label rounded-control gap-1.5"
                    >
                      <HugeiconsIcon icon={ViewIcon} size={15} />
                      <span>ইংরেজি উত্তর দেখুন ও শুনুন (Reveal & Listen)</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-border/60 animate-in fade-in">
                    <div className="p-3 rounded-control bg-card shadow-2xs">
                      <p className="text-card-title text-foreground font-conversation italic">
                        &ldquo;{currentLine.englishText}&rdquo;
                      </p>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => playLineAudio(currentLine.englishText)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-chip text-primary bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                        <span className="text-bangla">উচ্চারণ শুনুন</span>
                      </button>
                    </div>
                  </div>
                )}
              </ChatBubble>
            </div>
            <EmojiTile emoji={learnerSpeaker.avatarChar || "🎯"} className="size-control" />
          </div>
        )}
      </div>

      {/* Next Turn Navigation Button */}
      <div className="pt-2 flex justify-end">
        <Button onClick={handleNextTurn} className="btn-nav-action">
          <span>
            {currentLineIndex < lines.length - 1
              ? (locale === "bn" ? "পরবর্তী সংলাপ" : "Next Turn")
              : (locale === "bn" ? "অনুশীলন সমাপ্ত" : "Finish Practice")}
          </span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Button>
      </div>
    </div>
  );
}
