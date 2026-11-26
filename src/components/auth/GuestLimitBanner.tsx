"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n";

interface GuestLimitBannerProps {
  previewPercent?: number;
  featureName?: string;
  nextPath?: string;
}

export function GuestLimitBanner({
  previewPercent = 5,
  featureName,
  nextPath = "/dashboard",
}: GuestLimitBannerProps) {
  const locale = useLocale();
  const isBn = locale === "bn";

  return (
    <Card className="p-4 sm:p-5 bg-primary/10 border border-primary/25 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand" size="sm">
            {isBn ? `গেস্ট প্রিভিউ (${previewPercent}%)` : `Guest Preview (${previewPercent}%)`}
          </Badge>
          {featureName && (
            <span className="text-chip font-semibold text-foreground">{featureName}</span>
          )}
        </div>
        <p className="text-meta text-foreground">
          {isBn
            ? `গেস্ট মোডে আপনি ${previewPercent}% ফিচার ট্রাই করতে পারবেন এবং রিলোড দিলে সেশন রিসেট হবে। সম্পূর্ণ অ্যাক্সেস ও প্রোগ্রেস সেভ করতে লগইন করুন।`
            : `In Guest mode you can preview ${previewPercent}% of this feature with no saved progress (resets on reload). Log in to unlock 100% and save your progress.`}
        </p>
      </div>

      <Link href={`/auth/login?next=${encodeURIComponent(nextPath)}`} className="shrink-0">
        <Button type="button" variant="cta" size="sm" className="gap-1.5">
          <HugeiconsIcon icon={Login01Icon} size={15} />
          <span>{isBn ? "লগইন / সাইন-আপ" : "Log in / Sign up"}</span>
        </Button>
      </Link>
    </Card>
  );
}

export function GuestLockedCard({
  titleEn = "Log in to Continue",
  titleBn = "সম্পূর্ণ ফিচার পেতে লগইন করুন",
  nextPath = "/dashboard",
}: {
  titleEn?: string;
  titleBn?: string;
  nextPath?: string;
}) {
  const locale = useLocale();
  const isBn = locale === "bn";

  return (
    <Card className="p-6 bg-card border border-border rounded-card text-center space-y-3">
      <div className="mx-auto size-11 rounded-control bg-primary/10 text-primary flex items-center justify-center">
        <HugeiconsIcon icon={SparklesIcon} size={22} />
      </div>
      <h3 className="font-heading text-card-title text-foreground">
        {isBn ? titleBn : titleEn}
      </h3>
      <p className="text-meta text-muted-foreground max-w-md mx-auto">
        {isBn
          ? "আপনার গেস্ট প্রিভিউ (৫%) শেষ হয়েছে। সব লেসন, AI কোচ এবং আপনার ব্যক্তিগত প্রোগ্রেস সেভ করতে লগইন করুন।"
          : "You've reached the 5% Guest preview limit. Sign in to unlock full access and keep your personal progress."}
      </p>
      <Link href={`/auth/login?next=${encodeURIComponent(nextPath)}`}>
        <Button type="button" variant="cta" size="md" className="gap-2">
          <HugeiconsIcon icon={Login01Icon} size={16} />
          <span>{isBn ? "লগইন করুন" : "Log in to Unlock"}</span>
        </Button>
      </Link>
    </Card>
  );
}
