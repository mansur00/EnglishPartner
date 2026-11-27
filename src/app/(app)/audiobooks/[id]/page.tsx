import { Suspense } from "react";
import { SEED_AUDIOBOOKS } from "@/content/seed/audiobooks-seed";
import { AudioBookReaderClient } from "@/components/audiobooks/AudioBookReaderClient";

export function generateStaticParams() {
  return SEED_AUDIOBOOKS.map((item) => ({
    id: item.id,
  }));
}

async function AudioBookDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AudioBookReaderClient bookId={decodeURIComponent(id)} />;
}

export default function AudioBookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="container-app py-10 text-meta text-muted-foreground">
          Loading Audio Book...
        </div>
      }
    >
      <AudioBookDetailContent params={params} />
    </Suspense>
  );
}
