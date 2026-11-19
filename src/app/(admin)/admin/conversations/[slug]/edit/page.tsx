import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import { SEED_DIALOGUES } from "@/content/seed/dialogues";
import { ConversationEditorClient } from "@/components/admin/ConversationEditorClient";

interface ConversationEditorPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SEED_SCENARIOS.map((s) => ({ slug: s.slug }));
}

export default async function ConversationEditorPage({
  params,
}: ConversationEditorPageProps) {
  const { slug } = await params;
  const scenario = SEED_SCENARIOS.find((s) => s.slug === slug);
  if (!scenario) {
    notFound();
  }

  const versions = SEED_DIALOGUES[slug];
  const initialVersion = versions?.[0] || {
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
        englishText: `Hello! I would like to ask about ${scenario.title.toLowerCase()}.`,
        translationBn: `হ্যালো! আমি ${scenario.titleBn.toLowerCase()} সম্পর্কে জানতে চাই।`,
      },
      {
        id: `${slug}-l2`,
        sequenceNumber: 2,
        speakerId: "spk-2",
        englishText: "Certainly! I would be very happy to assist you today.",
        translationBn: "অবশ্যই! আজ আপনাকে সাহায্য করতে পেরে আমি আনন্দিত হব।",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <Suspense fallback={<div className="p-8 text-center text-meta text-muted-foreground">Loading editor...</div>}>
        <ConversationEditorClient
          scenario={scenario}
          initialVersion={initialVersion}
        />
      </Suspense>
    </div>
  );
}
