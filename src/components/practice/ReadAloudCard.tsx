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
} from "@hugeicons/core-free-icons";
import type { ReadAloudExercise } from "@/content/seed/exercises";
import {
  compareSpokenSentence,
  SpokenComparisonResult,
  SELF_CHECK_RATINGS,
  SelfCheckRating,
} from "@/lib/practice/read-aloud";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [isPlayingModel, setIsPlayingModel] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [comparisonResult, setComparisonResult] = useState<SpokenComparisonResult | null>(null);
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

  // Model audio playback via Web Speech API
  const handlePlayModel = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentItem.targetSentence);
    utterance.lang = "en-US";
    utterance.rate = 0.85;

    utterance.onstart = () => setIsPlayingModel(true);
    utterance.onend = () => setIsPlayingModel(false);
    utterance.onerror = () => setIsPlayingModel(false);

    window.speechSynthesis.speak(utterance);
  }, [currentItem.targetSentence]);

  // Start recording
  const handleStartRecording = useCallback(async () => {
    setMicError(null);
    setTranscript("");
    setComparisonResult(null);
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

      // Optional browser speech recognition for transcript
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
            উচ্চারণ ও রিড-আলাউড অনুশীলন (Read Aloud)
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
      <div className="p-6 rounded-card bg-card border border-border shadow-2xs space-y-3">
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
          {/* Model Audio Playback Button */}
          <Button
            variant="outline"
            onClick={handlePlayModel}
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

          {/* Record / Stop Button */}
          {!isRecording ? (
            <Button
              onClick={handleStartRecording}
              className="gap-2 rounded-control cursor-pointer bg-primary text-primary-foreground"
            >
              <HugeiconsIcon icon={Mic01Icon} size={18} />
              <span className="text-bangla">রেকর্ড শুরু করুন (Record)</span>
            </Button>
          ) : (
            <Button
              onClick={handleStopRecording}
              className="gap-2 rounded-control cursor-pointer bg-destructive text-destructive-foreground animate-pulse"
            >
              <HugeiconsIcon icon={StopIcon} size={18} />
              <span className="text-bangla">রেকর্ড থামান ({formatTime(recordingDuration)})</span>
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

        {/* Recorded Audio Playback & Comparison View */}
        {recordedAudioUrl && !isRecording && (
          <div className="p-4 rounded-panel bg-card border border-border space-y-4">
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

            {/* Speech Recognition Comparison (when available) */}
            {transcript && comparisonResult && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-chip text-muted-foreground">
                    শনাক্ত হওয়া শব্দসমূহ:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {comparisonResult.tokens.map((tok, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          "px-2 py-0.5 rounded-pill text-chip font-mono",
                          tok.isMatched
                            ? "bg-success-bg text-success border border-success/40"
                            : "bg-muted text-muted-foreground border border-border"
                        )}
                      >
                        {tok.word}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-meta-bn">
                  💬 {comparisonResult.feedbackBn}
                </p>
              </div>
            )}

            {/* Honest Self-Check Rating Buttons */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <h4 className="text-label text-foreground text-bangla">
                নিজের স্বর মূল্যায়ন করুন (Self Check):
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
