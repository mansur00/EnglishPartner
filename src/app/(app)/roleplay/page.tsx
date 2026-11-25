import { RoleplayPartner } from "@/components/tools/RoleplayPartner";

export const metadata = {
  title: "AI Conversation Partner (Roleplay) — EnglishPartner",
  description: "Practice real-life English conversations with an interactive AI partner and get instant gentle corrections and feedback.",
};

export default function RoleplayPage() {
  return (
    <div className="w-full lg:pr-80 xl:pr-96">
      <div className="w-full px-4 sm:px-6 lg:px-9 py-6 pb-16">
        <RoleplayPartner />
      </div>
    </div>
  );
}
