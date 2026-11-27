"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  HeadphonesIcon,
  BookOpen01Icon,
  Add01Icon,
  Search01Icon,
  AiLockIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { PageContainer, CefrChip, type CefrLevel } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill } from "@/components/ui/pill";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/lib/i18n";
import { useSessionAccess } from "@/components/auth/SessionIsolationProvider";
import { GuestLimitBanner } from "@/components/auth/GuestLimitBanner";
import type {
  AudioBookItem,
  AudioBookKind,
  AudioBookLevel,
} from "@/lib/audiobooks/types";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    let active = true;
    fetch("/api/v1/audiobooks", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setItems(Array.isArray(data.items) ? data.items : []);
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
    };
  }, []);

  const tabItems = useMemo(() => {
    return items.filter((item) => {
      if (item.kind !== activeTab) return false;
      if (levelFilter !== "ALL" && item.level !== levelFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${item.title} ${item.titleBn} ${item.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, activeTab, levelFilter, searchQuery]);

  const unlockedLimit = useMemo(
    () => getGuestLimit(tabItems.length, 1),
    [getGuestLimit, tabItems.length]
  );

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
                {isBn ? "অডিও ও স্টোরি বুক" : "Audio & Story Books"}
              </Badge>
            </div>
            <h1 className="text-page-title text-foreground">
              {isBn ? "অডিও বুক ও স্টোরি বুক" : "Audio Books & Story Books"}
            </h1>
            <p className={cn("text-meta text-muted-foreground max-w-reading", isBn && "text-bangla")}>
              {isBn
                ? "শোনার দক্ষতা বাড়াতে অডিও লেসন শুনুন অথবা স্টোরি বুক ওপেন করে অডিওর সাথে সাথে লাইভ টেক্সট ফলো করুন।"
                : "Sharpen your English listening with uploaded audio lessons or open any Story Book to read along with live synchronized audio."}
            </p>
          </div>

          {isAdmin && (
            <Link href="/audiobooks/upload" className="shrink-0">
              <Button type="button" variant="cta" size="md">
                <HugeiconsIcon icon={Add01Icon} size={17} />
                <span>{isBn ? "অডিও / গল্প আপলোড" : "Upload Audio / Story"}</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Uniform-Height Mode Tabs, Search & Level Dropdown */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={activeTab === "story_book" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("story_book")}
            >
              <HugeiconsIcon icon={BookOpen01Icon} size={16} />
              <span>{isBn ? "স্টোরি বুক" : "Story Book"}</span>
            </Button>

            <Button
              type="button"
              variant={activeTab === "audio_only" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("audio_only")}
            >
              <HugeiconsIcon icon={HeadphonesIcon} size={16} />
              <span>{isBn ? "শুধু অডিও বুক" : "Audio Only"}</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1 sm:w-sidebar">
              <HugeiconsIcon
                icon={Search01Icon}
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
              />
              <Input
                type="text"
                inputSize="sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? "গল্প বা অডিও খুঁজুন..." : "Search stories or audio..."}
                className="pl-9"
              />
            </div>

            <Select
              value={levelFilter}
              onValueChange={(val) => setLevelFilter((val ?? "ALL") as "ALL" | AudioBookLevel)}
            >
              <SelectTrigger size="sm" className="w-full sm:w-36 text-meta">
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

      {/* Uniform-Aligned Thumbnail + Title Card Grid */}
      {loading ? (
        <Card className="p-8 text-center text-meta text-muted-foreground">
          {isBn ? "অডিও বুক লোড হচ্ছে..." : "Loading Audio Books..."}
        </Card>
      ) : tabItems.length === 0 ? (
        <Card className="p-8 text-center space-y-3 bg-card border border-border rounded-card">
          <div className="mx-auto size-12 rounded-pill bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon
              icon={activeTab === "audio_only" ? HeadphonesIcon : BookOpen01Icon}
              size={22}
            />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {tabItems.map((item, idx) => {
            const isLocked = isGuest && idx >= unlockedLimit;
            const href = isLocked
              ? `/auth/login?next=/audiobooks/${encodeURIComponent(item.id)}`
              : `/audiobooks/${encodeURIComponent(item.id)}`;

            return (
              <Link key={item.id} href={href} className="group flex flex-col h-full">
                <Card
                  className={cn(
                    "card-hover h-full p-0.5 md:p-0.5 gap-0 overflow-hidden bg-card border border-border rounded-card shadow-xs flex flex-col justify-between transition-all group-hover:border-primary/50",
                    isLocked && "opacity-75"
                  )}
                >
                  {/* Top: Thumbnail + Title */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="relative aspect-video w-full rounded-panel bg-muted/60 overflow-hidden flex items-center justify-center shrink-0">
                      {item.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-50 to-accent/50 dark:from-brand-950 dark:to-muted flex flex-col items-center justify-center gap-2 p-4">
                          <div className="size-12 rounded-pill bg-card border border-border flex items-center justify-center text-primary shadow-2xs">
                            <HugeiconsIcon
                              icon={item.kind === "audio_only" ? HeadphonesIcon : BookOpen01Icon}
                              size={24}
                            />
                          </div>
                          <span className="text-chip text-muted-foreground truncate max-w-full">
                            {item.category}
                          </span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3">
                        <CefrChip level={item.level as CefrLevel} label={item.level} />
                      </div>

                      {isLocked && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="warning" size="sm" className="gap-1">
                            <HugeiconsIcon icon={AiLockIcon} size={12} />
                            <span>{isBn ? "লকড" : "Locked"}</span>
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Title Only (flex-1 keeps all row footers aligned) */}
                    <div className="p-3.5 sm:p-4 min-w-0 flex-1 flex items-start">
                      <h2 className="text-label text-foreground group-hover:text-primary transition-colors line-clamp-2 break-words">
                        {isBn && item.titleBn ? item.titleBn : item.title}
                      </h2>
                    </div>
                  </div>

                  {/* Aligned Card Footer */}
                  <div className="px-3.5 sm:px-4 py-3 border-t border-border/60 flex items-center justify-between gap-2 text-chip shrink-0">
                    <Badge variant="neutral" size="sm" className="truncate">
                      {item.kind === "story_book"
                        ? isBn
                          ? "স্টোরি বুক"
                          : "Story Book"
                        : isBn
                          ? "অডিও বুক"
                          : "Audio Only"}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-label text-primary shrink-0">
                      <span>
                        {isLocked
                          ? isBn
                            ? "লগইন করুন"
                            : "Log in"
                          : isBn
                            ? "শুনুন ও পড়ুন"
                            : "Open"}
                      </span>
                      <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
