import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Bookmark02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import { SEED_DIALOGUES } from "@/content/seed/dialogues";
import { ConversationReader } from "@/components/learning/ConversationReader";

interface ScenarioDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SEED_SCENARIOS.map((scenario) => ({
    slug: scenario.slug,
  }));
}

export default async function ScenarioDetailPage({ params }: ScenarioDetailPageProps) {
  const { slug } = await params;
  const scenario = SEED_SCENARIOS.find((s) => s.slug === slug);

  if (!scenario) {
    notFound();
  }

  // Fetch dialogue versions for this scenario, or provide fallback
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

      {/* Interactive Conversation Reader (The Hero Learning Loop) */}
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
