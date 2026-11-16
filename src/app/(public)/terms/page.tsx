import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";

export const metadata = {
  title: "Terms of Service | English Conversation Partner",
  description: "Terms of service and usage conditions for English Conversation Partner.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--ecp-canvas)] p-4 sm:p-8 flex justify-center">
      <div className="max-w-3xl w-full space-y-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs -ml-2 mb-2">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            Back to Home
          </Button>
        </Link>

        <Card className="p-6 sm:p-8 bg-white border-ecp-border space-y-6 shadow-xs">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ecp-text-primary font-sans">
              Terms of Service (ব্যবহারের শর্তাবলী)
            </h1>
            <p className="text-xs sm:text-sm text-ecp-text-muted mt-1">
              Last Updated: November 2026 • English Conversation Partner (ECP)
            </p>
          </div>

          <div className="space-y-4 text-sm text-ecp-text-secondary leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-ecp-text-primary font-bangla">
                ১. শিক্ষামূলক উদ্দেশ্যে ব্যবহারের অধিকার (Educational Purpose)
              </h2>
              <p>
                English Conversation Partner প্ল্যাটফর্মের সমস্ত লিখিত সংলাপ, বাংলা অনুবাদ এবং অডিও উপাদান শুধুমাত্র শিক্ষার্থীদের ব্যক্তিগত ও অ-বাণিজ্যিক ভাষা শিক্ষার উদ্দেশ্যে বিনামূল্যে উন্মুক্ত রাখা হয়েছে।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-ecp-text-primary font-bangla">
                ২. বুদ্ধিবৃত্তিক সম্পত্তি ও অডিও লাইসেন্সিং (Licenses)
              </h2>
              <p>
                আমাদের অডিও সিন্থেসিস পাইপলাইন ওপেন-সোর্স Piper TTS মডেল এবং CC-BY বা পারমিশনযুক্ত ভয়েস লাইব্রেরি ব্যবহার করে প্রস্তুতকৃত। সংলাপের মূল বিন্যাস এবং বাংলা প্রাসঙ্গিক ব্যাখ্যাসমূহ ECP কন্টেন্ট দলের দ্বারা সংকলিত।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-ecp-text-primary font-bangla">
                ৩. ব্যবহারকারীর আচরণ ও অপব্যবহার রোধ
              </h2>
              <p>
                কোনো স্বয়ংক্রিয় রোবট বা স্ক্র্যাপার দিয়ে সার্ভারে অতিরিক্ত চাপ সৃষ্টি করা অথবা প্ল্যাটফর্মের নিরাপত্তা ব্যবস্থা লঙ্ঘনের চেষ্টা করা সম্পূর্ণরূপে নিষিদ্ধ।
              </p>
            </section>
          </div>

          <div className="pt-4 border-t border-ecp-border flex items-center justify-between text-xs text-ecp-text-muted">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={15} />
              Open Learning Integrity
            </span>
            <Link href="/privacy" className="text-ecp-violet hover:underline">
              Privacy Policy
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

