"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  Clock01Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { LocaleTitle } from "@/components/shared";
import { useLocale } from "@/lib/i18n";
import { ALL_PROFESSIONS } from "@/lib/professions/registry";

export default function ProfessionsIndexPage() {
  const locale = useLocale();

  return (
    <PageContainer className="space-y-6">
      {/* Header Row */}
      <div className="space-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Tag variant="brand" size="sm">
            Milestone 4A
          </Tag>
          <Pill variant="neutral" size="sm">
            Professional Career Paths
          </Pill>
        </div>

        <LocaleTitle
          as="h1"
          titleEn="Professional English Career Paths"
          titleBn="পেশাগত ইংরেজি ক্যারিয়ার পাথ"
          className="text-page-title text-foreground"
        />
        <p className="text-subtitle-bn text-muted-foreground">
          {locale === "bn"
            ? "কর্মক্ষেত্রে আন্তর্জাতিক ক্লায়েন্ট, সহকর্মী ও স্টেকহোল্ডারদের সাথে পেশাদার ইংরেজি কথোপকথন অনুশীলন করুন।"
            : "Practice professional English conversations with global clients, colleagues, and stakeholders in your field."}
        </p>
      </div>

      {/* Professions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ALL_PROFESSIONS.map((profession) => (
          <Card
            key={profession.slug}
            className="p-5 md:p-6 bg-card rounded-card flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs transition-all"
          >
            <div className="space-y-3">
              {/* Top Meta Row */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-pill bg-primary/10 text-primary">
                    <HugeiconsIcon icon={Briefcase01Icon} size={20} />
                  </div>
                  <div>
                    <LocaleTitle
                      as="h3"
                      titleEn={profession.name}
                      titleBn={profession.nameBn}
                      className="text-card-title text-foreground"
                    />
                  </div>
                </div>

                <Tag variant="outline" size="sm">
                  {profession.targetCefr}
                </Tag>
              </div>

              {/* Tagline & Description */}
              <p className="text-chip text-primary font-mono">
                {profession.tagline}
              </p>
              <p className="text-meta-bn text-muted-foreground leading-relaxed">
                {locale === "bn" ? profession.descriptionBn : (profession.description || profession.descriptionBn)}
              </p>

              {/* Competencies Checklist */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <span className="text-chip text-muted-foreground uppercase font-mono block">
                  {locale === "bn" ? "মূল দক্ষতা ও পরিস্থিতি:" : "Key Competencies:"}
                </span>
                <ul className="space-y-1">
                  {profession.competenciesBn.slice(0, 3).map((comp: string, cIdx: number) => (
                    <li
                      key={cIdx}
                      className="flex items-start gap-2 text-chip-bn text-foreground"
                    >
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={15}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions & Details */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-chip text-muted-foreground">
                <span className="flex items-center gap-1 font-mono">
                  <HugeiconsIcon icon={Layers01Icon} size={14} />
                  {profession.scenarioCount} {locale === "bn" ? "টি দৃশ্যপট" : "Scenarios"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <HugeiconsIcon icon={Clock01Icon} size={14} />
                  ~{profession.estimatedHours}{locale === "bn" ? " ঘণ্টা" : "h"}
                </span>
              </div>

              <Link href={`/professions/${profession.slug}`}>
                <Button
                  size="sm"
                  className="rounded-control gap-1.5 cursor-pointer text-chip"
                >
                  <span className="text-bangla">
                    {locale === "bn" ? "পাথ শুরু করুন" : "Start Path"}
                  </span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
