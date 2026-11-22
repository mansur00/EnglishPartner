import { PageContainer } from "@/components/shared";
import { RoleplayPartner } from "@/components/tools/RoleplayPartner";

export const metadata = {
  title: "AI Conversation Partner (Roleplay) — EnglishPartner",
  description: "Practice real-life English conversations with an interactive AI partner and get instant gentle corrections and feedback.",
};

export default function RoleplayPage() {
  return (
    <PageContainer className="py-6 sm:py-10 pb-16">
      <RoleplayPartner />
    </PageContainer>
  );
}
