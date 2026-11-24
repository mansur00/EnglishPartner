"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { t, useTranslations, useLiveTranslations } from "@/lib/i18n";
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
  EmojiTile,
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
  CheckmarkCircle02Icon,
  CompassIcon,
  Message01Icon,
} from "@hugeicons/core-free-icons";

export function DashboardClient() {
  const { locale, translationLocale } = useTranslations();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  const previewLine1 = "Excuse me, could you tell me how much this costs?";
  const previewLine2 = "Certainly! It is forty-five dollars with a 10% discount.";
  const needsLivePreview = translationLocale !== "none" && translationLocale !== "bn";
  const { translations: livePreviewMap } = useLiveTranslations(
    needsLivePreview ? [previewLine1, previewLine2] : [],
    needsLivePreview ? translationLocale : "none"
  );

  useEffect(() => {
    let resolvedCompleted: string[] = [];
    try {
      const storedCompleted = localStorage.getItem("ecp_completed_steps");
      if (storedCompleted) {
        const parsed = JSON.parse(storedCompleted);
        if (Array.isArray(parsed)) resolvedCompleted = parsed;
      }
    } catch {
      // LocalStorage unavailable
    }

    queueMicrotask(() => {
      setCompletedSteps(resolvedCompleted);
      setIsClient(true);
    });
  }, []);

  return (
    <div className="w-full pb-16">
      {/* 1. Curved Deep-Violet Header Band (Reference 1 Layout Motif: Full Width of Main Area) */}
      <HeroBand>
        <PageContainer>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-page-title text-band-panel-ink">
                {t("dashboard.heroTitle", locale)}
              </h1>
              <p className="text-meta text-band-panel-ink/80 mt-1.5">
                {t("dashboard.heroSubtitle", locale)}
              </p>
            </div>

            {/* Gamification Stats: Single Combined "Today" Panel (Section 3.5) */}
            <TodayPanel />
          </div>
        </PageContainer>
      </HeroBand>

      {/* Main Content Area Overlapping Header Band by 24px */}
      <PageContainer className="overlap-band relative z-10 space-y-8">
        {/* 2. Today's Recommended Conversation (Hero with Rainbow Border & Sunny Yellow CTA) */}
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

                <div className="pt-2">
                  <Link href="/conversations/asking-price-product-details">
                    <Button variant="cta" size="lg" className="btn-press w-full sm:w-auto shadow-xs gap-2">
                      <HugeiconsIcon icon={PlayCircleIcon} size={20} />
                      <span>{t("dashboard.startConversation", locale)}</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Mini Interactive Dialogue Preview */}
              <Panel variant="topic" className="lg:col-span-5 p-5 space-y-3">
                <div className="flex items-center justify-between text-meta text-topic-ink uppercase tracking-wider pb-2 border-b border-border">
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Message01Icon} size={16} />
                    {t("dashboard.dialoguePreview", locale)}
                  </span>
                  <span className="text-meta">2 {t("dashboard.turnsUnit", locale)}</span>
                </div>

                {/* Bubble 1: Customer (Speaker 1) */}
                <div className="flex items-start gap-2.5 text-left">
                  <span className="size-marker rounded-pill bg-brand-800 text-band-panel-ink flex items-center justify-center text-chip shrink-0 mt-0.5 shadow-xs">
                    C
                  </span>
                  <ChatBubble speaker="1">
                    <p className="text-card-title text-bubble-primary-ink">
                      &ldquo;Excuse me, could you tell me how much this costs?&rdquo;
                    </p>
                    {translationLocale !== "none" && (
                      <p
                        dir={isRtlLanguage(translationLocale) ? "rtl" : "ltr"}
                        className={cn(
                          "text-meta text-muted-foreground mt-1",
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
                <div className="flex items-start gap-2.5 justify-end text-right">
                  <ChatBubble speaker="2">
                    <p className="text-card-title text-topic-ink">
                      &ldquo;Certainly! It is forty-five dollars with a 10% discount.&rdquo;
                    </p>
                    {translationLocale !== "none" && (
                      <p
                        dir={isRtlLanguage(translationLocale) ? "rtl" : "ltr"}
                        className={cn(
                          "text-meta text-topic-ink/80 mt-1",
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

        {/* 3. Explore Modules Grid (Soft Pastel Topic Panels - Reference 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Everyday English Module (Mint Topic) */}
          <TopicCard
            topic="social"
            className="card-hover flex flex-col justify-between p-6 md:p-7 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <EmojiTile emoji="☕" />
                <Badge variant="brand" size="md">
                  {t("dashboard.everydayBadge", locale)}
                </Badge>
              </div>
              <h3 className="text-card-title text-foreground">
                {t("dashboard.everydayTitle", locale)}
              </h3>
              <p className="text-body text-muted-foreground mt-1.5 leading-relaxed">
                {t("dashboard.everydayDesc", locale)}
              </p>

              {/* Progress bar motif */}
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-meta text-topic-ink mb-1.5">
                  <span>{t("dashboard.activeTrackProgress", locale)}</span>
                  <span>40% {t("dashboard.percentComplete", locale)}</span>
                </div>
                <div className="h-segment w-full bg-topic-tile rounded-pill overflow-hidden">
                  <div className="h-full bg-topic-accent rounded-pill w-progress-40" />
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-border">
              <Link href="/explore">
                <Button variant="default" size="md" className="btn-press w-full justify-between">
                  <span>{t("dashboard.browseEveryday", locale)}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                </Button>
              </Link>
            </div>
          </TopicCard>

          {/* Professional English Module (Lilac Topic) */}
          <TopicCard
            topic="pro"
            className="card-hover flex flex-col justify-between p-6 md:p-7 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <EmojiTile emoji="💼" />
                <Badge variant="brand" size="md">
                  {t("dashboard.professionalBadge", locale)}
                </Badge>
              </div>
              <h3 className="text-card-title text-foreground">
                {t("dashboard.professionalTitle", locale)}
              </h3>
              <p className="text-body text-muted-foreground mt-1.5 leading-relaxed">
                {t("dashboard.professionalDesc", locale)}
              </p>

              {/* Progress bar motif */}
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-meta text-topic-ink mb-1.5">
                  <span>{t("dashboard.professionalTrack", locale)}</span>
                  <span>15% {t("dashboard.percentComplete", locale)}</span>
                </div>
                <div className="h-segment w-full bg-topic-tile rounded-pill overflow-hidden">
                  <div className="h-full bg-topic-accent rounded-pill w-progress-15" />
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-border">
              <Link href="/explore?category=workplace-business">
                <Button variant="default" size="md" className="btn-press w-full justify-between">
                  <span>{t("dashboard.exploreProfessional", locale)}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                </Button>
              </Link>
            </div>
          </TopicCard>
        </div>

        {/* 4. Active Progress or Actionable Empty State */}
        {isClient && completedSteps.length > 0 ? (
          <TopicCard topic="shopping" className="card-hover p-6 md:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="size-tile rounded-control emoji-tile flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-card-title text-foreground">
                      {t("dashboard.continueWhereLeft", locale)}
                    </h3>
                    <Badge variant="success" size="md">
                      {completedSteps.length} {t("dashboard.completedBadge", locale)}
                    </Badge>
                  </div>
                  <p className="text-meta text-muted-foreground mt-1">
                    {t("dashboard.step02Title", locale)}
                  </p>
                </div>
              </div>

              <Link href="/conversations/asking-discount-and-payment" className="w-full sm:w-auto">
                <Button variant="cta" size="md" className="btn-press w-full sm:w-auto gap-2">
                  <HugeiconsIcon icon={PlayCircleIcon} size={18} />
                  <span>{t("dashboard.continueStep", locale)}</span>
                </Button>
              </Link>
            </div>
          </TopicCard>
        ) : (
          <Card className="bg-card p-6 md:p-8 rounded-card">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="size-tile rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={CompassIcon} size={28} />
                </div>
                <div>
                  <h3 className="text-card-title text-foreground">
                    {t("dashboard.startFirstTitle", locale)}
                  </h3>
                  <p className="text-body text-muted-foreground mt-1 max-w-lg">
                    {t("dashboard.startFirstDesc", locale)}
                  </p>
                </div>
              </div>

              <Link href="/explore" className="w-full sm:w-auto">
                <Button variant="cta" size="md" className="btn-press w-full sm:w-auto gap-2">
                  <HugeiconsIcon icon={PlayCircleIcon} size={18} />
                  <span>{t("dashboard.startFirstConversation", locale)}</span>
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </PageContainer>
    </div>
  );
}
