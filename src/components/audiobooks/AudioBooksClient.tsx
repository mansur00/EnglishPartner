"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  HeadphonesIcon,
  BookOpen01Icon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  VolumeHighIcon,
  Add01Icon,
  Delete02Icon,
  Search01Icon,
  AiLockIcon,
  SparklesIcon,
  ArrowReloadHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { PageContainer, CefrChip, type CefrLevel } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill } from "@/components/ui/pill";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/lib/i18n";
import { useSessionAccess } from "@/components/auth/SessionIsolationProvider";
import { GuestLimitBanner } from "@/components/auth/GuestLimitBanner";
import { speakText, stopSpeech } from "@/lib/audio/speech-engine";
import {
  countWords,
  splitStorySentences,
  type AudioBookItem,
  type AudioBookKind,
  type AudioBookLevel,
} from "@/lib/audiobooks/types";
import { cn } from "@/lib/utils";

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5] as const;

function formatSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function AudioBooksClient() {
  const locale = useLocale();
  const isBn = locale === "bn";
  const { isGuest, config, getGuestLimit } = useSessionAccess();

  const [items, setItems] = useState<AudioBookItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<AudioBookKind>("story_book");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"ALL" | AudioBookLevel>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showBnSummary, setShowBnSummary] = useState(false);

  // TTS sentence-sync state (for Story Books without uploaded audio or when user prefers Voice Read)
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsSentenceIdx, setTtsSentenceIdx] = useState<number>(-1);
  const ttsActiveRef = useRef(false);
  const sentenceRefs = useRef<Record<number, HTMLSpanElement | null>>({});

  // Admin Upload Dialog state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formKind, setFormKind] = useState<AudioBookKind>("audio_only");
  const [formTitle, setFormTitle] = useState("");
  const [formTitleBn, setFormTitleBn] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formLevel, setFormLevel] = useState<AudioBookLevel>("A2");
  const [formCategory, setFormCategory] = useState("Listening Practice");
  const [formSummaryBn, setFormSummaryBn] = useState("");
  const [formStoryText, setFormStoryText] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);

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

  const loadCatalog = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/audiobooks", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const loaded: AudioBookItem[] = Array.isArray(data.items) ? data.items : [];
        setItems(loaded);
        setIsAdmin(Boolean(data.isAdmin));
      }
    } catch {
      // Ignore fetch errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/v1/audiobooks", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        const loaded: AudioBookItem[] = Array.isArray(data.items) ? data.items : [];
        setItems(loaded);
        setIsAdmin(Boolean(data.isAdmin));
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
  }, []);

  const tabItems = useMemo(() => {
    return items.filter((item) => {
      if (item.kind !== activeTab) return false;
      if (levelFilter !== "ALL" && item.level !== levelFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${item.title} ${item.titleBn} ${item.description} ${item.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, activeTab, levelFilter, searchQuery]);

  const unlockedLimit = useMemo(
    () => getGuestLimit(tabItems.length, 1),
    [getGuestLimit, tabItems.length]
  );

  const selectedItem = useMemo(() => {
    const found = tabItems.find((i) => i.id === selectedId);
    if (found) return found;
    return tabItems[0] ?? null;
  }, [tabItems, selectedId]);

  const storySentences = useMemo(() => {
    if (!selectedItem?.storyText) return [];
    return splitStorySentences(selectedItem.storyText);
  }, [selectedItem]);

  // Compute proportional active sentence index when playing an uploaded audio file
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

  // Auto-scroll highlighted sentence smoothly into view
  useEffect(() => {
    if (activeSentenceIdx < 0) return;
    const el = sentenceRefs.current[activeSentenceIdx];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeSentenceIdx]);

  // Keep audio element playbackRate synced
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
    if (selectedItem?.audioUrl && audioRef.current && audioDuration > 0 && storySentences.length > 0) {
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

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("kind", formKind);
      fd.set("title", formTitle);
      fd.set("titleBn", formTitleBn);
      fd.set("description", formDesc);
      fd.set("level", formLevel);
      fd.set("category", formCategory);
      fd.set("summaryBn", formSummaryBn);
      fd.set("storyText", formStoryText);
      if (formFile) {
        fd.set("audioFile", formFile);
      }

      const res = await fetch("/api/v1/audiobooks", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.message || data.error || "Upload failed");
        return;
      }
      setUploadOpen(false);
      setFormTitle("");
      setFormTitleBn("");
      setFormDesc("");
      setFormSummaryBn("");
      setFormStoryText("");
      setFormFile(null);
      setActiveTab(formKind);
      await loadCatalog();
      if (data.item?.id) {
        setSelectedId(data.item.id);
      }
    } catch {
      setUploadError(isBn ? "আপলোড করতে সমস্যা হয়েছে।" : "Failed to upload audio book.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/audiobooks?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        stopAllPlayback();
        await loadCatalog();
      }
    } catch {
      // Ignore error
    }
  };

  const selectedIndex = selectedItem ? tabItems.findIndex((i) => i.id === selectedItem.id) : -1;
  const isSelectedLocked = isGuest && selectedIndex >= unlockedLimit;

  return (
    <PageContainer className="py-6 sm:py-8 space-y-6">
      {/* Header */}
      <Card className="p-5 sm:p-6 bg-card border border-border rounded-card shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Pill variant="brand" size="sm">
                <HugeiconsIcon icon={HeadphonesIcon} size={13} />
                <span>{isBn ? "লিসেনিং স্টুডিও" : "Listening Studio"}</span>
              </Pill>
              <Badge variant="outline" size="sm">
                {isBn ? "অডিও + সিঙ্ক স্টোরি বুক" : "Audio + Synced Story Book"}
              </Badge>
            </div>
            <h1 className="text-page-title text-foreground">
              {isBn ? "অডিও বুক ও স্টোরি বুক" : "Audio Books & Story Books"}
            </h1>
            <p className={cn("text-meta text-muted-foreground max-w-reading", isBn && "text-bangla")}>
              {isBn
                ? "শোনার দক্ষতা (Listening) বাড়াতে অডিও লেসন শুনুন অথবা ৪০০–১০০০ শব্দের গল্প প্লে করে অডিওর সাথে সাথে লাইভ টেক্সট ফলো করুন।"
                : "Sharpen your English listening with uploaded audio lessons or 400–1000 word story books with live synchronized text highlighting."}
            </p>
          </div>

          {isAdmin && (
            <Button
              type="button"
              variant="cta"
              size="md"
              onClick={() => {
                setFormKind(activeTab);
                setUploadError(null);
                setUploadOpen(true);
              }}
              className="shrink-0"
            >
              <HugeiconsIcon icon={Add01Icon} size={17} />
              <span>{isBn ? "অডিও / গল্প আপলোড" : "Upload Audio / Story"}</span>
            </Button>
          )}
        </div>

        {/* Mode Tabs & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={activeTab === "story_book" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                stopAllPlayback();
                setActiveTab("story_book");
                setSelectedId(null);
              }}
            >
              <HugeiconsIcon icon={BookOpen01Icon} size={16} />
              <span>{isBn ? "স্টোরি বুক (৪০০–১০০০ শব্দ)" : "Story Book (400–1000 Words)"}</span>
            </Button>

            <Button
              type="button"
              variant={activeTab === "audio_only" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                stopAllPlayback();
                setActiveTab("audio_only");
                setSelectedId(null);
              }}
            >
              <HugeiconsIcon icon={HeadphonesIcon} size={16} />
              <span>{isBn ? "শুধু অডিও বুক" : "Audio Only"}</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1 sm:w-sidebar">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? "গল্প বা অডিও খুঁজুন..." : "Search stories or audio..."}
                className="pl-9 h-control-sm text-meta"
              />
            </div>

            <Select
              value={levelFilter}
              onValueChange={(val) => setLevelFilter((val ?? "ALL") as "ALL" | AudioBookLevel)}
            >
              <SelectTrigger size="sm" className="w-full sm:w-36 text-label">
                <SelectValue>
                  {levelFilter === "ALL" ? (isBn ? "সব লেভেল" : "All Levels") : levelFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{isBn ? "সব লেভেল" : "All Levels"}</SelectItem>
                {(["A1", "A2", "B1", "B2", "C1"] as const).map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {isGuest && (
        <GuestLimitBanner
          previewPercent={config.guest_preview_percent}
          featureName={isBn ? "অডিও বুক ও স্টোরি বুক" : "Audio Books & Story Books"}
          nextPath="/audiobooks"
        />
      )}

      {/* Main Content: Catalog List + Active Synced Player */}
      {loading ? (
        <Card className="p-8 text-center text-meta text-muted-foreground">
          {isBn ? "অডিও বুক লোড হচ্ছে..." : "Loading Audio Books..."}
        </Card>
      ) : tabItems.length === 0 ? (
        <Card className="p-8 text-center space-y-3 bg-card border border-border rounded-card">
          <div className="mx-auto size-12 rounded-pill bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={activeTab === "audio_only" ? HeadphonesIcon : BookOpen01Icon} size={22} />
          </div>
          <h2 className="text-card-title text-foreground">
            {activeTab === "audio_only"
              ? isBn
                ? "এখনো কোনো Audio Only ফাইল আপলোড করা হয়নি"
                : "No Audio Only books uploaded yet"
              : isBn
                ? "কোনো স্টোরি বুক পাওয়া যায়নি"
                : "No matching Story Books found"}
          </h2>
          <p className="text-meta text-muted-foreground max-w-reading mx-auto">
            {isAdmin
              ? isBn
                ? "উপরের 'অডিও / গল্প আপলোড' বাটনে ক্লিক করে নতুন MP3/WAV অডিও বুক যোগ করুন।"
                : "Click 'Upload Audio / Story' above to add your first MP3/WAV audio book."
              : isBn
                ? "অ্যাডমিন নতুন অডিও বুক আপলোড করলে এখানে দেখা যাবে।"
                : "Uploaded audio lessons will appear here once added by an admin."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Catalog */}
          <div className="lg:col-span-5 space-y-3">
            {tabItems.map((item, idx) => {
              const isLocked = isGuest && idx >= unlockedLimit;
              const isActive = selectedItem?.id === item.id;

              return (
                <Card
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    stopAllPlayback();
                    setSelectedId(item.id);
                    setShowBnSummary(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      stopAllPlayback();
                      setSelectedId(item.id);
                      setShowBnSummary(false);
                    }
                  }}
                  className={cn(
                    "p-4 rounded-card transition-all cursor-pointer space-y-2.5",
                    isActive
                      ? "bg-primary/5 border border-primary shadow-xs"
                      : "bg-card border border-border hover:border-primary/40",
                    isLocked && "opacity-75"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <CefrChip level={item.level as CefrLevel} label={item.level} />
                      <Badge variant="neutral" size="sm" className="truncate">
                        {item.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.wordCount ? (
                        <Badge variant="outline" size="sm" className="font-mono">
                          {item.wordCount}w
                        </Badge>
                      ) : item.durationLabel ? (
                        <Badge variant="outline" size="sm" className="font-mono">
                          {item.durationLabel}
                        </Badge>
                      ) : null}
                      {isLocked && (
                        <Badge variant="warning" size="sm" className="gap-1">
                          <HugeiconsIcon icon={AiLockIcon} size={12} />
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="text-label text-foreground line-clamp-2 break-words">
                      {isBn && item.titleBn ? item.titleBn : item.title}
                    </h3>
                    <p className="text-chip text-muted-foreground line-clamp-2">
                      {isBn && item.descriptionBn ? item.descriptionBn : item.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Right Column: Active Player & Synced Reader */}
          <div className="lg:col-span-7">
            {selectedItem && (
              <Card className="p-5 sm:p-6 bg-card border border-border rounded-card shadow-xs space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-border">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CefrChip level={selectedItem.level as CefrLevel} label={selectedItem.level} />
                      <Badge variant="secondary" size="sm">
                        {selectedItem.kind === "story_book"
                          ? isBn
                            ? "স্টোরি বুক"
                            : "Story Book"
                          : isBn
                            ? "অডিও বুক"
                            : "Audio Only"}
                      </Badge>
                      {selectedItem.wordCount && (
                        <Badge variant="outline" size="sm" className="font-mono">
                          {selectedItem.wordCount} {isBn ? "শব্দ" : "words"}
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-card-title text-foreground break-words">
                      {isBn && selectedItem.titleBn ? selectedItem.titleBn : selectedItem.title}
                    </h2>
                    <p className="text-meta text-muted-foreground">
                      {isBn && selectedItem.descriptionBn
                        ? selectedItem.descriptionBn
                        : selectedItem.description}
                    </p>
                  </div>

                  {isAdmin && !selectedItem.isBuiltIn && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => void handleDeleteItem(selectedItem.id)}
                      aria-label="Delete item"
                      className="text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={16} />
                    </Button>
                  )}
                </div>

                {isSelectedLocked ? (
                  <div className="p-6 rounded-panel bg-muted/40 border border-border text-center space-y-3">
                    <div className="mx-auto size-11 rounded-pill bg-status-warning-bg text-status-warning-ink flex items-center justify-center">
                      <HugeiconsIcon icon={AiLockIcon} size={20} />
                    </div>
                    <h3 className="text-label text-foreground">
                      {isBn ? "গেস্ট প্রিভিউ সীমা শেষ" : "Guest Preview Locked"}
                    </h3>
                    <p className="text-meta text-muted-foreground max-w-reading mx-auto">
                      {isBn
                        ? "সব অডিও বুক ও ৪০০–১০০০ শব্দের স্টোরি বুক শুনতে এবং সিঙ্ক করা টেক্সট দেখতে লগইন করুন।"
                        : "Log in to listen to all Audio Books and read all 400–1000 word Story Books with live synced audio."}
                    </p>
                    <Link href="/auth/login?next=/audiobooks">
                      <Button type="button" variant="cta" size="sm">
                        {isBn ? "লগইন / সাইন আপ করুন" : "Log in / Sign up"}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Audio Controls Bar */}
                    <div className="p-4 rounded-panel bg-muted/40 border border-border space-y-3">
                      {selectedItem.audioUrl && (
                        <audio
                          ref={audioRef}
                          src={selectedItem.audioUrl}
                          onTimeUpdate={(e) => setAudioCurrentTime(e.currentTarget.currentTime)}
                          onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration || 0)}
                          onEnded={() => setIsPlayingAudio(false)}
                          className="hidden"
                        />
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {selectedItem.audioUrl && (
                            <>
                              <Button
                                type="button"
                                variant="default"
                                size="sm"
                                onClick={handleToggleAudioFile}
                              >
                                <HugeiconsIcon
                                  icon={isPlayingAudio ? PauseIcon : PlayIcon}
                                  size={16}
                                />
                                <span>
                                  {isPlayingAudio
                                    ? isBn
                                      ? "পজ করুন"
                                      : "Pause Audio"
                                    : isBn
                                      ? "অডিও প্লে করুন"
                                      : "Play Audio"}
                                </span>
                              </Button>
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
                            </>
                          )}

                          {selectedItem.kind === "story_book" && (
                            <Button
                              type="button"
                              variant={selectedItem.audioUrl ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleToggleTts(0)}
                            >
                              <HugeiconsIcon
                                icon={ttsPlaying ? PauseIcon : VolumeHighIcon}
                                size={16}
                              />
                              <span>
                                {ttsPlaying
                                  ? isBn
                                    ? "ভয়েস থামান"
                                    : "Pause Voice"
                                  : isBn
                                    ? "ভয়েস রিডার প্লে"
                                    : "Play Voice Sync"}
                              </span>
                            </Button>
                          )}

                          {(isPlayingAudio || ttsPlaying || activeSentenceIdx >= 0) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={stopAllPlayback}
                            >
                              <HugeiconsIcon icon={StopIcon} size={15} />
                              <span>{isBn ? "রিসেট" : "Reset"}</span>
                            </Button>
                          )}
                        </div>

                        {/* Speed Control */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-chip text-muted-foreground">
                            {isBn ? "স্পিড:" : "Speed:"}
                          </span>
                          {SPEED_OPTIONS.map((spd) => (
                            <Button
                              key={spd}
                              type="button"
                              size="xs"
                              variant={playbackRate === spd ? "secondary" : "ghost"}
                              onClick={() => setPlaybackRate(spd)}
                            >
                              {spd}x
                            </Button>
                          ))}
                        </div>
                      </div>

                      {selectedItem.audioUrl && (
                        <div className="flex items-center gap-3 text-chip text-muted-foreground font-mono">
                          <span>{formatSeconds(audioCurrentTime)}</span>
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
                            className="flex-1 accent-primary cursor-pointer"
                          />
                          <span>{formatSeconds(audioDuration)}</span>
                        </div>
                      )}
                    </div>

                    {/* Bangla Summary Toggle (if available) */}
                    {selectedItem.summaryBn && (
                      <div className="space-y-2">
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
                          <div className="p-3.5 rounded-panel bg-primary/5 border border-primary/20 text-meta text-foreground text-bangla">
                            {selectedItem.summaryBn}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Synced Story Reader */}
                    {selectedItem.kind === "story_book" && storySentences.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-chip text-muted-foreground">
                            {isBn
                              ? "যেকোনো লাইনে ক্লিক করলে সেখান থেকে অডিও ও টেক্সট একসাথে চলবে:"
                              : "Click any sentence to play and follow along with live audio sync:"}
                          </span>
                          {activeSentenceIdx >= 0 && (
                            <Badge variant="brand" size="sm" className="font-mono">
                              {activeSentenceIdx + 1} / {storySentences.length}
                            </Badge>
                          )}
                        </div>

                        <div className="max-h-96 overflow-y-auto p-4 sm:p-5 rounded-panel bg-background border border-border space-y-2 leading-relaxed text-body">
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
                                  "inline cursor-pointer rounded-control px-1 py-0.5 transition-colors",
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
                      </div>
                    )}

                    {/* Audio Only listening tips */}
                    {selectedItem.kind === "audio_only" && (
                      <div className="p-4 rounded-panel bg-background border border-border flex items-start gap-3">
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
                    )}
                  </>
                )}
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Admin Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-reading max-h-dialog overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isBn ? "নতুন অডিও বুক বা স্টোরি বুক যোগ করুন" : "Upload Audio Book or Story Book"}
            </DialogTitle>
            <DialogDescription>
              {isBn
                ? "Audio Only-তে MP3/WAV আপলোড করুন, অথবা Story Book-এ ৪০০–১০০০ শব্দের গল্প ও ঐচ্ছিক অডিও দিন।"
                : "Upload an MP3/WAV for Audio Only, or add a 400–1000 word Story Book (with optional audio file)."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-chip text-foreground block">
                  {isBn ? "ধরন (Type)" : "Book Type"}
                </label>
                <Select
                  value={formKind}
                  onValueChange={(val) => setFormKind((val ?? "audio_only") as AudioBookKind)}
                >
                  <SelectTrigger className="w-full text-label">
                    <SelectValue>
                      {formKind === "audio_only" ? "Audio Only" : "Story Book (400–1000 words)"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audio_only">Audio Only (MP3/WAV)</SelectItem>
                    <SelectItem value="story_book">Story Book (400–1000 words)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-chip text-foreground block">CEFR Level</label>
                <Select
                  value={formLevel}
                  onValueChange={(val) => setFormLevel((val ?? "A2") as AudioBookLevel)}
                >
                  <SelectTrigger className="w-full text-label">
                    <SelectValue>{formLevel}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(["A1", "A2", "B1", "B2", "C1"] as const).map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-chip text-foreground block">Title (English)</label>
                <Input
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Morning Coffee Conversation"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-chip text-foreground block">Title (Bangla)</label>
                <Input
                  value={formTitleBn}
                  onChange={(e) => setFormTitleBn(e.target.value)}
                  placeholder="যেমন: সকালের কফি শপে কথোপকথন"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-chip text-foreground block">Category</label>
                <Input
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="Daily Life / Workplace"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-chip text-foreground block">
                  {formKind === "audio_only"
                    ? "Audio File (Required: MP3, WAV, M4A, OGG)"
                    : "Audio File (Optional — uses Voice Sync if empty)"}
                </label>
                <Input
                  type="file"
                  accept=".mp3,.wav,.m4a,.ogg,.webm,audio/*"
                  onChange={(e) => setFormFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-chip text-foreground block">Short Description</label>
              <Input
                required
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Brief summary of what the learner will hear..."
              />
            </div>

            {formKind === "story_book" && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-chip text-foreground">
                      Story Text (Recommended 400–1000 words)
                    </label>
                    <Badge variant="outline" size="sm" className="font-mono">
                      {countWords(formStoryText)} words
                    </Badge>
                  </div>
                  <Textarea
                    rows={7}
                    required
                    value={formStoryText}
                    onChange={(e) => setFormStoryText(e.target.value)}
                    placeholder="Paste your 400–1000 word English story here..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-chip text-foreground block">
                    Bangla Summary (Optional)
                  </label>
                  <Textarea
                    rows={2}
                    value={formSummaryBn}
                    onChange={(e) => setFormSummaryBn(e.target.value)}
                    placeholder="গল্পটির সংক্ষিপ্ত বাংলা অর্থ..."
                  />
                </div>
              </>
            )}

            {uploadError && (
              <p className="text-meta text-destructive">{uploadError}</p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadOpen(false)}
                disabled={uploading}
              >
                {isBn ? "বাতিল" : "Cancel"}
              </Button>
              <Button type="submit" variant="cta" loading={uploading}>
                {isBn ? "সেভ ও আপলোড করুন" : "Save & Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
