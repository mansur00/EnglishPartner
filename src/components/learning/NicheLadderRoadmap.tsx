"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayCircle02Icon,
  ArrowRight01Icon,
  Book01Icon,
} from "@hugeicons/core-free-icons";
import { LadderStepItem } from "@/content/seed/niche_shopping_money";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NicheLadderRoadmapProps {
  steps: LadderStepItem[];
  nicheTitle: string;
  nicheTitleBn: string;
  description: string;
  descriptionBn: string;
}

export function NicheLadderRoadmap({
  steps,
  nicheTitle,
  nicheTitleBn,
  description,
  descriptionBn,
}: NicheLadderRoadmapProps) {
  // Group steps by CEFR tier
  const tiers = [
    {
      group: "A1 Beginner",
      titleBn: "প্রারম্ভিক পর্যায় (A1 Beginner) — বেসিক কুশলাদি ও কেনাকাটা",
      badgeVariant: "brand" as const,
      stepNumbers: [1, 2, 3, 4],
    },
    {
      group: "A2 Elementary",
      titleBn: "প্রাথমিক পর্যায় (A2 Elementary) — ছাড়, তুলনা ও পণ্য বিনিময়",
      badgeVariant: "accent" as const,
      stepNumbers: [5, 6, 7, 8, 9, 10],
    },
    {
      group: "B1 Intermediate",
      titleBn: "মধ্যবর্তী পর্যায় (B1 Intermediate) — শর্ত, অভিযোগ ও পরামর্শ",
      badgeVariant: "peach" as const,
      stepNumbers: [11, 12, 13, 14, 15, 16],
    },
    {
      group: "B2 Upper-Intermediate",
      titleBn: "উচ্চ-মধ্যবর্তী পর্যায় (B2) — জটিল পরিস্থিতি, কার্ড সমস্যা ও দ্বিমত",
      badgeVariant: "neutral" as const,
      stepNumbers: [17, 18, 19],
    },
    {
      group: "C1 Advanced Story",
      titleBn: "উন্নত গল্প ও বাস্তব আলাপন (Story Arc) — পূর্ণাঙ্গ মানবিক গল্প",
      badgeVariant: "brand" as const,
      stepNumbers: [20],
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Niche Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-ecp-border shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand" size="sm">
            Niche 01 • Pilot Track
          </Badge>
          <Badge variant="accent" size="sm">
            20-Step Progressive Ladder
          </Badge>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            A1 to C1 Complete
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ecp-text-primary tracking-tight font-sans">
            {nicheTitle}
          </h1>
          <p className="text-base sm:text-lg font-bangla text-ecp-text-secondary mt-1 font-medium">
            {nicheTitleBn}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-ecp-text-secondary max-w-2xl leading-relaxed">
            {description}
          </p>
          <p className="text-xs sm:text-sm text-ecp-text-muted max-w-2xl leading-relaxed font-bangla">
            {descriptionBn}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link href={`/conversations/${steps[0]?.stepSlug}`}>
            <Button className="gap-2 font-bangla text-xs sm:text-sm">
              <HugeiconsIcon icon={PlayCircle02Icon} size={16} />
              <span>ধাপ ০১ থেকে শুরু করুন (Start Step 01)</span>
            </Button>
          </Link>
          <span className="text-xs text-ecp-text-muted font-bangla">
            প্রতিটি ধাপ শেষ হলে &ldquo;পরবর্তী ধাপ&rdquo; বাটনে স্বয়ংক্রিয়ভাবে পরের কথোপকথনে যাওয়া যাবে
          </span>
        </div>
      </div>

      {/* Ladder Tiers */}
      <div className="space-y-8">
        {tiers.map((tier) => {
          const tierSteps = steps.filter((s) => tier.stepNumbers.includes(s.stepNumber));
          if (tierSteps.length === 0) return null;

          return (
            <div key={tier.group} className="space-y-3">
              {/* Tier Section Header */}
              <div className="flex items-center gap-2.5 px-1">
                <Badge variant={tier.badgeVariant} size="sm">
                  {tier.group}
                </Badge>
                <h3 className="text-sm font-bold text-ecp-text-primary font-bangla">
                  {tier.titleBn}
                </h3>
              </div>

              {/* Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {tierSteps.map((step) => {
                  return (
                    <div
                      key={step.stepSlug}
                      className="p-5 rounded-2xl bg-white border border-ecp-border hover:border-ecp-violet hover:shadow-xs transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ecp-violet bg-ecp-violet-surface px-2.5 py-1 rounded-lg">
                            <HugeiconsIcon icon={Book01Icon} size={13} />
                            Step {step.stepNumber.toString().padStart(2, "0")}
                          </span>
                          <span className="text-xs font-semibold text-ecp-text-muted">
                            {step.linesCount} lines · {step.level}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-ecp-text-primary group-hover:text-ecp-violet transition-colors font-sans">
                            {step.title}
                          </h4>
                          <p className="text-xs font-bangla text-ecp-text-secondary mt-0.5 line-clamp-1">
                            {step.titleBn}
                          </p>
                        </div>

                        {/* Grammar Focus Pill */}
                        <div className="bg-ecp-bg-canvas p-2.5 rounded-xl border border-ecp-border text-xs text-ecp-text-secondary">
                          <span className="font-semibold text-ecp-text-primary block mb-0.5">
                            Grammar Focus:
                          </span>
                          <span className="italic leading-snug block line-clamp-2">
                            {step.focus}
                          </span>
                        </div>
                      </div>

                      {/* Speakers & Action */}
                      <div className="pt-3.5 mt-3 border-t border-ecp-border flex items-center justify-between gap-2">
                        <div className="text-xs text-ecp-text-muted truncate">
                          বক্তা: {step.speakers.map((s) => s.name).join(", ")}
                        </div>

                        <Link href={`/conversations/${step.stepSlug}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs gap-1 text-ecp-violet group-hover:bg-ecp-violet-surface font-bangla -mr-2 cursor-pointer"
                          >
                            <span>অনুশীলন করুন</span>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
