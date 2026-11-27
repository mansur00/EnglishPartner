import { AudioBooksClient } from "@/components/audiobooks/AudioBooksClient";

export const metadata = {
  title: "Audio Books & Story Books | EnglishPartner",
  description:
    "Improve English listening with uploaded audio lessons and 400–1000 word story books with live synchronized text.",
};

export default function AudioBooksPage() {
  return <AudioBooksClient />;
}
