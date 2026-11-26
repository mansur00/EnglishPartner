"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
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
    <PageContainer className="py-6 space-y-6 pb-16">
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

        {/* Track & CEFR Level Dropdowns on One Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-border/60">
          <div className="relative">
            <select
              aria-label={locale === "bn" ? "ক্যারিয়ার ট্র্যাক নির্বাচন করুন" : "Select career track"}
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full h-11 appearance-none rounded-control border border-border bg-muted/40 pl-3.5 pr-9 text-label text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[
                { id: "all", labelEn: "Track: All Tracks", labelBn: "ট্র্যাক: সব ট্র্যাক" },
                { id: "tech", labelEn: "Track: Tech & Engineering", labelBn: "ট্র্যাক: টেক ও ইঞ্জিনিয়ারিং" },
                { id: "business", labelEn: "Track: Business & Freelance", labelBn: "ট্র্যাক: ব্যবসা ও ফ্রিল্যান্সিং" },
                { id: "service", labelEn: "Track: Healthcare", labelBn: "ট্র্যাক: স্বাস্থ্যসেবা" },
                { id: "education", labelEn: "Track: Education", labelBn: "ট্র্যাক: শিক্ষা" },
              ].map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {locale === "bn" ? cat.labelBn : cat.labelEn}
                </option>
              ))}
            </select>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              aria-label={locale === "bn" ? "CEFR লেভেল নির্বাচন করুন" : "Filter by CEFR level"}
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel(e.target.value as "all" | ProfessionCefrLevel)
              }
              className="w-full h-11 appearance-none rounded-control border border-border bg-muted/40 pl-3.5 pr-9 text-label text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CEFR_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl === "all"
                    ? locale === "bn"
                      ? "CEFR লেভেল: সব লেভেল (A1–C2)"
                      : "CEFR Level: All Levels (A1–C2)"
                    : userTargetLevel === lvl
                    ? `${locale === "bn" ? "CEFR লেভেল:" : "CEFR Level:"} ${lvl} (${locale === "bn" ? "আপনার লক্ষ্য" : "Your Target"})`
                    : `${locale === "bn" ? "CEFR লেভেল:" : "CEFR Level:"} ${lvl}`}
                </option>
              ))}
            </select>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>
      </Card>

      {/* Professions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProfessions.map((profession) => {
          const matchingScenarios = SEED_SCENARIOS.filter((s) => {
            if (s.profession?.slug !== profession.slug) return false;
            if (selectedLevel !== "all" && s.level !== selectedLevel) return false;
            return true;
          });
          const actualScenarioCount = matchingScenarios.length;

          return (
            <Card
              key={profession.slug}
              className="p-5 bg-card rounded-card flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs transition-all"
            >
              <div className="space-y-2.5">
                {/* Top Meta Row */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-pill bg-primary/10 text-primary">
                      <HugeiconsIcon icon={Briefcase01Icon} size={20} />
                    </div>
                    <LocaleTitle
                      as="h3"
                      titleEn={profession.name}
                      titleBn={profession.nameBn}
                      className="text-card-title text-foreground"
                    />
                  </div>

                  <Tag variant="outline" size="sm">
                    {profession.targetCefr}
                  </Tag>
                </div>

                {/* Concise Tagline */}
                <p className={cn("text-meta text-muted-foreground line-clamp-2", locale === "bn" && "text-bangla")}>
                  {locale === "bn" ? profession.taglineBn : profession.tagline}
                </p>
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
