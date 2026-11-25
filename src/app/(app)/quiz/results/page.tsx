import { Suspense } from "react";
import { QuizResultDetailClient } from "@/components/quiz/QuizResultDetailClient";
import { LoadingBox } from "@/components/shared/LoadingBox";

export default function QuizResultDetailPage() {
  return (
    <Suspense fallback={<LoadingBox message="Loading quiz details..." />}>
      <QuizResultDetailClient />
    </Suspense>
  );
}
