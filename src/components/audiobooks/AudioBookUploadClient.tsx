"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  HeadphonesIcon,
  BookOpen01Icon,
  Upload04Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
  AiLockIcon,
} from "@hugeicons/core-free-icons";
import { PageContainer } from "@/components/shared";
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
import { useLocale } from "@/lib/i18n";
import type { AudioBookKind, AudioBookLevel } from "@/lib/audiobooks/types";

export function AudioBookUploadClient() {
  const router = useRouter();
  const locale = useLocale();
  const isBn = locale === "bn";

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formKind, setFormKind] = useState<AudioBookKind>("story_book");
  const [formLevel, setFormLevel] = useState<AudioBookLevel>("A2");
  const [formTitle, setFormTitle] = useState("");
  const [formTitleBn, setFormTitleBn] = useState("");
  const [formCategory, setFormCategory] = useState("Listening");
  const [formDesc, setFormDesc] = useState("");
  const [formStoryText, setFormStoryText] = useState("");
  const [formSummaryBn, setFormSummaryBn] = useState("");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/v1/audiobooks", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        setIsAdmin(Boolean(data?.isAdmin));
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      })
      .finally(() => {
        if (active) setCheckingAuth(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (thumbPreviewUrl) {
        URL.revokeObjectURL(thumbPreviewUrl);
      }
    };
  }, [thumbPreviewUrl]);

  const handleThumbChange = (file: File | null) => {
    if (thumbPreviewUrl) {
      URL.revokeObjectURL(thumbPreviewUrl);
    }
    setThumbFile(file);
    setThumbPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (formKind === "audio_only" && !audioFile) {
      setErrorMsg(
        isBn
          ? "Audio Only মোডের জন্য একটি অডিও ফাইল (MP3, WAV, M4A, OGG) সিলেক্ট করুন।"
          : "Please select an audio file (MP3, WAV, M4A, OGG) for Audio Only."
      );
      return;
    }

    if (formKind === "story_book" && formStoryText.trim().length < 20) {
      setErrorMsg(
        isBn
          ? "Story Book-এর জন্য গল্পের টেক্সট লিখুন।"
          : "Please enter the story text for Story Book."
      );
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("kind", formKind);
      fd.set("level", formLevel);
      fd.set("title", formTitle);
      fd.set("titleBn", formTitleBn);
      fd.set("category", formCategory);
      fd.set("description", formDesc);
      fd.set("storyText", formStoryText);
      fd.set("summaryBn", formSummaryBn);
      if (audioFile) fd.set("audioFile", audioFile);
      if (thumbFile) fd.set("thumbnailFile", thumbFile);

      const res = await fetch("/api/v1/audiobooks", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.message || data.error || "Upload failed. Please try again.");
        return;
      }

      if (data.item?.id) {
        router.push(`/audiobooks/${encodeURIComponent(data.item.id)}`);
      } else {
        router.push("/audiobooks");
      }
    } catch {
      setErrorMsg(
        isBn
          ? "সার্ভারে আপলোড করতে সমস্যা হয়েছে। ফাইলের সাইজ ও ফরম্যাট চেক করুন।"
          : "Network or server error while uploading. Please check file size and format."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <PageContainer className="py-8">
        <Card className="p-8 text-center text-meta text-muted-foreground">
          {isBn ? "যাচাই করা হচ্ছে..." : "Checking admin access..."}
        </Card>
      </PageContainer>
    );
  }

  if (!isAdmin) {
    return (
      <PageContainer className="py-8">
        <Card className="p-8 bg-card border border-border rounded-card text-center space-y-4 max-w-reading mx-auto">
          <div className="mx-auto size-12 rounded-pill bg-status-warning-bg text-status-warning-ink flex items-center justify-center">
            <HugeiconsIcon icon={AiLockIcon} size={22} />
          </div>
          <h1 className="text-card-title text-foreground">
            {isBn ? "অ্যাডমিন অ্যাক্সেস প্রয়োজন" : "Admin Access Required"}
          </h1>
          <p className="text-meta text-muted-foreground">
            {isBn
              ? "শুধুমাত্র অ্যাডমিন অ্যাকাউন্ট থেকে নতুন অডিও বুক বা স্টোরি বুক আপলোড করা যাবে।"
              : "Only admin accounts can upload Audio Books or Story Books."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/audiobooks">
              <Button variant="outline" size="sm">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
                <span>{isBn ? "অডিও বুকে ফিরুন" : "Back to Audio Books"}</span>
              </Button>
            </Link>
            <Link href="/auth/login?next=/audiobooks/upload">
              <Button variant="cta" size="sm">
                {isBn ? "অ্যাডমিন লগইন" : "Admin Login"}
              </Button>
            </Link>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-6 sm:py-8 space-y-6">
      {/* Top Bar */}
      <div className="space-y-3">
        <Link href="/audiobooks">
          <Button type="button" variant="link" size="xs" className="px-0">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
            <span>{isBn ? "সব অডিও বুকে ফিরুন" : "Back to Audio Books"}</span>
          </Button>
        </Link>

        <Card className="p-5 sm:p-6 bg-card border border-border rounded-card shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <Pill variant="brand" size="sm">
                <HugeiconsIcon icon={Upload04Icon} size={13} />
                <span>{isBn ? "অ্যাডমিন পাবলিশিং স্টুডিও" : "Admin Publishing Studio"}</span>
              </Pill>
              <h1 className="text-page-title text-foreground">
                {isBn ? "নতুন অডিও বুক বা স্টোরি বুক আপলোড" : "Upload Audio Book or Story Book"}
              </h1>
              <p className="text-meta text-muted-foreground">
                {isBn
                  ? "প্রফেশনাল থাম্বনেইল কভার, অডিও ফাইল (MP3/WAV) এবং স্টোরি টেক্সট যোগ করে পাবলিশ করুন।"
                  : "Add cover art, an audio file (MP3/WAV/M4A/OGG), and synchronized story text."}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 2-Column Studio Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Metadata & Story Text */}
        <Card className="lg:col-span-7 p-5 sm:p-6 bg-card border border-border rounded-card shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-chip text-foreground block">
                {isBn ? "বইয়ের ধরন" : "Book Type"}
              </label>
              <Select
                value={formKind}
                onValueChange={(val) => setFormKind((val ?? "story_book") as AudioBookKind)}
              >
                <SelectTrigger className="w-full text-label">
                  <SelectValue>
                    {formKind === "story_book" ? "Story Book (Synced Text + Audio)" : "Audio Only"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="story_book">Story Book (Synced Text + Audio)</SelectItem>
                  <SelectItem value="audio_only">Audio Only (MP3 / WAV)</SelectItem>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-chip text-foreground block">
                {isBn ? "শিরোনাম (English) *" : "Title (English) *"}
              </label>
              <Input
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Morning Coffee Conversation"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-chip text-foreground block">
                {isBn ? "শিরোনাম (বাংলা - ঐচ্ছিক)" : "Title (Bangla - Optional)"}
              </label>
              <Input
                value={formTitleBn}
                onChange={(e) => setFormTitleBn(e.target.value)}
                placeholder="যেমন: সকালের কফি শপে কথোপকথন"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-chip text-foreground block">
                {isBn ? "ক্যাটাগরি" : "Category"}
              </label>
              <Input
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="Daily Life / Workplace"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-chip text-foreground block">
                {isBn ? "সংক্ষিপ্ত নোট (ঐচ্ছিক)" : "Short Note (Optional)"}
              </label>
              <Input
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Shown inside the reader page..."
              />
            </div>
          </div>

          {formKind === "story_book" && (
            <>
              <div className="space-y-1.5">
                <label className="text-chip text-foreground block">
                  {isBn
                    ? "গল্পের সম্পূর্ণ টেক্সট * (১০০০–৫০০০+ শব্দ সাপোর্ট করে)"
                    : "Full Story Text * (Supports 1000–5000+ words)"}
                </label>
                <Textarea
                  rows={10}
                  required
                  value={formStoryText}
                  onChange={(e) => setFormStoryText(e.target.value)}
                  placeholder="Paste your full English story here..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-chip text-foreground block">
                  {isBn ? "বাংলা সারসংক্ষেপ (ঐচ্ছিক)" : "Bangla Summary (Optional)"}
                </label>
                <Textarea
                  rows={3}
                  value={formSummaryBn}
                  onChange={(e) => setFormSummaryBn(e.target.value)}
                  placeholder="গল্পটির সংক্ষিপ্ত বাংলা অর্থ..."
                />
              </div>
            </>
          )}
        </Card>

        {/* Right: Cover Thumbnail & Audio Dropzones + Publish */}
        <div className="lg:col-span-5 space-y-5">
          {/* Thumbnail Cover Upload */}
          <Card className="p-5 bg-card border border-border rounded-card shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-label text-foreground">
                {isBn ? "কার্ড থাম্বনেইল কভার" : "Card Thumbnail Cover"}
              </span>
              <Badge variant="outline" size="sm">
                JPG / PNG / WEBP
              </Badge>
            </div>

            {thumbPreviewUrl ? (
              <div className="space-y-2.5">
                <div className="relative aspect-video w-full rounded-panel overflow-hidden border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbPreviewUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-chip text-muted-foreground truncate">
                    {thumbFile?.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => handleThumbChange(null)}
                    className="text-destructive shrink-0"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                    <span>{isBn ? "মুছুন" : "Remove"}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-panel border border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer text-center">
                <div className="size-10 rounded-pill bg-primary/10 text-primary flex items-center justify-center">
                  <HugeiconsIcon icon={BookOpen01Icon} size={20} />
                </div>
                <span className="text-label text-foreground">
                  {isBn ? "থাম্বনেইল ছবি সিলেক্ট করুন" : "Click to choose cover image"}
                </span>
                <span className="text-chip text-muted-foreground">
                  {isBn ? "ঐচ্ছিক — না দিলে ডিফল্ট কভার দেখাবে" : "Optional — default cover used if empty"}
                </span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/*"
                  onChange={(e) => handleThumbChange(e.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>
            )}
          </Card>

          {/* Audio File Upload */}
          <Card className="p-5 bg-card border border-border rounded-card shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-label text-foreground">
                {formKind === "audio_only"
                  ? isBn
                    ? "অডিও ফাইল *"
                    : "Audio File *"
                  : isBn
                    ? "অডিও ফাইল (ঐচ্ছিক)"
                    : "Audio File (Optional)"}
              </span>
              <Badge variant="outline" size="sm">
                MP3 / WAV / M4A (50MB)
              </Badge>
            </div>

            {audioFile ? (
              <div className="p-3.5 rounded-panel bg-primary/5 border border-primary/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    className="text-primary shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-label text-foreground truncate">{audioFile.name}</p>
                    <p className="text-chip text-muted-foreground">
                      {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setAudioFile(null)}
                  className="text-destructive shrink-0"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} />
                  <span>{isBn ? "মুছুন" : "Remove"}</span>
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-panel border border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer text-center">
                <div className="size-10 rounded-pill bg-primary/10 text-primary flex items-center justify-center">
                  <HugeiconsIcon icon={HeadphonesIcon} size={20} />
                </div>
                <span className="text-label text-foreground">
                  {isBn ? "অডিও ফাইল আপলোড করুন" : "Click to select audio file"}
                </span>
                <span className="text-chip text-muted-foreground">
                  {formKind === "story_book"
                    ? isBn
                      ? "না দিলে বিল্ট-ইন ভয়েস সিঙ্ক দিয়ে প্লে হবে"
                      : "Optional for Story Book — uses Voice Sync if empty"
                    : isBn
                      ? "MP3, WAV, M4A, OGG, WEBM সাপোর্টেড"
                      : "Supports MP3, WAV, M4A, OGG, WEBM"}
                </span>
                <input
                  type="file"
                  accept=".mp3,.wav,.m4a,.ogg,.webm,audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>
            )}
          </Card>

          {/* Error & Publish */}
          <Card className="p-5 bg-card border border-border rounded-card shadow-xs space-y-3">
            {errorMsg && (
              <div className="p-3 rounded-control bg-status-danger-bg text-status-danger-ink text-meta">
                {errorMsg}
              </div>
            )}

            <Button type="submit" variant="cta" size="lg" className="w-full" loading={submitting}>
              <HugeiconsIcon icon={Upload04Icon} size={18} />
              <span>{isBn ? "পাবলিশ ও সেভ করুন" : "Publish Audio Book"}</span>
            </Button>

            <Link href="/audiobooks" className="block">
              <Button type="button" variant="outline" size="sm" className="w-full" disabled={submitting}>
                {isBn ? "বাতিল করুন" : "Cancel"}
              </Button>
            </Link>
          </Card>
        </div>
      </form>
    </PageContainer>
  );
}
