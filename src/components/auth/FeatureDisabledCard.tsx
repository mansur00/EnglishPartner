"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiLockIcon } from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n";

interface FeatureDisabledCardProps {
  featureName?: string;
}

export function FeatureDisabledCard({ featureName }: FeatureDisabledCardProps) {
  const locale = useLocale();
  const isBn = locale === "bn";

  return (
    <Card className="p-6 sm:p-8 bg-card border border-border rounded-card text-center space-y-3 max-w-lg mx-auto my-6">
      <div className="mx-auto size-11 rounded-control bg-muted text-muted-foreground flex items-center justify-center">
        <HugeiconsIcon icon={AiLockIcon} size={22} />
      </div>
      <div className="flex justify-center">
        <Badge variant="warning" size="sm">
          {isBn ? "ফিচারটি বন্ধ আছে" : "Feature Disabled"}
        </Badge>
      </div>
      <h2 className="font-heading text-card-title text-foreground">
        {featureName
          ? isBn
            ? `${featureName} বর্তমানে বন্ধ রাখা হয়েছে`
            : `${featureName} is currently disabled`
          : isBn
            ? "এই ফিচারটি বর্তমানে বন্ধ রাখা হয়েছে"
            : "This feature is currently disabled"}
      </h2>
      <p className="text-meta text-muted-foreground">
        {isBn
          ? "অ্যাডমিন প্যানেল থেকে এই ফিচারটি সাময়িকভাবে বন্ধ করা হয়েছে।"
          : "An administrator has temporarily turned off access to this feature."}
      </p>
      <Link href="/dashboard">
        <Button type="button" variant="outline" size="sm">
          {isBn ? "ড্যাশবোর্ডে ফিরুন" : "Back to Dashboard"}
        </Button>
      </Link>
    </Card>
  );
}
