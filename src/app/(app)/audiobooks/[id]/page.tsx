import { AudioBookReaderClient } from "@/components/audiobooks/AudioBookReaderClient";

export default async function AudioBookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AudioBookReaderClient bookId={decodeURIComponent(id)} />;
}
