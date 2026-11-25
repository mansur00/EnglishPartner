import { Suspense } from "react";
import { ConversationQuizPlayClient } from "@/components/quiz/ConversationQuizPlayClient";
import { LoadingBox } from "@/components/shared/LoadingBox";

export default function ConversationQuizPlayPage() {
  return (
    <Suspense fallback={<LoadingBox message="Preparing quiz..." />}>
      <ConversationQuizPlayClient />
    </Suspense>
  );
}
