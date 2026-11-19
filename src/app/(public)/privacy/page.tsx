import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, SparklesIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";

export const metadata = {
  title: "Privacy Policy | English Conversation Partner",
  description: "Privacy terms and data protection policy for English Conversation Partner learners.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 flex justify-center">
      <div className="max-w-reading w-full space-y-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-label rounded-control -ml-2 mb-2">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            Back to Home
          </Button>
        </Link>

        <Card className="p-6 sm:p-8 bg-card border-border space-y-6 shadow-xs rounded-card">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-chip bg-success-bg text-success border border-success/30 mb-2">
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              <span>Learner-First Privacy</span>
            </div>
            <h1 className="text-page-title text-foreground font-sans">
              Privacy Policy (গোপনীয়তা নীতি)
            </h1>
            <p className="text-meta text-muted-foreground mt-1">
              Last Updated: November 2026 • Effective Date: Gate 1 Launch
            </p>
          </div>

          <div className="space-y-4 text-body text-muted-foreground leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-card-title text-foreground text-bangla">
                ১. উন্মুক্ত শিক্ষা ও কোনো লুকানো ট্র্যাকিং নেই (Free & Open Learning)
              </h2>
              <p>
                English Conversation Partner প্ল্যাটফর্মের সমস্ত কথোপকথন, অডিও এবং ব্যাকরণগত নির্দেশিকা দেখার জন্য কোনো অ্যাকাউন্ট তৈরি বা ব্যক্তিগত তথ্য দেওয়া বাধ্যতামূলক নয়। আমরা কোনো গোপন বিজ্ঞাপন ট্র্যাকার বা থার্ড-পার্টি ডেটা ব্রোকার ব্যবহার করি না।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-card-title text-foreground text-bangla">
                ২. গেস্ট ডেটা সংরক্ষণ (Guest Storage)
              </h2>
              <p>
                আপনি যদি সাইন-ইন ছাড়া শব্দ সেভ করেন বা বুকমার্ক করেন, তবে সেই তথ্য সম্পূর্ণ আপনার ডিভাইসের ব্রাউজারে (<code className="text-chip bg-muted px-1.5 py-0.5 rounded-control font-mono text-foreground">localStorage</code>) সংরক্ষিত থাকে। এই তথ্য আমাদের সার্ভারে পাঠানো হয় না।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-card-title text-foreground text-bangla">
                ৩. নিবন্ধিত অ্যাকাউন্ট ও ক্লাউড সিঙ্ক (Registered Users)
              </h2>
              <p>
                আপনি যখন ঐচ্ছিকভাবে সাইন-ইন করবেন, তখন আপনার নাম, ইমেইল এবং বুকমার্কসমূহ সুসংরক্ষিতভাবে ক্লাউড ডেটাবেজে সংরক্ষিত থাকে যাতে আপনি যেকোনো ডিভাইসে আপনার শেখার ধারাবাহিকতা বজায় রাখতে পারেন।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-card-title text-foreground text-bangla">
                ৪. অডিও ও মাইক্রোফোন অনুমতি
              </h2>
              <p>
                ভবিষ্যতে স্পিচ ও ভয়েস প্র্যাকটিস মডিউলে শুধুমাত্র আপনার সুস্পষ্ট সম্মতিক্রমে মাইক্রোফোন চালু করা হবে। কোনো ব্রাউজার ভয়েস রেকর্ডিং অনুমতি ছাড়া কখনোই রেকর্ড বা সংগ্রহ করা হবে না।
              </p>
            </section>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-chip text-muted-foreground">
            <span className="flex items-center gap-1.5 text-success">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={15} />
              GDPR & Privacy Compliant
            </span>
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

