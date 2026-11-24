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
import { useTranslations } from "@/lib/i18n";
import { ALL_PROFESSIONS } from "@/lib/professions/registry";

export default function ProfessionsIndexPage() {
  const { locale, t } = useTranslations();

  return (
    <PageContainer className="space-y-6">
      {/* Header Row */}
      <div className="space-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Tag variant="brand" size="sm">
            {t("professions.trackBadge")}
          </Tag>
          <Pill variant="neutral" size="sm">
            {t("professions.careerPathBadge")}
          </Pill>
        </div>

        <LocaleTitle
          as="h1"
          titleEn="Professional English Career Paths"
          titleBn="পেশাগত ইংরেজি ক্যারিয়ার পাথ"
          className="text-page-title text-foreground"
        />
        <p className="text-subtitle-bn text-muted-foreground">
          {t("professions.subtitle")}
        </p>
      </div>

      {/* Professions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ALL_PROFESSIONS.map((profession) => {
          const competencies = locale === "bn"
            ? profession.competenciesBn
            : (profession.competenciesEn || profession.competenciesBn);

          return (
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
                  {locale === "bn" ? profession.taglineBn : profession.tagline}
                </p>
                <p className="text-meta-bn text-muted-foreground leading-relaxed">
                  {locale === "bn" ? profession.descriptionBn : (profession.description || profession.descriptionBn)}
                </p>

                {/* Competencies Checklist */}
                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <span className="text-chip text-muted-foreground uppercase font-mono block">
                    {t("professions.competenciesLabel")}:
                  </span>
                  <ul className="space-y-1">
                    {competencies.slice(0, 3).map((comp: string, cIdx: number) => (
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
                    {profession.scenarioCount} {t("professions.scenariosUnit")}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <HugeiconsIcon icon={Clock01Icon} size={14} />
                    ~{profession.estimatedHours} {t("professions.hoursUnit")}
                  </span>
                </div>

                <Link href={`/professions/${profession.slug}`}>
                  <Button
                    size="sm"
                    className="rounded-control gap-1.5 cursor-pointer text-chip"
                  >
                    <span className={locale === "bn" ? "text-bangla" : ""}>
                      {t("professions.startPath")}
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
