import { PageContainer } from "@/components/shared";
import { WhatShouldISay } from "@/components/tools/WhatShouldISay";

export const metadata = {
  title: "What Should I Say? — EnglishPartner",
  description: "Describe what you want to say in Bangla or English and get natural, polite, and casual expressions.",
};

export default function WhatShouldISayPage() {
  return (
    <PageContainer className="py-6 sm:py-10 pb-16">
      <WhatShouldISay />
    </PageContainer>
  );
}
