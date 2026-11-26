import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GRAMMAR_STAGES } from "@/lib/grammar/learning-path";
import { getLessonsByStage, getStageBySlug } from "@/lib/grammar/learning-path-data";
import { GrammarStageLessonClient } from "@/components/grammar/GrammarStageLessonClient";

export function generateStaticParams() {
  return GRAMMAR_STAGES.map((stage) => ({
    stage: stage.slug,
  }));
}

async function GrammarStageContent({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage: slug } = await params;
  const stage = getStageBySlug(slug);

  if (!stage) {
    notFound();
  }

  const lessons = getLessonsByStage(stage.stageNumber);

  return <GrammarStageLessonClient stage={stage} lessons={lessons} />;
}

export default function GrammarStagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <GrammarStageContent params={params} />
    </Suspense>
  );
}
