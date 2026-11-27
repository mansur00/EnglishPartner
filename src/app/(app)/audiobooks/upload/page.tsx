import { AudioBookUploadClient } from "@/components/audiobooks/AudioBookUploadClient";

export const metadata = {
  title: "Upload Audio Book | EnglishPartner",
  description: "Admin publishing studio for Audio Books and synchronized Story Books.",
};

export default function AudioBookUploadPage() {
  return <AudioBookUploadClient />;
}
