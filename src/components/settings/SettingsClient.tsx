"use client";

import React, { useState, useEffect } from "react";
import { useLocale, t } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { PageContainer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Settings01Icon,
  Globe02Icon,
  VolumeHighIcon,
  Target02Icon,
  Sun01Icon,
  Moon02Icon,
  ComputerIcon,
  Download04Icon,
  Delete02Icon,
  InformationCircleIcon,
  CheckmarkCircle02Icon,
  Bookmark02Icon,
  TaskDone01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/i18n/languages";

export function SettingsClient() {
  const locale = useLocale();
  const { theme, setTheme } = useTheme();

  // Settings State
  const [bilingualMode, setBilingualMode] = useState(true);
  const [audioSpeed, setAudioSpeed] = useState("1.0x");
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [voiceAccent, setVoiceAccent] = useState("us");
  const [dailyGoalMins, setDailyGoalMins] = useState(15);
  const [targetLevel, setTargetLevel] = useState("A1");

  // Data counts
  const [savedWordsCount, setSavedWordsCount] = useState(0);
  const [completedStepsCount, setCompletedStepsCount] = useState(0);

  // Dialog & Notification
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  // Read saved settings from localStorage on mount
  useEffect(() => {
    try {
      const storedBilingual = localStorage.getItem("ecp_bilingual_mode");
      if (storedBilingual !== null) setBilingualMode(storedBilingual === "true");

      const storedSpeed = localStorage.getItem("ecp_audio_speed");
      if (storedSpeed) setAudioSpeed(storedSpeed);

      const storedAutoPlay = localStorage.getItem("ecp_autoplay_audio");
      if (storedAutoPlay !== null) setAutoPlayAudio(storedAutoPlay === "true");

      const storedAccent = localStorage.getItem("ecp_voice_accent");
      if (storedAccent) setVoiceAccent(storedAccent);

      const storedGoal = localStorage.getItem("ecp_daily_goal_mins");
      if (storedGoal) setDailyGoalMins(parseInt(storedGoal, 10));

      const storedLevel = localStorage.getItem("ecp_user_target_level");
      if (storedLevel) setTargetLevel(storedLevel);

      // Counts
      const vocabRaw = localStorage.getItem("ecp_saved_vocabulary");
      if (vocabRaw) {
        const parsed = JSON.parse(vocabRaw);
        if (Array.isArray(parsed)) setSavedWordsCount(parsed.length);
      }

      const stepsRaw = localStorage.getItem("ecp_completed_steps");
      if (stepsRaw) {
        const parsed = JSON.parse(stepsRaw);
        if (Array.isArray(parsed)) setCompletedStepsCount(parsed.length);
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  // Handlers
  const handleLocaleChange = (newLocale: SupportedLocale) => {
    localStorage.setItem("ecp_user_locale", newLocale);
    document.documentElement.lang = newLocale;
    window.dispatchEvent(new CustomEvent("ecp_locale_change", { detail: newLocale }));
  };

  const handleBilingualChange = (checked: boolean) => {
    setBilingualMode(checked);
    localStorage.setItem("ecp_bilingual_mode", checked.toString());
  };

  const handleAudioSpeedChange = (speed: string) => {
    setAudioSpeed(speed);
    localStorage.setItem("ecp_audio_speed", speed);
  };

  const handleAutoPlayChange = (checked: boolean) => {
    setAutoPlayAudio(checked);
    localStorage.setItem("ecp_autoplay_audio", checked.toString());
  };

  const handleVoiceAccentChange = (accent: string) => {
    setVoiceAccent(accent);
    localStorage.setItem("ecp_voice_accent", accent);
  };

  const handleDailyGoalChange = (mins: number) => {
    setDailyGoalMins(mins);
    localStorage.setItem("ecp_daily_goal_mins", mins.toString());
  };

  const handleTargetLevelChange = (lvl: string) => {
    setTargetLevel(lvl);
    localStorage.setItem("ecp_user_target_level", lvl);
  };

  const handleExportData = () => {
    try {
      const dump: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("ecp_")) {
          try {
            dump[key] = JSON.parse(localStorage.getItem(key) || "");
          } catch {
            dump[key] = localStorage.getItem(key);
          }
        }
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dump, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `english-partner-progress-${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch {
      // Export fallback
    }
  };

  const handleConfirmReset = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("ecp_") && key !== "ecp_user_locale") {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      setSavedWordsCount(0);
      setCompletedStepsCount(0);
      setResetDialogOpen(false);
      setShowResetSuccess(true);
      setTimeout(() => setShowResetSuccess(false), 4000);
    } catch {
      // Reset fallback
    }
  };

  return (
    <PageContainer className="py-6 sm:py-8 space-y-8 max-w-4xl">
      {/* 1. Page Header */}
      <div className="border-b border-border pb-6 space-y-1.5">
        <div className="flex items-center gap-2 text-chip text-muted-foreground uppercase tracking-wider">
          <HugeiconsIcon icon={Settings01Icon} size={16} className="text-primary shrink-0" />
          <span>{locale === "bn" ? "অ্যাপ সেটিংস" : "App Preferences"}</span>
        </div>
        <h1 className="font-heading text-page-title text-foreground">
          {t("settings.title", locale)}
        </h1>
        <p className="text-body text-muted-foreground max-w-2xl">
          {t("settings.subtitle", locale)}
        </p>
      </div>

      {/* Success Notification Banner */}
      {showResetSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-panel bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 transition-all">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="shrink-0" />
          <p className="text-label font-medium">{t("settings.resetSuccess", locale)}</p>
        </div>
      )}

      {/* 2. Language & Translation Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-control bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={Globe02Icon} size={18} />
          </div>
          <h2 className="font-heading text-card-title text-foreground">
            {t("settings.languageSection", locale)}
          </h2>
        </div>

        <Card className="bg-card p-5 md:p-6 space-y-6 shadow-card">
          {/* Interface Language */}
          <div className="space-y-2.5">
            <label className="block font-heading text-label text-foreground">
              {t("settings.appLanguage", locale)}
            </label>
            <div className="grid grid-cols-3 gap-2.5 max-w-md">
              <button
                type="button"
                onClick={() => handleLocaleChange("bn")}
                className={cn(
                  "h-control px-3 rounded-control text-label font-medium transition-all cursor-pointer",
                  locale === "bn"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-foreground hover:bg-muted"
                )}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => handleLocaleChange("en")}
                className={cn(
                  "h-control px-3 rounded-control text-label font-medium transition-all cursor-pointer",
                  locale === "en"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-foreground hover:bg-muted"
                )}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLocaleChange("hi")}
                className={cn(
                  "h-control px-3 rounded-control text-label font-medium transition-all cursor-pointer",
                  locale === "hi"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-foreground hover:bg-muted"
                )}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Bilingual Assistance Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="block font-heading text-label text-foreground">
                {t("settings.bilingualAssistance", locale)}
              </span>
              <p className="text-meta text-muted-foreground max-w-lg">
                {t("settings.bilingualAssistanceDesc", locale)}
              </p>
            </div>
            <Switch
              checked={bilingualMode}
              onCheckedChange={handleBilingualChange}
              aria-label={t("settings.bilingualAssistance", locale)}
            />
          </div>
        </Card>
      </section>

      {/* 3. Audio & Speech Preferences */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-control bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={VolumeHighIcon} size={18} />
          </div>
          <h2 className="font-heading text-card-title text-foreground">
            {t("settings.audioSection", locale)}
          </h2>
        </div>

        <Card className="bg-card p-5 md:p-6 space-y-6 shadow-card">
          {/* Default Playback Speed */}
          <div className="space-y-2.5">
            <label className="block font-heading text-label text-foreground">
              {t("settings.playbackSpeed", locale)}
            </label>
            <div className="grid grid-cols-4 gap-2 max-w-sm">
              {["0.75x", "0.88x", "1.0x", "1.25x"].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => handleAudioSpeedChange(spd)}
                  className={cn(
                    "h-control rounded-control text-label font-medium transition-all cursor-pointer",
                    audioSpeed === spd
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 text-foreground hover:bg-muted"
                  )}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Auto-Play Audio Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="block font-heading text-label text-foreground">
                {t("settings.autoPlay", locale)}
              </span>
              <p className="text-meta text-muted-foreground max-w-lg">
                {t("settings.autoPlayDesc", locale)}
              </p>
            </div>
            <Switch
              checked={autoPlayAudio}
              onCheckedChange={handleAutoPlayChange}
              aria-label={t("settings.autoPlay", locale)}
            />
          </div>

          <div className="h-px bg-border" />

          {/* Voice Accent */}
          <div className="space-y-2.5">
            <label className="block font-heading text-label text-foreground">
              {t("settings.voiceAccent", locale)}
            </label>
            <div className="grid grid-cols-3 gap-2.5 max-w-md">
              {[
                { id: "us", labelBn: "মার্কিন (US)", labelEn: "US English" },
                { id: "uk", labelBn: "ব্রিটিশ (UK)", labelEn: "UK English" },
                { id: "global", labelBn: "আন্তর্জাতিক", labelEn: "Global" },
              ].map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleVoiceAccentChange(acc.id)}
                  className={cn(
                    "h-control px-2.5 rounded-control text-label font-medium transition-all cursor-pointer",
                    voiceAccent === acc.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 text-foreground hover:bg-muted"
                  )}
                >
                  {locale === "bn" ? acc.labelBn : acc.labelEn}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* 4. Daily Learning Goals & Level */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-control bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={Target02Icon} size={18} />
          </div>
          <h2 className="font-heading text-card-title text-foreground">
            {t("settings.goalsSection", locale)}
          </h2>
        </div>

        <Card className="bg-card p-5 md:p-6 space-y-6 shadow-card">
          {/* Daily Speaking Goal */}
          <div className="space-y-2.5">
            <label className="block font-heading text-label text-foreground">
              {t("settings.dailySpeakingGoal", locale)}
            </label>
            <div className="grid grid-cols-4 gap-2 max-w-sm">
              {[
                { mins: 5, bn: "৫ মিনিট", en: "5m" },
                { mins: 10, bn: "১০ মিনিট", en: "10m" },
                { mins: 15, bn: "১৫ মিনিট", en: "15m" },
                { mins: 20, bn: "২০ মিনিট", en: "20m" },
              ].map((g) => (
                <button
                  key={g.mins}
                  type="button"
                  onClick={() => handleDailyGoalChange(g.mins)}
                  className={cn(
                    "h-control rounded-control text-label font-medium transition-all cursor-pointer",
                    dailyGoalMins === g.mins
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 text-foreground hover:bg-muted"
                  )}
                >
                  {locale === "bn" ? g.bn : g.en}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Target CEFR Level */}
          <div className="space-y-2.5">
            <div>
              <label className="block font-heading text-label text-foreground">
                {t("settings.targetLevel", locale)}
              </label>
              <p className="text-meta text-muted-foreground mt-0.5">
                {t("settings.targetLevelDesc", locale)}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg">
              {[
                { lvl: "A1", labelBn: "A1 শিক্ষানবিস", labelEn: "A1 Beginner" },
                { lvl: "A2", labelBn: "A2 প্রাথমিক", labelEn: "A2 Elementary" },
                { lvl: "B1", labelBn: "B1 মধ্যবর্তী", labelEn: "B1 Intermediate" },
                { lvl: "B2", labelBn: "B2 উচ্চ মধ্যবর্তী", labelEn: "B2 Upper Intermediate" },
              ].map((item) => (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => handleTargetLevelChange(item.lvl)}
                  className={cn(
                    "h-control px-2.5 rounded-control text-label font-medium transition-all cursor-pointer text-center",
                    targetLevel === item.lvl
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 text-foreground hover:bg-muted"
                  )}
                >
                  {locale === "bn" ? item.labelBn : item.labelEn}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* 5. Appearance & Display */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-control bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={Sun01Icon} size={18} />
          </div>
          <h2 className="font-heading text-card-title text-foreground">
            {t("settings.appearanceSection", locale)}
          </h2>
        </div>

        <Card className="bg-card p-5 md:p-6 space-y-4 shadow-card">
          <div className="space-y-2.5">
            <label className="block font-heading text-label text-foreground">
              {t("settings.themeMode", locale)}
            </label>
            <div className="grid grid-cols-3 gap-2.5 max-w-md">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={cn(
                  "flex items-center justify-center gap-2 h-control px-3 rounded-control text-label font-medium transition-all cursor-pointer",
                  theme === "light"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-foreground hover:bg-muted"
                )}
              >
                <HugeiconsIcon icon={Sun01Icon} size={17} />
                <span>{t("settings.themeLight", locale)}</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex items-center justify-center gap-2 h-control px-3 rounded-control text-label font-medium transition-all cursor-pointer",
                  theme === "dark"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-foreground hover:bg-muted"
                )}
              >
                <HugeiconsIcon icon={Moon02Icon} size={17} />
                <span>{t("settings.themeDark", locale)}</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={cn(
                  "flex items-center justify-center gap-2 h-control px-3 rounded-control text-label font-medium transition-all cursor-pointer",
                  theme === "system"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-foreground hover:bg-muted"
                )}
              >
                <HugeiconsIcon icon={ComputerIcon} size={17} />
                <span>{t("settings.themeSystem", locale)}</span>
              </button>
            </div>
          </div>
        </Card>
      </section>

      {/* 6. Data & Storage Management */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-control bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={Download04Icon} size={18} />
          </div>
          <h2 className="font-heading text-card-title text-foreground">
            {t("settings.dataSection", locale)}
          </h2>
        </div>

        <Card className="bg-card p-5 md:p-6 space-y-6 shadow-card">
          {/* Storage Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-panel bg-muted/60 space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <HugeiconsIcon icon={Bookmark02Icon} size={18} />
                <span className="text-chip font-medium uppercase tracking-wider">
                  {t("settings.savedWordsCount", locale)}
                </span>
              </div>
              <div className="text-display font-semibold text-foreground">
                {savedWordsCount}
              </div>
            </div>

            <div className="p-4 rounded-panel bg-muted/60 space-y-1">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <HugeiconsIcon icon={TaskDone01Icon} size={18} />
                <span className="text-chip font-medium uppercase tracking-wider">
                  {t("settings.completedStepsCount", locale)}
                </span>
              </div>
              <div className="text-display font-semibold text-foreground">
                {completedStepsCount}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              size="default"
              onClick={handleExportData}
              className="rounded-control"
            >
              <HugeiconsIcon icon={Download04Icon} size={18} />
              <span>{t("settings.exportData", locale)}</span>
            </Button>

            <Button
              variant="destructive"
              size="default"
              onClick={() => setResetDialogOpen(true)}
              className="rounded-control"
            >
              <HugeiconsIcon icon={Delete02Icon} size={18} />
              <span>{t("settings.resetProgress", locale)}</span>
            </Button>
          </div>
        </Card>
      </section>

      {/* 7. About & Version Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-control bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={InformationCircleIcon} size={18} />
          </div>
          <h2 className="font-heading text-card-title text-foreground">
            {t("settings.aboutSection", locale)}
          </h2>
        </div>

        <Card className="bg-card p-5 md:p-6 space-y-3 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-label text-foreground font-medium">English Partner</span>
            <span className="text-chip text-muted-foreground font-mono">v1.2.0 (CEFR A1–B2)</span>
          </div>
          <p className="text-meta text-muted-foreground">
            {locale === "bn"
              ? "বাঙালি পেশাজীবী ও শিক্ষার্থীদের জন্য বাস্তবভিত্তিক স্পোকেন ইংলিশ শেখার পূর্ণাঙ্গ প্ল্যাটফর্ম।"
              : "Comprehensive conversational English learning platform tailored with native bilingual support and spaced repetition."}
          </p>
        </Card>
      </section>

      {/* Confirmation Dialog for Reset */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card p-6 rounded-card border-0">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-heading text-card-title text-foreground">
              {t("settings.resetProgress", locale)}
            </DialogTitle>
            <DialogDescription className="text-body text-muted-foreground">
              {t("settings.resetConfirm", locale)}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2.5 pt-4">
            <Button
              variant="outline"
              onClick={() => setResetDialogOpen(false)}
              className="rounded-control"
            >
              {t("common.cancel", locale)}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReset}
              className="rounded-control"
            >
              {t("settings.resetProgress", locale)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
