"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  Mic01Icon,
  StopIcon,
  PlayIcon,
  Delete01Icon,
  RotateLeft01Icon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import type { ReadAloudExercise } from "@/content/seed/exercises";
import {
  compareSpokenSentence,
  SpokenComparisonResult,
  SELF_CHECK_RATINGS,
  SelfCheckRating,
} from "@/lib/practice/read-aloud";
import {
  evaluatePronunciationQuality,
  PronunciationAssessment,
  PronunciationWordToken,
} from "@/lib/practice/pronunciation";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";

interface ReadAloudCardProps {
  exercises: ReadAloudExercise[];
  onComplete?: () => void;
}

interface BrowserSpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => BrowserSpeechRecognition;
  webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
}

export function ReadAloudCard({ exercises, onComplete }: ReadAloudCardProps) {
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [isPlayingSlowModel, setIsPlayingSlowModel] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [, setComparisonResult] = useState<SpokenComparisonResult | null>(null);
  const [pronunciationAssessment, setPronunciationAssessment] =
    useState<PronunciationAssessment | null>(null);
  const [activeWordToken, setActiveWordToken] = useState<PronunciationWordToken | null>(null);
  const [selectedRating, setSelectedRating] = useState<SelfCheckRating | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  const currentItem = exercises[currentIndex] || exercises[0];

  // Cleanup recorded audio blob URLs and timer on unmount
  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [recordedAudioUrl]);

  // Model audio playback via Web Speech API with configurable rate
  const handlePlayModel = useCallback(
    (rate = 0.85) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentItem.targetSentence);
      utterance.lang = "en-US";
      utterance.rate = rate;

      if (rate < 0.8) {
        utterance.onstart = () => setIsPlayingSlowModel(true);
        utterance.onend = () => setIsPlayingSlowModel(false);
        utterance.onerror = () => setIsPlayingSlowModel(false);
      } else {
        utterance.onstart = () => setIsPlayingModel(true);
        utterance.onend = () => setIsPlayingModel(false);
        utterance.onerror = () => setIsPlayingModel(false);
      }

      window.speechSynthesis.speak(utterance);
    },
    [currentItem.targetSentence]
  );

  // Isolated slow word playback
  const handlePlayWord = useCallback((word: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.7;

    setPlayingWord(word);
    utterance.onend = () => setPlayingWord(null);
    utterance.onerror = () => setPlayingWord(null);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Start recording
  const handleStartRecording = useCallback(async () => {
    setMicError(null);
    setTranscript("");
    setComparisonResult(null);
    setPronunciationAssessment(null);
    setActiveWordToken(null);
    setSelectedRating(null);

    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);

        // Stop all tracks to release microphone hardware indicator
        stream.getTracks().forEach((track) => track.stop());
      };

      // Optional browser speech recognition for transcript and word alignment
      if (typeof window !== "undefined") {
        const speechWindow = window as unknown as WindowWithSpeech;
        const SpeechRecognitionClass =
          speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

        if (SpeechRecognitionClass) {
          try {
            const recognition = new SpeechRecognitionClass();
            recognition.lang = "en-US";
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
              const text = event.results[0]?.[0]?.transcript || "";
              setTranscript(text);
              const comparison = compareSpokenSentence(text, currentItem.targetSentence);
              setComparisonResult(comparison);

              const assessed = evaluatePronunciationQuality(
                currentItem.targetSentence,
                text
              );
              setPronunciationAssessment(assessed);

              // Auto-select first tricky token if present
              const firstTricky = assessed.tokens.find((t) => t.status !== "clear");
              if (firstTricky) {
                setActiveWordToken(firstTricky);
              }
            };

            recognition.onerror = () => {
              // Graceful fallback: learner still has self-check and side-by-side playback
            };

            recognitionRef.current = recognition;
            recognition.start();
          } catch {
            // SpeechRecognition not supported or blocked
          }
        }
      }

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      setMicError(
        "মাইক্রোফোন অ্যাক্সেস পাওয়া যায়নি। অনুগ্রহ করে ব্রাউজারের পারমিশন সেটিংসে গিয়ে মাইক্রোফোন অন করুন।"
      );
    }
  }, [currentItem.targetSentence, recordedAudioUrl]);

  // Stop recording
  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition already ended
      }
    }
  }, [isRecording]);

  // Play learner's recorded audio
  const handlePlayRecorded = useCallback(() => {
    if (!recordedAudioUrl) return;

    if (!recordedAudioElementRef.current) {
      recordedAudioElementRef.current = new Audio(recordedAudioUrl);
    } else {
      recordedAudioElementRef.current.src = recordedAudioUrl;
    }

    const audio = recordedAudioElementRef.current;
    setIsPlayingRecorded(true);

    audio.onended = () => setIsPlayingRecorded(false);
    audio.onerror = () => setIsPlayingRecorded(false);

    audio.play().catch(() => setIsPlayingRecorded(false));
  }, [recordedAudioUrl]);

  // Delete recorded audio
  const handleDeleteRecorded = useCallback(() => {
    if (recordedAudioElementRef.current) {
      recordedAudioElementRef.current.pause();
    }
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }
    setTranscript("");
    setComparisonResult(null);
    setPronunciationAssessment(null);
    setActiveWordToken(null);
    setSelectedRating(null);
    setIsPlayingRecorded(false);
    setRecordingDuration(0);
  }, [recordedAudioUrl]);

  // Next question
  const handleNext = useCallback(() => {
    handleDeleteRecorded();
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, exercises.length, handleDeleteRecorded, onComplete]);

  // Format timer seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="card-practice space-y-6">
      {/* Header Row */}
      <div className="practice-header-row">
        <div>
          <span className="text-chip text-muted-foreground uppercase font-mono">
            {currentItem.stepSlug} • Pronunciation & Read Aloud
          </span>
          <h3 className="text-card-title text-foreground">
            {locale === "bn" ? "উচ্চারণ ও পাঠ অনুশীলন" : "Pronunciation & Read Aloud"}
          </h3>
          <p className="text-chip-bn text-muted-foreground">
            মডেল অডিও শুনুন, নিজের কণ্ঠে উচ্চারণ রেকর্ড করুন এবং মিলিয়ে দেখুন
          </p>
        </div>

        <div className="text-meta font-mono text-muted-foreground">
          {currentIndex + 1} / {exercises.length}
        </div>
      </div>

      {/* Target Sentence Display Box */}
      <div className="p-6 rounded-card bg-card shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-chip px-2.5 py-0.5 rounded-pill bg-primary/10 text-primary font-mono">
            {currentItem.speakerName} ({currentItem.speakerRole})
          </span>
          {currentItem.phoneticHint && (
            <span className="text-chip-mono">
              /{currentItem.phoneticHint}/
            </span>
          )}
        </div>

        <h2 className="text-card-title text-foreground">
          &ldquo;{currentItem.targetSentence}&rdquo;
        </h2>

        <p className="text-subtitle-bn text-muted-foreground">
          {currentItem.translationBn}
        </p>

        {currentItem.explanationBn && (
          <p className="text-meta-bn pt-1 border-t border-border/50">
            💡 <strong>উচ্চারণ নির্দেশিকা:</strong> {currentItem.explanationBn}
          </p>
        )}
      </div>

      {/* Mic Access Error Notice */}
      {micError && (
        <div className="p-4 rounded-panel bg-destructive/10 border border-destructive/30 text-meta text-destructive">
          <p className="text-bangla">{micError}</p>
        </div>
      )}

      {/* Audio Interaction Area */}
      <div className="p-5 rounded-panel bg-muted/40 border border-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Model Audio Playback Options */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePlayModel(0.85)}
              disabled={isRecording}
              className={cn(
                "gap-2 rounded-control cursor-pointer",
                isPlayingModel && "border-primary text-primary"
              )}
            >
              <HugeiconsIcon icon={VolumeHighIcon} size={18} />
              <span className="text-bangla">
                {isPlayingModel ? "মডেল অডিও বাজছে..." : "মডেল অডিও শুনুন"}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePlayModel(0.7)}
              disabled={isRecording}
              className={cn(
                "gap-1.5 rounded-control cursor-pointer text-muted-foreground",
                isPlayingSlowModel && "border-primary text-primary"
              )}
              title="ধীর গতিতে শুনুন (0.7x)"
            >
              <span className="text-bangla">ধীরে (0.7x)</span>
            </Button>
          </div>

          {/* Record / Stop Button */}
          {!isRecording ? (
            <Button
              onClick={handleStartRecording}
              className="gap-2 rounded-control cursor-pointer bg-primary text-primary-foreground"
            >
              <HugeiconsIcon icon={Mic01Icon} size={18} />
              <span className="text-bangla">
                {locale === "bn" ? "রেকর্ড শুরু করুন" : "Start Recording"}
              </span>
            </Button>
          ) : (
            <Button
              onClick={handleStopRecording}
              className="gap-2 rounded-control cursor-pointer bg-destructive text-destructive-foreground animate-pulse"
            >
              <HugeiconsIcon icon={StopIcon} size={18} />
              <span className="text-bangla">
                {locale === "bn" ? "রেকর্ড থামান" : "Stop Recording"} ({formatTime(recordingDuration)})
              </span>
            </Button>
          )}
        </div>

        {/* Live Recording Pulsing Bar */}
        {isRecording && (
          <div className="flex items-center gap-3 p-3 rounded-control bg-destructive/10 border border-destructive/20 text-destructive text-meta">
            <span className="size-2 rounded-pill bg-destructive animate-ping" />
            <span className="text-bangla">
              স্পষ্ট স্বরে বাক্যটি বলুন... সময়: {formatTime(recordingDuration)}
            </span>
          </div>
        )}

        {/* Recorded Audio Playback & Pronunciation Assessment View */}
        {recordedAudioUrl && !isRecording && (
          <div className="p-4 rounded-panel bg-card shadow-2xs space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayRecorded}
                  className="gap-2 rounded-control cursor-pointer"
                >
                  <HugeiconsIcon icon={PlayIcon} size={14} />
                  <span className="text-bangla">
                    {isPlayingRecorded ? "বাজছে..." : "নিজের কণ্ঠ শুনুন"}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteRecorded}
                  className="gap-1.5 rounded-control cursor-pointer text-muted-foreground hover:text-destructive"
                  title="Delete recording"
                >
                  <HugeiconsIcon icon={Delete01Icon} size={14} />
                  <span className="text-bangla">মুছে ফেলুন</span>
                </Button>
              </div>

              <span className="text-chip text-muted-foreground">
                রেকর্ডিং সময়: {formatTime(recordingDuration)}
              </span>
            </div>

            {/* Qualitative Pronunciation Analysis (Milestone 3C) */}
            {pronunciationAssessment && (
              <div className="space-y-4 pt-1">
                {/* Status Bar: Qualitative Tier (No fake percentage) */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-panel bg-muted/50 border border-border">
                  <div className="flex items-center gap-2">
                    <Pill
                      dot
                      variant={
                        pronunciationAssessment.tier === "clear"
                          ? "success"
                          : pronunciationAssessment.tier === "getting_there"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {pronunciationAssessment.tierLabelBn} ({pronunciationAssessment.tierLabelEn})
                    </Pill>
                    <span className="text-chip text-muted-foreground">
                      {pronunciationAssessment.clearWordsCount} / {pronunciationAssessment.totalWords} শব্দ স্পষ্ট
                    </span>
                  </div>

                  <p className="text-chip-bn text-muted-foreground">
                    {pronunciationAssessment.feedbackBn}
                  </p>
                </div>

                {/* Word-Level Pronunciation Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-label text-foreground text-bangla">
                      শব্দভিত্তিক উচ্চারণ বিশ্লেষণ:
                    </h4>
                    <span className="text-chip-bn text-muted-foreground">
                      শব্দে ক্লিক করে টিপস ও ধীর অডিও শুনুন
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {pronunciationAssessment.tokens.map((token, idx) => {
                      const isSelected = activeWordToken?.clean === token.clean;
                      return (
                        <Tag
                          key={`${token.clean}-${idx}`}
                          selected={isSelected}
                          variant={
                            token.status === "clear"
                              ? "outline"
                              : token.status === "unclear"
                              ? "warning"
                              : "secondary"
                          }
                          onClick={() => setActiveWordToken(token)}
                          className={cn(
                            "cursor-pointer font-mono text-chip",
                            token.status === "clear" &&
                              "border-success/40 text-status-success-ink bg-status-success-bg/60",
                            token.status === "missed" && "border-dashed"
                          )}
                        >
                          {token.original}
                        </Tag>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Word Detail & Bengali Phonetic Guide Card */}
                {activeWordToken && (
                  <div className="p-3.5 rounded-panel bg-muted/30 border border-border space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-label text-foreground">
                          &ldquo;{activeWordToken.clean}&rdquo;
                        </span>
                        {activeWordToken.phoneticGuide?.phoneticHint && (
                          <span className="text-chip-mono">
                            /{activeWordToken.phoneticGuide.phoneticHint}/
                          </span>
                        )}
                        {activeWordToken.phoneticGuide?.ipa && (
                          <span className="text-chip-mono text-muted-foreground">
                            {activeWordToken.phoneticGuide.ipa}
                          </span>
                        )}
                      </div>

                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handlePlayWord(activeWordToken.clean)}
                        className="gap-1.5 rounded-control cursor-pointer text-chip"
                      >
                        <HugeiconsIcon icon={VolumeHighIcon} size={12} />
                        <span className="text-bangla">
                          {playingWord === activeWordToken.clean ? "বাজছে..." : "আস্তে শুনুন (0.7x)"}
                        </span>
                      </Button>
                    </div>

                    <p className="text-chip-bn text-foreground">
                      💡 {activeWordToken.phoneticGuide?.bengaliTip ||
                        "শব্দটি মডেল অডিওর সাথে মিলিয়ে আরেকবার স্পষ্ট করে বলুন।"}
                    </p>
                  </div>
                )}

                {/* Actionable Feedback Tips Banner */}
                {pronunciationAssessment.actionableTipsBn.length > 0 && (
                  <div className="space-y-1.5 p-3 rounded-panel bg-card shadow-2xs">
                    <span className="text-chip font-mono text-muted-foreground uppercase">
                      Practice Tips • উন্নতির টিপস:
                    </span>
                    <ul className="space-y-1">
                      {pronunciationAssessment.actionableTipsBn.map((tip, idx) => (
                        <li key={idx} className="text-chip-bn text-muted-foreground">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Automated Audio Analysis Disclaimer (Brief §9.3 & §20) */}
                <div className="flex items-start gap-2 p-2.5 rounded-panel bg-muted/20 border border-border/50 text-muted-foreground">
                  <HugeiconsIcon icon={InformationCircleIcon} size={15} className="shrink-0 mt-0.5" />
                  <p className="text-chip-bn">
                    {pronunciationAssessment.disclaimerBn}
                  </p>
                </div>
              </div>
            )}

            {/* Fallback speech transcript if assessment not ready */}
            {transcript && !pronunciationAssessment && (
              <p className="text-meta text-muted-foreground">
                শনাক্ত হওয়া পাঠ্য: &ldquo;{transcript}&rdquo;
              </p>
            )}

            {/* Honest Self-Check Rating Buttons */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <h4 className="text-label text-foreground text-bangla">
                {locale === "bn" ? "নিজের উচ্চারণ মূল্যায়ন করুন:" : "Self Check Rating:"}
              </h4>
              <p className="text-chip-bn">
                মডেল অডিওর সাথে তুলনা করে আপনার উচ্চারণ কেমন মনে হয়েছে তা বেছে নিন:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {SELF_CHECK_RATINGS.map((item) => {
                  const isSelected = selectedRating === item.rating;
                  return (
                    <button
                      key={item.rating}
                      type="button"
                      onClick={() => setSelectedRating(item.rating)}
                      className={cn(
                        "p-3 rounded-control border text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border bg-card hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-label text-foreground text-bangla">
                          {item.labelBn}
                        </span>
                        {isSelected && (
                          <HugeiconsIcon
                            icon={CheckmarkCircle01Icon}
                            size={16}
                            className="text-primary"
                          />
                        )}
                      </div>
                      <p className="text-chip-bn">
                        {item.descriptionBn}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteRecorded}
          className="gap-2 rounded-control cursor-pointer text-muted-foreground"
        >
          <HugeiconsIcon icon={RotateLeft01Icon} size={16} />
          <span className="text-bangla">আবার রেকর্ড করুন</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={!recordedAudioUrl && !selectedRating}
          className="gap-2 rounded-control text-label cursor-pointer"
        >
          <span className="text-bangla">
            {currentIndex < exercises.length - 1 ? "পরবর্তী বাক্য" : "অনুশীলন সম্পন্ন"}
          </span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Button>
      </div>
    </div>
  );
}
