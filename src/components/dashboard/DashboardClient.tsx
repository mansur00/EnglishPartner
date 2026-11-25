"use client";

import React from "react";
import Link from "next/link";
import { t, useTranslations, useLiveTranslations } from "@/lib/i18n";
import { speakText } from "@/lib/audio/speech-engine";
import { isRtlLanguage } from "@/lib/i18n/languages";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  PageContainer,
  HeroBand,
  TodayPanel,
  TopicCard,
  CefrChip,
  ChatBubble,
  Panel,
  LocaleTitle,
} from "@/components/shared";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayCircleIcon,
  ArrowRight01Icon,
  BookOpen01Icon,
  Clock01Icon,
  Message01Icon,
  SparklesIcon,
  BotIcon,
  Bookmark02Icon,
  CheckmarkBadge01Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";

export function DashboardClient() {
  const { locale, translationLocale } = useTranslations();

  const previewLine1 = "Excuse me, could you tell me how much this costs?";
  const previewLine2 = "Certainly! It is forty-five dollars with a 10% discount.";
  const needsLivePreview = translationLocale !== "none" && translationLocale !== "bn";
  const { translations: livePreviewMap } = useLiveTranslations(
    needsLivePreview ? [previewLine1, previewLine2] : [],
    needsLivePreview ? translationLocale : "none"
  );

  return (
    <PageContainer className="py-6 sm:py-8 space-y-6 pb-16">
      {/* 1. Rounded Deep-Violet Hero Banner Card */}
      <HeroBand className="rounded-card p-6 md:p-7 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-page-title text-band-panel-ink">
              {t("dashboard.heroTitle", locale)}
            </h1>
            <p className="text-meta text-band-panel-ink/80 mt-1.5">
              {t("dashboard.heroSubtitle", locale)}
            </p>
          </div>

          <TodayPanel />
        </div>
      </HeroBand>

      {/* 2. Row 1: Level Assessment Quiz Card + AI Partner CTA Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Level Assessment Quiz Card */}
        <Card className="p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={SparklesIcon} size={20} />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="sm">
                  {locale === "bn" ? "৪০ প্রশ্ন • এআই কুইজ" : "40 Questions • AI"}
                </Badge>
                <CefrChip level="A1" label="A1–C2" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground">
                {locale === "bn"
                  ? "আপনার ইংরেজি লেভেল যাচাই করুন"
                  : "Level Assessment Quiz"}
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                {locale === "bn"
                  ? "প্রতিবার রিফ্রেশ করলে এআই থেকে নতুন ৪০টি প্রশ্ন তৈরি হবে। আপনার বর্তমান CEFR দক্ষতা যাচাই করুন।"
                  : "Test your CEFR level across 40 AI-powered questions. Tap Refresh anytime for 40 brand-new questions."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/dashboard/level-assessment" className="block w-full sm:w-auto">
              <Button variant="cta" size="md" className="btn-press w-full sm:w-auto gap-2 cursor-pointer">
                <span>{locale === "bn" ? "লেভেল কুইজ শুরু করুন" : "Start Level Quiz"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </Button>
            </Link>
          </div>
        </Card>

        {/* AI Partner CTA Card */}
        <Card className="p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={BotIcon} size={20} />
              </div>
              <Badge variant="brand" size="sm">
                {locale === "bn" ? "ভয়েস ও টেক্সট" : "Voice & Text AI"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground">
                {locale === "bn"
                  ? "এআই কনভারসেশন পার্টনার"
                  : "AI Conversation Partner"}
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                {locale === "bn"
                  ? "বাস্তব জীবনের পরিস্থিতি বা উন্মুক্ত আড্ডায় এআই পার্টনারের সাথে ভয়েস ও টেক্সটে ইংরেজি বলার অনুশীলন করুন।"
                  : "Practice real-world scenarios or freestyle speaking with your live AI voice & text partner."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/roleplay" className="block w-full sm:w-auto">
              <Button variant="default" size="md" className="btn-press w-full sm:w-auto gap-2 cursor-pointer">
                <span>{locale === "bn" ? "এআই পার্টনারে যান" : "Open AI Partner"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. Row 2: Full-Width Start Conversation Feature Card (Rainbow Border) */}
      <div className="rainbow-border rounded-card">
        <TopicCard
          topic="shopping"
          className="p-6 md:p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Recommendation Info & CTA */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" size="md">
                  ✨ {t("dashboard.dailyRecommendation", locale)}
                </Badge>
                <CefrChip level="A2" label={locale === "bn" ? "A2 • প্রাথমিক" : "A2 • Elementary"} />
                <span className="inline-flex items-center px-3 py-1 rounded-pill text-chip bg-topic-tile text-topic-ink shadow-2xs">
                  {locale === "bn" ? "কেনাকাটা ও লেনদেন" : "Shopping & Money"}
                </span>
              </div>

              <div>
                <LocaleTitle
                  as="h2"
                  titleEn="Asking for a Price & Product Details"
                  titleBn="দোকানে কোনো পণ্যের দাম ও বিবরণ জানতে চাওয়া"
                  className="text-hero-title text-foreground"
                />
              </div>

              <p className="text-body text-muted-foreground leading-relaxed">
                {locale === "bn"
                  ? "দোকানে কোনো পণ্যের আকার জানতে, ছাড় যাচাই করতে এবং আত্মবিশ্বাসের সাথে দাম নিশ্চিত করতে স্বাভাবিক বাক্যগুলো আয়ত্ত করুন।"
                  : "Master natural retail phrases to inquire about sizes, verify discount offers, and confirm prices without hesitation."}
              </p>

              <div className="flex items-center gap-5 text-meta text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Clock01Icon} size={16} className="text-primary" /> 5-8 {t("dashboard.minutesUnit", locale)}
                </span>
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={BookOpen01Icon} size={16} className="text-primary" /> 8 {t("dashboard.dialogueTurnsUnit", locale)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/conversations/asking-price-product-details" className="w-full sm:w-auto">
                  <Button variant="cta" size="lg" className="btn-press w-full sm:w-auto shadow-xs gap-2 cursor-pointer">
                    <HugeiconsIcon icon={PlayCircleIcon} size={20} />
                    <span>{t("dashboard.startConversation", locale)}</span>
                  </Button>
                </Link>
                <Link href="/explore" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 cursor-pointer">
                    <span>{locale === "bn" ? "সব কথোপকথন" : "Browse All"}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Mini Interactive Dialogue Preview */}
            <Panel variant="topic" className="lg:col-span-5 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-chip text-topic-ink uppercase tracking-wider pb-2 border-b border-border/70">
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Message01Icon} size={15} />
                  {t("dashboard.dialoguePreview", locale)}
                </span>
                <button
                  type="button"
                  onClick={() => speakText(`${previewLine1} ${previewLine2}`)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-card/80 border border-border/60 text-chip text-foreground hover:text-primary transition-colors cursor-pointer normal-case"
                >
                  <HugeiconsIcon icon={VolumeHighIcon} size={13} />
                  <span>{locale === "bn" ? "শুনুন" : "Listen"}</span>
                </button>
              </div>

              {/* Bubble 1: Customer (Speaker 1) */}
              <div className="flex items-start gap-2.5 text-left">
                <span className="size-marker rounded-pill bg-brand-800 text-band-panel-ink flex items-center justify-center text-chip shrink-0 mt-0.5 shadow-xs">
                  C
                </span>
                <ChatBubble speaker="1" className="flex-1">
                  <p className="text-body text-bubble-primary-ink leading-snug">
                    &ldquo;{previewLine1}&rdquo;
                  </p>
                  {translationLocale !== "none" && (
                    <p
                      dir={isRtlLanguage(translationLocale) ? "rtl" : "ltr"}
                      className={cn(
                        "text-chip text-muted-foreground mt-1",
                        translationLocale === "bn" && "font-bangla text-bangla"
                      )}
                    >
                      {translationLocale === "bn"
                        ? "মাফ করবেন, এটার দাম কত বলতে পারেন?"
                        : (livePreviewMap[previewLine1] || "...")}
                    </p>
                  )}
                </ChatBubble>
              </div>

              {/* Bubble 2: Shop Assistant (Speaker 2) */}
              <div className="flex items-start gap-2.5 justify-end">
                <ChatBubble speaker="2" className="flex-1 text-left">
                  <p className="text-body text-topic-ink leading-snug">
                    &ldquo;{previewLine2}&rdquo;
                  </p>
                  {translationLocale !== "none" && (
                    <p
                      dir={isRtlLanguage(translationLocale) ? "rtl" : "ltr"}
                      className={cn(
                        "text-chip text-topic-ink/80 mt-1",
                        translationLocale === "bn" && "font-bangla text-bangla"
                      )}
                    >
                      {translationLocale === "bn"
                        ? "অবশ্যই! এটা ৪৫ ডলার, এবং ১০% ছাড় আছে।"
                        : (livePreviewMap[previewLine2] || "...")}
                    </p>
                  )}
                </ChatBubble>
                <span className="size-marker rounded-pill bg-sun-500 text-brand-950 flex items-center justify-center text-chip shrink-0 mt-0.5 shadow-xs">
                  S
                </span>
              </div>
            </Panel>
          </div>
        </TopicCard>
      </div>

      {/* 4. Row 3: Vocabulary CTA Card + Quiz CTA Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Vocabulary CTA Card */}
        <Card className="p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Bookmark02Icon} size={20} />
              </div>
              <Badge variant="neutral" size="sm">
                {locale === "bn" ? "৪০ ম্যাজিক কার্ড" : "40 Magic Cards"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground">
                {locale === "bn"
                  ? "আমার শব্দভান্ডার ও ম্যাজিক কার্ড"
                  : "Vocabulary & Magic Cards"}
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                {locale === "bn"
                  ? "৪০টি থিমযুক্ত ম্যাজিক কার্ড থেকে নতুন শব্দ শিখুন, পছন্দের ক্যাটাগরিতে সেভ করুন এবং ফ্ল্যাশকার্ড রিভিউ দিন।"
                  : "Explore 40 themed Magic Cards, organize saved words by category, and review daily flashcards."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/vocabulary" className="block w-full sm:w-auto">
              <Button variant="default" size="md" className="btn-press w-full sm:w-auto gap-2 cursor-pointer">
                <span>{locale === "bn" ? "শব্দভান্ডার দেখুন" : "Open Vocabulary"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quiz CTA Card */}
        <Card className="p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={20} />
              </div>
              <Badge variant="neutral" size="sm">
                {locale === "bn" ? "১০–৩০টি প্রশ্ন" : "10–30 Questions"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground">
                {locale === "bn"
                  ? "কথোপকথন কুইজ অনুশীলন"
                  : "Conversation Quiz Practice"}
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                {locale === "bn"
                  ? "প্রতিটি কথোপকথনের লেভেল, স্টাইল ও দৈর্ঘ্য অনুযায়ী কুইজ প্র্যাকটিস করে ভুল ও সঠিক উত্তর যাচাই করুন।"
                  : "Practice quizzes tailored to every conversation's CEFR level, style, and length with instant score review."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/quiz" className="block w-full sm:w-auto">
              <Button variant="default" size="md" className="btn-press w-full sm:w-auto gap-2 cursor-pointer">
                <span>{locale === "bn" ? "কুইজ প্র্যাকটিস করুন" : "Open Quiz Practice"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
