import Link from "next/link";
import { Metadata } from "next";
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
import { ALL_PROFESSIONS } from "@/lib/professions/registry";

export const metadata: Metadata = {
  title: "Professional English Career Paths | EnglishPartner",
  description:
    "Explore tailored English conversation learning paths for UI/UX designers, software engineers, freelancers, healthcare workers, and educators.",
};

export default function ProfessionsIndexPage() {
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

        <h1 className="text-page-title text-foreground">
          পেশাগত ইংরেজি ক্যারিয়ার পাথ (Career Paths)
        </h1>
        <p className="text-subtitle-bn text-muted-foreground">
          কর্মক্ষেত্রে আন্তর্জাতিক ক্লায়েন্ট, সহকর্মী ও স্টেকহোল্ডারদের সাথে পেশাদার ইংরেজি কথোপকথন অনুশীলন করুন।
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
                    <h3 className="text-card-title text-foreground">
                      {profession.name}
                    </h3>
                    <p className="text-label text-muted-foreground text-bangla">
                      {profession.nameBn}
                    </p>
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
                {profession.descriptionBn}
              </p>

              {/* Competencies Checklist */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <span className="text-chip text-muted-foreground uppercase font-mono block">
                  মূল দক্ষতা ও পরিস্থিতি (Key Competencies):
                </span>
                <ul className="space-y-1">
                  {profession.competenciesBn.slice(0, 3).map((comp, cIdx) => (
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
                  {profession.scenarioCount} Scenarios
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <HugeiconsIcon icon={Clock01Icon} size={14} />
                  ~{profession.estimatedHours}h
                </span>
              </div>

              <Link href={`/professions/${profession.slug}`}>
                <Button
                  size="sm"
                  className="rounded-control gap-1.5 cursor-pointer text-chip"
                >
                  <span className="text-bangla">পাথ শুরু করুন</span>
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
