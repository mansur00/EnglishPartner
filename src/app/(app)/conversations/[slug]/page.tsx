import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Bookmark02Icon,
  CheckmarkCircle02Icon,
  Book01Icon,
} from "@hugeicons/core-free-icons";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import { SEED_DIALOGUES, ConversationVersionData } from "@/content/seed/dialogues";
import {
  SHOPPING_MONEY_LADDER_STEPS,
  getShoppingMoneyStepBySlug,
} from "@/content/seed/niche_shopping_money";
import { ConversationReader } from "@/components/learning/ConversationReader";
import { LadderStepContainer } from "@/components/learning/LadderStepContainer";

interface ScenarioDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const scenarioSlugs = SEED_SCENARIOS.map((scenario) => ({
    slug: scenario.slug,
  }));
  const ladderSlugs = SHOPPING_MONEY_LADDER_STEPS.map((step) => ({
    slug: step.stepSlug,
  }));
  return [...scenarioSlugs, ...ladderSlugs];
}

export default async function ScenarioDetailPage({ params }: ScenarioDetailPageProps) {
  const { slug } = await params;

  // 1. Check if slug is a 20-Step Conversation Ladder Item
  const ladderStep = getShoppingMoneyStepBySlug(slug);

  if (ladderStep) {
    const ladderVersion: ConversationVersionData = {
      versionId: ladderStep.stepSlug,
      versionName: `Step ${ladderStep.stepNumber.toString().padStart(2, "0")}`,
      level: ladderStep.level.startsWith("A1") ? "A1" : ladderStep.level.startsWith("A2") ? "A2" : "B1",
      lengthType: ladderStep.linesCount <= 6 ? "short" : ladderStep.linesCount <= 12 ? "medium" : "long",
      communicationStyle: "neutral",
      speakers: ladderStep.speakers.map((s) => ({
        id: s.id,
        name: s.name,
        nameBn: s.nameBn,
        role: s.role,
        roleBn: s.roleBn,
        avatarChar: s.avatarChar,
        colorScheme: s.colorScheme,
      })),
      lines: ladderStep.lines.map((l) => ({
        id: l.id,
        sequenceNumber: l.sequenceNumber,
        speakerId: l.speakerId,
        englishText: l.englishText,
        translationBn: l.translationBn,
        wordHighlights: [],
      })),
    };

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        {/* Top Breadcrumb & Action */}
        <div className="flex items-center justify-between">
          <Link href="/explore/category/shopping-and-money">
            <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-xs">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              Shopping Ladder (সব ধাপ)
            </Button>
          </Link>

          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <HugeiconsIcon icon={Bookmark02Icon} size={14} />
            Bookmark
          </Button>
        </div>

        {/* Step Header Card */}
        <Card className="space-y-3.5 p-6 md:p-7 bg-[var(--ecp-surface)] border-[var(--ecp-border)]">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" size="sm">
              Niche 01: Shopping & Money
            </Badge>
            <Badge variant="neutral" size="sm" className="font-mono">
              ধাপ {ladderStep.stepNumber.toString().padStart(2, "0")} / 20
            </Badge>
            <Badge variant="accent" size="sm">
              {ladderStep.level} • CEFR
            </Badge>
            <span className="text-xs text-ecp-text-muted font-medium ml-1">
              {ladderStep.linesCount} Turns
            </span>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--ecp-brand-950)]">
              {ladderStep.title}
            </h1>
            <p className="text-sm md:text-base text-[var(--ecp-text-secondary)] font-[var(--ecp-font-bangla)] mt-1 font-medium">
              {ladderStep.titleBn}
            </p>
          </div>

          {/* Grammar Focus Callout */}
          <div className="flex items-start gap-2 pt-2 text-xs text-[var(--ecp-text-secondary)] border-t border-[var(--ecp-border)]/60">
            <HugeiconsIcon
              icon={Book01Icon}
              size={16}
              className="text-ecp-violet shrink-0 mt-0.5"
            />
            <span>
              <strong className="text-[var(--ecp-text-primary)]">Grammar Focus: </strong>
              {ladderStep.focus}
            </span>
          </div>
        </Card>

        {/* Step-by-Step Interactive Learning & Practice Container */}
        <LadderStepContainer
          step={ladderStep}
          ladderVersion={ladderVersion}
        />
      </div>
    );
  }

  // 2. Regular Scenario fallback
  const scenario = SEED_SCENARIOS.find((s) => s.slug === slug);

  if (!scenario) {
    notFound();
  }

  const versions = SEED_DIALOGUES[slug] || [
    {
      versionId: `${slug}-short`,
      versionName: "Short",
      level: scenario.level,
      lengthType: "short" as const,
      communicationStyle: scenario.communicationStyle,
      speakers: [
        {
          id: "spk-1",
          name: "Speaker A",
          nameBn: "বক্তা ক",
          role: "Participant",
          roleBn: "অংশগ্রহণকারী",
          avatarChar: "A",
          colorScheme: "brand" as const,
        },
        {
          id: "spk-2",
          name: "Speaker B",
          nameBn: "বক্তা খ",
          role: "Participant",
          roleBn: "অংশগ্রহণকারী",
          avatarChar: "B",
          colorScheme: "accent" as const,
        },
      ],
      lines: [
        {
          id: `${slug}-l1`,
          sequenceNumber: 1,
          speakerId: "spk-1",
          englishText: `Hello! I would like to inquire about ${scenario.title.toLowerCase()}.`,
          translationBn: `হ্যালো! আমি ${scenario.titleBn.toLowerCase()} সম্পর্কে জানতে চাই।`,
        },
        {
          id: `${slug}-l2`,
          sequenceNumber: 2,
          speakerId: "spk-2",
          englishText: "Certainly! I would be very happy to assist you with that today.",
          translationBn: "অবশ্যই! আজ এই বিষয়ে আপনাকে সাহায্য করতে পেরে আমি আনন্দিত হব।",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-xs">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            Back to Explore
          </Button>
        </Link>

        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <HugeiconsIcon icon={Bookmark02Icon} size={14} />
          Bookmark
        </Button>
      </div>

      {/* Scenario Header Card */}
      <Card className="space-y-3.5 p-6 md:p-7 bg-[var(--ecp-surface)] border-[var(--ecp-border)]">
        <div className="flex flex-wrap items-center gap-2">
          {scenario.categories.map((cat) => (
            <Badge key={cat.id} variant="neutral" size="sm">
              {cat.name}
            </Badge>
          ))}
          <Badge variant="brand" size="sm">
            {scenario.level} • CEFR
          </Badge>
          <Badge variant="accent" size="sm" className="capitalize">
            {scenario.communicationStyle} Register
          </Badge>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--ecp-brand-950)]">
            {scenario.title}
          </h1>
          <p className="text-sm md:text-base text-[var(--ecp-text-secondary)] font-[var(--ecp-font-bangla)] mt-1">
            {scenario.titleBn}
          </p>
        </div>

        {/* Learning Objective Callout */}
        <div className="flex items-start gap-2 pt-2 text-xs text-[var(--ecp-text-secondary)] border-t border-[var(--ecp-border)]/60">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={16}
            className="text-[var(--ecp-success)] shrink-0 mt-0.5"
          />
          <span>
            <strong className="text-[var(--ecp-text-primary)]">Goal: </strong>
            {scenario.learningObjective}
          </span>
        </div>
      </Card>

      {/* Interactive Conversation Reader */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--ecp-brand-950)]">
            Dialogue Turns & Listening Practice
          </h2>
          <span className="text-xs text-[var(--ecp-text-muted)] font-medium">
            Tap words to explore meaning
          </span>
        </div>

        <ConversationReader
          versions={versions}
          scenarioTitleEn={scenario.title}
          scenarioTitleBn={scenario.titleBn}
          scenarioSlug={slug}
        />
      </div>
    </div>
  );
}
