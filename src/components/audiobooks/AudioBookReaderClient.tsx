"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  HeadphonesIcon,
  BookOpen01Icon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  VolumeHighIcon,
  Delete02Icon,
  SparklesIcon,
  AiLockIcon,
  ArrowReloadHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { CefrChip, type CefrLevel } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n";
import { useSessionAccess } from "@/components/auth/SessionIsolationProvider";
import { speakText, stopSpeech } from "@/lib/audio/speech-engine";
import {
  splitStorySentences,
  type AudioBookItem,
} from "@/lib/audiobooks/types";
import { cn } from "@/lib/utils";

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5] as const;

function formatSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface AudioBookReaderClientProps {
  bookId: string;
}

export function AudioBookReaderClient({ bookId }: AudioBookReaderClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const isBn = locale === "bn";
  const { isGuest, getGuestLimit } = useSessionAccess();

  const [item, setItem] = useState<AudioBookItem | null>(null);
  const [itemIndexInTab, setItemIndexInTab] = useState<number>(0);
  const [tabCount, setTabCount] = useState<number>(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showBnSummary, setShowBnSummary] = useState(false);

  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsSentenceIdx, setTtsSentenceIdx] = useState<number>(-1);
  const ttsActiveRef = useRef(false);
  const sentenceRefs = useRef<Record<number, HTMLSpanElement | null>>({});

  const stopAllPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setAudioCurrentTime(0);

    ttsActiveRef.current = false;
    stopSpeech();
    setTtsPlaying(false);
    setTtsSentenceIdx(-1);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/v1/audiobooks", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        const all: AudioBookItem[] = Array.isArray(data.items) ? data.items : [];
        const found = all.find((x) => x.id === bookId) ?? null;
        setItem(found);
        setIsAdmin(Boolean(data.isAdmin));
        if (found) {
          const sameTab = all.filter((x) => x.kind === found.kind);
          setTabCount(sameTab.length);
          setItemIndexInTab(Math.max(0, sameTab.findIndex((x) => x.id === found.id)));
        }
      })
      .catch(() => {
        // Ignore fetch errors
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      ttsActiveRef.current = false;
      stopSpeech();
    };
  }, [bookId]);

  const storySentences = useMemo(() => {
    if (!item?.storyText) return [];
    return splitStorySentences(item.storyText);
  }, [item]);

  const audioSentenceIdx = useMemo(() => {
    if (!isPlayingAudio && audioCurrentTime <= 0) return -1;
    if (!audioDuration || storySentences.length === 0) return -1;
    const progress = Math.min(1, Math.max(0, audioCurrentTime / audioDuration));
    const totalChars = storySentences.reduce((acc, s) => acc + s.length, 0);
    if (totalChars === 0) return 0;
    const targetChar = progress * totalChars;
    let running = 0;
    for (let i = 0; i < storySentences.length; i++) {
      running += storySentences[i].length;
      if (running >= targetChar) return i;
    }
    return storySentences.length - 1;
  }, [isPlayingAudio, audioCurrentTime, audioDuration, storySentences]);

  const activeSentenceIdx = ttsPlaying || ttsSentenceIdx >= 0 ? ttsSentenceIdx : audioSentenceIdx;

  useEffect(() => {
    if (activeSentenceIdx < 0) return;
    const el = sentenceRefs.current[activeSentenceIdx];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeSentenceIdx]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const speakSentenceAt = useCallback(
    (index: number, sentences: string[], rate: number) => {
      const speakIndex = (idx: number) => {
        if (!ttsActiveRef.current || idx >= sentences.length) {
          ttsActiveRef.current = false;
          setTtsPlaying(false);
          setTtsSentenceIdx(-1);
          return;
        }

        setTtsSentenceIdx(idx);
        speakText(sentences[idx], {
          rate,
          onEnd: () => {
            if (ttsActiveRef.current) {
              speakIndex(idx + 1);
            }
          },
          onError: () => {
            ttsActiveRef.current = false;
            setTtsPlaying(false);
          },
        });
      };

      speakIndex(index);
    },
    []
  );

  const handleToggleTts = (startIndex = 0) => {
    if (ttsPlaying && startIndex === 0) {
      ttsActiveRef.current = false;
      stopSpeech();
      setTtsPlaying(false);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    stopSpeech();
    ttsActiveRef.current = true;
    setTtsPlaying(true);
    speakSentenceAt(startIndex, storySentences, playbackRate);
  };

  const handleToggleAudioFile = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (ttsPlaying) {
      ttsActiveRef.current = false;
      stopSpeech();
      setTtsPlaying(false);
      setTtsSentenceIdx(-1);
    }
    if (audio.paused) {
      audio.playbackRate = playbackRate;
      void audio.play();
      setIsPlayingAudio(true);
    } else {
      audio.pause();
      setIsPlayingAudio(false);
    }
  };

  const handleSeekRelative = (deltaSeconds: number) => {
    const audio = audioRef.current;
    if (!audio || !audioDuration) return;
    const next = Math.min(audioDuration, Math.max(0, audio.currentTime + deltaSeconds));
    audio.currentTime = next;
    setAudioCurrentTime(next);
  };

  const handleJumpToSentence = (idx: number) => {
    if (item?.audioUrl && audioRef.current && audioDuration > 0 && storySentences.length > 0) {
      const totalChars = storySentences.reduce((acc, s) => acc + s.length, 0);
      let beforeChars = 0;
      for (let i = 0; i < idx; i++) {
        beforeChars += storySentences[i].length;
      }
      const targetTime = totalChars > 0 ? (beforeChars / totalChars) * audioDuration : 0;
      audioRef.current.currentTime = targetTime;
      setAudioCurrentTime(targetTime);
      if (audioRef.current.paused) {
        audioRef.current.playbackRate = playbackRate;
        void audioRef.current.play();
        setIsPlayingAudio(true);
      }
      return;
    }
    handleToggleTts(idx);
  };

  const handleDelete = async () => {
    if (!item) return;
    try {
      const res = await fetch(`/api/v1/audiobooks?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        stopAllPlayback();
        router.push("/audiobooks");
      }
    } catch {
      // Ignore delete errors
    }
  };

  const unlockedLimit = getGuestLimit(tabCount, 1);
  const isLocked = isGuest && itemIndexInTab >= unlockedLimit;

  if (loading) {
    return (
      <div className="container-app py-10">
        <Card className="p-8 text-center text-meta text-muted-foreground">
          {isBn ? "লোড হচ্ছে..." : "Loading Audio Book..."}
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container-app py-10">
        <Card className="p-8 text-center space-y-4">
          <h1 className="text-card-title text-foreground">
            {isBn ? "অডিও বুকটি পাওয়া যায়নি" : "Audio Book Not Found"}
          </h1>
          <Link href="/audiobooks">
            <Button variant="default" size="sm">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              <span>{isBn ? "অডিও বুকে ফিরুন" : "Back to Audio Books"}</span>
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const audioControlSidebarContent = (
    <div className="space-y-5">
      {item.audioUrl && (
        <audio
          ref={audioRef}
          src={item.audioUrl}
          onTimeUpdate={(e) => setAudioCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration || 0)}
          onEnded={() => setIsPlayingAudio(false)}
          className="hidden"
        />
      )}

      <div className="space-y-1">
        <p className="text-chip uppercase tracking-wider text-muted-foreground">
          {isBn ? "অডিও কন্ট্রোল" : "Audio Controls"}
        </p>
        <p className="text-label text-foreground line-clamp-2 break-words">
          {isBn && item.titleBn ? item.titleBn : item.title}
        </p>
      </div>

      {/* Primary Play Controls */}
      <div className="space-y-2.5">
        {item.audioUrl && (
          <div className="space-y-2">
            <Button
              type="button"
              variant="default"
              size="md"
              className="w-full"
              onClick={handleToggleAudioFile}
            >
              <HugeiconsIcon icon={isPlayingAudio ? PauseIcon : PlayIcon} size={17} />
              <span>
                {isPlayingAudio
                  ? isBn
                    ? "অডিও পজ করুন"
                    : "Pause Audio"
                  : isBn
                    ? "অডিও প্লে করুন"
                    : "Play Audio"}
              </span>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSeekRelative(-10)}
              >
                -10s
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSeekRelative(10)}
              >
                +10s
              </Button>
            </div>
          </div>
        )}

        {item.kind === "story_book" && (
          <Button
            type="button"
            variant={item.audioUrl ? "outline" : "default"}
            size="md"
            className="w-full"
            onClick={() => handleToggleTts(0)}
          >
            <HugeiconsIcon icon={ttsPlaying ? PauseIcon : VolumeHighIcon} size={17} />
            <span>
              {ttsPlaying
                ? isBn
                  ? "ভয়েস পজ করুন"
                  : "Pause Voice Sync"
                : isBn
                  ? "ভয়েস সিঙ্ক প্লে করুন"
                  : "Play Voice Sync"}
            </span>
          </Button>
        )}

        {(isPlayingAudio || ttsPlaying || activeSentenceIdx >= 0) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={stopAllPlayback}
          >
            <HugeiconsIcon icon={StopIcon} size={15} />
            <span>{isBn ? "রিসেট করুন" : "Stop & Reset"}</span>
          </Button>
        )}
      </div>

      {/* Audio Progress Scrubber */}
      {item.audioUrl && (
        <div className="p-3.5 rounded-panel bg-muted/40 border border-border space-y-2">
          <div className="flex items-center justify-between text-chip text-muted-foreground font-mono">
            <span>{formatSeconds(audioCurrentTime)}</span>
            <span>{formatSeconds(audioDuration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={audioDuration || 100}
            value={audioCurrentTime}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (audioRef.current) {
                audioRef.current.currentTime = next;
              }
              setAudioCurrentTime(next);
            }}
            aria-label="Audio progress"
            className="w-full accent-primary cursor-pointer"
          />
        </div>
      )}

      {/* Playback Speed */}
      <div className="space-y-2">
        <p className="text-chip text-muted-foreground">
          {isBn ? "প্লেব্যাক স্পিড:" : "Playback Speed:"}
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {SPEED_OPTIONS.map((spd) => (
            <Button
              key={spd}
              type="button"
              size="xs"
              variant={playbackRate === spd ? "default" : "outline"}
              onClick={() => setPlaybackRate(spd)}
            >
              {spd}x
            </Button>
          ))}
        </div>
      </div>

      {/* Admin Delete */}
      {isAdmin && !item.isBuiltIn && (
        <div className="pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handleDelete()}
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <HugeiconsIcon icon={Delete02Icon} size={15} />
            <span>{isBn ? "অডিও বুক মুছুন" : "Delete Audio Book"}</span>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full lg:pr-80 xl:pr-96">
      {/* ================= MIDDLE CONTENT AREA ================= */}
      <div className="max-w-reading mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-6">
        {/* Back Link & Header */}
        <div className="space-y-3">
          <Link href="/audiobooks">
            <Button type="button" variant="link" size="xs" className="px-0">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
              <span>{isBn ? "সব অডিও বুকে ফিরুন" : "Back to Audio Books"}</span>
            </Button>
          </Link>

          <Card className="p-5 sm:p-6 bg-card border border-border rounded-card shadow-xs space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <CefrChip level={item.level as CefrLevel} label={item.level} />
              <Badge variant="secondary" size="sm">
                {item.kind === "story_book"
                  ? isBn
                    ? "স্টোরি বুক"
                    : "Story Book"
                  : isBn
                    ? "অডিও বুক"
                    : "Audio Only"}
              </Badge>
              <Badge variant="outline" size="sm">
                {item.category}
              </Badge>
            </div>

            <h1 className="text-page-title text-foreground break-words">
              {isBn && item.titleBn ? item.titleBn : item.title}
            </h1>
            <p className="text-meta text-muted-foreground">
              {isBn && item.descriptionBn ? item.descriptionBn : item.description}
            </p>

            {item.summaryBn && !isLocked && (
              <div className="pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => setShowBnSummary((prev) => !prev)}
                >
                  <HugeiconsIcon icon={SparklesIcon} size={14} />
                  <span>
                    {showBnSummary
                      ? isBn
                        ? "বাংলা সারসংক্ষেপ লুকান"
                        : "Hide Bangla Summary"
                      : isBn
                        ? "বাংলা সারসংক্ষেপ দেখুন"
                        : "Show Bangla Summary"}
                  </span>
                </Button>

                {showBnSummary && (
                  <div className="mt-3 p-3.5 rounded-panel bg-primary/5 border border-primary/20 text-meta text-foreground text-bangla">
                    {item.summaryBn}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Mobile Audio Controls (visible < lg) */}
        {!isLocked && (
          <Card className="lg:hidden p-4 bg-card border border-border rounded-card shadow-xs">
            {audioControlSidebarContent}
          </Card>
        )}

        {/* Locked Guest State OR Story / Audio Content */}
        {isLocked ? (
          <Card className="p-8 bg-card border border-border rounded-card text-center space-y-4">
            <div className="mx-auto size-12 rounded-pill bg-status-warning-bg text-status-warning-ink flex items-center justify-center">
              <HugeiconsIcon icon={AiLockIcon} size={22} />
            </div>
            <h2 className="text-card-title text-foreground">
              {isBn ? "গেস্ট প্রিভিউ লকড" : "Guest Preview Locked"}
            </h2>
            <p className="text-meta text-muted-foreground max-w-reading mx-auto">
              {isBn
                ? "সব অডিও বুক ও স্টোরি বুক শুনতে এবং সিঙ্ক করা টেক্সট পড়তে লগইন করুন।"
                : "Log in to listen to this Audio Book and follow along with synchronized text."}
            </p>
            <Link href={`/auth/login?next=/audiobooks/${encodeURIComponent(item.id)}`}>
              <Button type="button" variant="cta" size="md">
                {isBn ? "লগইন / সাইন আপ করুন" : "Log in / Sign up"}
              </Button>
            </Link>
          </Card>
        ) : item.kind === "story_book" && storySentences.length > 0 ? (
          <Card className="p-5 sm:p-7 bg-card border border-border rounded-card shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-chip text-muted-foreground">
                <HugeiconsIcon icon={BookOpen01Icon} size={15} className="text-primary" />
                <span>
                  {isBn
                    ? "অডিও প্লে করলে লাইনগুলো অটো হাইলাইট হবে — যেকোনো লাইনে ক্লিক করেও প্লে করতে পারবেন"
                    : "Lines highlight automatically as audio plays — click any line to jump"}
                </span>
              </div>
              {activeSentenceIdx >= 0 && (
                <Badge variant="brand" size="sm" className="font-mono shrink-0">
                  {activeSentenceIdx + 1} / {storySentences.length}
                </Badge>
              )}
            </div>

            <div className="space-y-2 leading-loose text-lead">
              {storySentences.map((sentence, sIdx) => {
                const isCurrent = sIdx === activeSentenceIdx;
                return (
                  <span
                    key={sIdx}
                    ref={(el) => {
                      sentenceRefs.current[sIdx] = el;
                    }}
                    onClick={() => handleJumpToSentence(sIdx)}
                    className={cn(
                      "inline cursor-pointer rounded-control px-1.5 py-0.5 transition-colors",
                      isCurrent
                        ? "bg-sun-500/35 text-foreground"
                        : "text-foreground/90 hover:bg-muted"
                    )}
                  >
                    {sentence}{" "}
                  </span>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card className="p-6 sm:p-8 bg-card border border-border rounded-card shadow-xs space-y-5">
            {item.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full max-h-80 object-cover rounded-panel border border-border"
              />
            ) : (
              <div className="py-12 rounded-panel bg-muted/40 border border-border flex flex-col items-center justify-center gap-3 text-center">
                <div className="size-16 rounded-pill bg-primary/10 text-primary flex items-center justify-center">
                  <HugeiconsIcon icon={HeadphonesIcon} size={30} />
                </div>
                <p className="text-label text-foreground">
                  {isBn ? "ডান পাশের প্যানেল থেকে অডিও প্লে করুন" : "Use the Audio Controls on the right to listen"}
                </p>
              </div>
            )}

            <div className="p-4 rounded-panel bg-muted/30 border border-border flex items-start gap-3">
              <HugeiconsIcon
                icon={ArrowReloadHorizontalIcon}
                size={18}
                className="text-primary shrink-0 mt-0.5"
              />
              <p className="text-meta text-muted-foreground">
                {isBn
                  ? "টিপস: প্রথমে ১.০x স্পিডে পুরো অডিওটি শুনে মূল ভাব বোঝার চেষ্টা করুন, এরপর ০.৭৫x স্পিডে শুনে উচ্চারণ ও বিরতি লক্ষ্য করুন।"
                  : "Tip: Listen once at 1.0x for the main idea, then replay at 0.75x to catch natural pronunciation and word linking."}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* ================= FIXED RIGHT SIDEBAR (AUDIO CONTROLS) ================= */}
      {!isLocked && (
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:right-0 lg:top-header lg:bottom-0 lg:w-80 xl:w-96 border-l border-border bg-card overflow-y-auto z-30">
          <div className="p-6">{audioControlSidebarContent}</div>
        </aside>
      )}
    </div>
  );
}
