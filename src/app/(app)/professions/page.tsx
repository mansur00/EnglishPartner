"use client";

import { useState, useEffect } from "react";
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
import { ALL_PROFESSIONS, type ProfessionCefrLevel } from "@/lib/professions/registry";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import { cn } from "@/lib/utils";

const CEFR_LEVELS: readonly ("all" | ProfessionCefrLevel)[] = ["all", "A1", "A2", "B1", "B2", "C1", "C2"];

export default function ProfessionsIndexPage() {
  const { locale, t } = useTranslations();
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<"all" | ProfessionCefrLevel>("all");
  const [userTargetLevel, setUserTargetLevel] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem("ecp_user_target_level");
        if (saved && ["A1", "A2", "B1", "B2", "C1", "C2"].includes(saved)) {
          setUserTargetLevel(saved);
        }
      } catch {
        // Ignore storage errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredProfessions = ALL_PROFESSIONS.filter((p) => {
    if (selectedCat !== "all" && p.category !== selectedCat) return false;
    if (selectedLevel !== "all" && !p.supportedLevels.includes(selectedLevel)) return false;
    return true;
  });

  return (
    <PageContainer className="space-y-6">
      {/* Unified Header & Filters Card */}
      <Card className="p-5 sm:p-6 bg-card border border-border space-y-4 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Tag variant="brand" size="sm">
                {t("professions.trackBadge")}
              </Tag>
              <Pill variant="neutral" size="sm">
                {t("professions.careerPathBadge")}
              </Pill>
            </div>
            <Pill variant="neutral" size="sm" className="font-mono">
              {filteredProfessions.length} {locale === "bn" ? "টি ট্র্যাক" : "Tracks"}
            </Pill>
          </div>

          <LocaleTitle
            as="h1"
            titleEn="Professional English Career Paths"
            titleBn="পেশাগত ইংরেজি ক্যারিয়ার পাথ"
            className="text-page-title text-foreground"
          />
          <p className={cn("text-meta text-muted-foreground", locale === "bn" && "text-subtitle-bn")}>
            {t("professions.subtitle")}
          </p>
        </div>

        {/* Category Track Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
          {[
            { id: "all", labelEn: "All Tracks", labelBn: "সব ট্র্যাক" },
            { id: "tech", labelEn: "Tech & Engineering", labelBn: "টেক ও ইঞ্জিনিয়ারিং" },
            { id: "business", labelEn: "Business & Freelance", labelBn: "ব্যবসা ও ফ্রিল্যান্সিং" },
            { id: "service", labelEn: "Healthcare", labelBn: "স্বাস্থ্যসেবা" },
            { id: "education", labelEn: "Education", labelBn: "শিক্ষা" },
          ].map((cat) => {
            const active = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-pill text-chip transition-all cursor-pointer",
                  active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {locale === "bn" ? cat.labelBn : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* CEFR Level Filter Pills (A1 - C2) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-chip text-muted-foreground mr-1 font-mono">
            {locale === "bn" ? "লেভেল:" : "CEFR Level:"}
          </span>
          {CEFR_LEVELS.map((lvl) => {
            const active = selectedLevel === lvl;
            const isUserLevel = userTargetLevel === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={cn(
                  "px-2.5 py-1 rounded-control text-chip font-mono transition-all cursor-pointer",
                  active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : isUserLevel
                    ? "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {lvl === "all" ? (locale === "bn" ? "সব লেভেল" : "All Levels") : lvl}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Professions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProfessions.map((profession) => {
          const competencies = locale === "bn"
            ? profession.competenciesBn
            : (profession.competenciesEn || profession.competenciesBn);
          const matchingScenarios = SEED_SCENARIOS.filter((s) => {
            if (s.profession?.slug !== profession.slug) return false;
            if (selectedLevel !== "all" && s.level !== selectedLevel) return false;
            return true;
          });
          const actualScenarioCount = matchingScenarios.length;

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
                <p className={cn("text-meta text-muted-foreground leading-relaxed", locale === "bn" && "text-meta-bn")}>
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
                        className={cn("flex items-start gap-2 text-chip text-foreground", locale === "bn" && "text-chip-bn")}
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
                    {actualScenarioCount} {t("professions.scenariosUnit")}
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
