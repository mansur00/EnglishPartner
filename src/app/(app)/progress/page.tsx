import { PageContainer } from "@/components/shared";
import { ProgressDashboard } from "@/components/analytics/ProgressDashboard";

export const metadata = {
  title: "My Progress & Analytics — EnglishPartner",
  description: "View your English learning streak, vocabulary retention rate, practice accuracy, and personalized AI recommendations.",
};

export default function ProgressPage() {
  return (
    <PageContainer className="py-6 sm:py-10 pb-16">
      <ProgressDashboard />
    </PageContainer>
  );
}
