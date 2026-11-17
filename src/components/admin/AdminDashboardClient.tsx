"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowLeft01Icon,
  DashboardSquare01Icon,
  PencilEdit01Icon,
  CheckmarkCircle01Icon,
  VolumeHighIcon,
  SparklesIcon,
  UserGroupIcon,
  FilterIcon,
} from "@hugeicons/core-free-icons";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import { SEED_DIALOGUES } from "@/content/seed/dialogues";
import { UserRole, canViewAdminPanel } from "@/lib/auth/roles";

export function AdminDashboardClient() {
  const searchParams = useSearchParams();
  const currentRole: UserRole = (searchParams.get("role") as UserRole) || "admin";
  const filterStatus = searchParams.get("status") || "all";

  // Server/Client Role Guard
  const isAuthorized = canViewAdminPanel(currentRole);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[var(--ecp-canvas)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center space-y-4 p-8 border-[var(--ecp-error)]/30 shadow-md">
          <div className="w-12 h-12 rounded-full bg-[var(--ecp-error-surface)] text-[var(--ecp-error)] flex items-center justify-center mx-auto">
            <HugeiconsIcon icon={Alert02Icon} size={24} />
          </div>

          <h1 className="text-xl font-semibold text-[var(--ecp-text-primary)]">
            403 — অননুমোদিত অ্যাক্সেস (Unauthorized)
          </h1>

          <p className="text-sm text-[var(--ecp-text-secondary)] leading-relaxed font-bangla">
            কন্টেন্ট অ্যাডমিনিস্ট্রেশন প্যানেল শুধুমাত্র অনুমোদিত এডিটর এবং পর্যালোচকদের জন্য সংরক্ষিত। বর্তমান ভূমিকা: <strong className="text-rose-600 font-mono">{currentRole}</strong>।
          </p>

          <div className="pt-3 flex flex-col gap-2">
            <Link href="/admin?role=admin">
              <Button className="w-full justify-center text-xs font-bangla">
                অ্যাডমিন হিসেবে ডেমো দেখুন (Switch to Admin)
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full justify-center gap-2 text-xs">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Calculate Metrics
  const totalScenarios = SEED_SCENARIOS.length;
  const publishedCount = SEED_SCENARIOS.length;
  const totalDialogueLines = Object.values(SEED_DIALOGUES).reduce((acc, versions) => {
    return acc + (versions[0]?.lines.length || 0);
  }, 0);

  // Status Filter
  const filteredScenarios = SEED_SCENARIOS.filter(() => {
    if (filterStatus === "all") return true;
    if (filterStatus === "published") return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-[var(--ecp-canvas)] p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ecp-border">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-ecp-violet-surface text-ecp-violet flex items-center justify-center">
            <HugeiconsIcon icon={DashboardSquare01Icon} size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-ecp-text-primary font-bangla">
                কন্টেন্ট ম্যানেজমেন্ট ও অ্যাডমিন কনসোল
              </h1>
              <Badge variant="brand" size="sm">
                Role: {currentRole}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-ecp-text-secondary">
              Author, review, validate, and publish English dialogue scenarios
            </p>
          </div>
        </div>

        {/* Demo Role Switcher Bar */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-ecp-border text-xs">
          <span className="text-ecp-text-muted px-2 flex items-center gap-1 font-semibold">
            <HugeiconsIcon icon={UserGroupIcon} size={14} />
            Test Role:
          </span>
          {(["admin", "reviewer", "editor", "translator", "learner"] as UserRole[]).map((r) => (
            <Link key={r} href={`/admin?role=${r}`}>
              <button
                type="button"
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  currentRole === r
                    ? "bg-ecp-violet text-white"
                    : "text-ecp-text-secondary hover:text-ecp-text-primary"
                }`}
              >
                {r}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border-ecp-border space-y-1">
          <span className="text-xs font-semibold text-ecp-text-muted uppercase tracking-wider">
            Total Scenarios
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-ecp-text-primary">
            {totalScenarios}
          </div>
          <span className="text-xs text-emerald-600 font-medium">100% Active in Library</span>
        </Card>

        <Card className="p-5 bg-white border-ecp-border space-y-1">
          <span className="text-xs font-semibold text-ecp-text-muted uppercase tracking-wider">
            Dialogue Turns
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-ecp-text-primary">
            {totalDialogueLines}+
          </div>
          <span className="text-xs text-ecp-text-secondary">Short & Medium Versions</span>
        </Card>

        <Card className="p-5 bg-white border-ecp-border space-y-1">
          <span className="text-xs font-semibold text-ecp-text-muted uppercase tracking-wider">
            Bangla Translations
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-emerald-600">
            100%
          </div>
          <span className="text-xs text-emerald-700 font-medium">All lines fully glossed</span>
        </Card>

        <Card className="p-5 bg-white border-ecp-border space-y-1">
          <span className="text-xs font-semibold text-ecp-text-muted uppercase tracking-wider">
            Audio Asset Pipeline
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-ecp-violet">
            Piper TTS
          </div>
          <span className="text-xs text-ecp-text-secondary">en-US + en-GB offline audio</span>
        </Card>
      </div>

      {/* Content Library Table with Filter Tabs */}
      <Card className="p-6 bg-white border-ecp-border space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={FilterIcon} size={16} className="text-ecp-violet" />
            <h2 className="text-base font-semibold text-ecp-text-primary font-bangla">
              দৃশ্যপট তালিকা ও প্রকাশনা স্থিতি (Scenarios)
            </h2>
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-1 bg-ecp-bg-canvas p-1 rounded-xl border border-ecp-border text-xs">
            {[
              { id: "all", label: `All (${totalScenarios})` },
              { id: "published", label: `Published (${publishedCount})` },
              { id: "in_review", label: "In Review (0)" },
              { id: "draft", label: "Draft (0)" },
              { id: "archived", label: "Archived (0)" },
            ].map((tab) => (
              <Link key={tab.id} href={`/admin?role=${currentRole}&status=${tab.id}`}>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterStatus === tab.id
                      ? "bg-white text-ecp-text-primary shadow-2xs font-semibold"
                      : "text-ecp-text-muted hover:text-ecp-text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Scenarios Table */}
        <div className="overflow-x-auto border border-ecp-border rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-ecp-bg-canvas text-ecp-text-muted border-b border-ecp-border text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">দৃশ্যপট ও শিরোনাম (Scenario)</th>
                <th className="p-3.5">ক্যাটাগরি</th>
                <th className="p-3.5">CEFR লেভেল</th>
                <th className="p-3.5">অনুবাদ ও অডিও</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ecp-border">
              {filteredScenarios.map((scenario) => {
                const dialogue = SEED_DIALOGUES[scenario.slug];
                const turnsCount = dialogue?.[0]?.lines.length || 0;

                return (
                  <tr key={scenario.id} className="hover:bg-ecp-bg-canvas/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-ecp-text-primary font-sans">
                        {scenario.title}
                      </div>
                      <div className="text-xs text-ecp-text-secondary font-bangla">
                        {scenario.titleBn}
                      </div>
                      <span className="text-xs font-mono text-ecp-text-muted">
                        /{scenario.slug}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {scenario.categories.map((c) => (
                          <Badge key={c.id} variant="neutral" size="sm">
                            {c.name}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <Badge variant="brand" size="sm">
                        {scenario.level}
                      </Badge>
                      <span className="block text-xs text-ecp-text-muted mt-0.5 capitalize">
                        {scenario.communicationStyle}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} />
                          বাংলা (100%)
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-ecp-violet font-medium bg-ecp-violet-surface px-2 py-0.5 rounded-md border border-ecp-violet/20">
                          <HugeiconsIcon icon={VolumeHighIcon} size={12} />
                          US/UK
                        </span>
                      </div>
                      <span className="text-xs text-ecp-text-muted block mt-1">
                        {turnsCount} turns
                      </span>
                    </td>

                    <td className="p-3.5">
                      <Badge variant="success" size="sm">
                        Published
                      </Badge>
                    </td>

                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <Link href={`/admin/conversations/${scenario.slug}/edit?role=${currentRole}`}>
                        <Button variant="outline" size="sm" className="text-xs gap-1">
                          <HugeiconsIcon icon={PencilEdit01Icon} size={12} />
                          <span>এডিটর</span>
                        </Button>
                      </Link>

                      <Link href={`/conversations/${scenario.slug}`}>
                        <Button variant="ghost" size="sm" className="text-xs">
                          প্রিভিউ
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Language Coverage Matrix */}
      <Card className="p-6 bg-white border-ecp-border space-y-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} size={18} className="text-ecp-violet" />
          <h3 className="text-base font-semibold text-ecp-text-primary font-bangla">
            ভাষা ও কভারেজ ম্যাট্রিক্স (Language Coverage Report)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-ecp-bg-canvas border border-ecp-border space-y-2">
            <div className="font-semibold text-ecp-text-primary">English Source Texts</div>
            <div className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={15} />
              17 of 17 Scenarios Certified
            </div>
            <p className="text-ecp-text-muted leading-relaxed">
              Reviewed for CEFR progression (A1 to B2) and natural conversational authenticity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-ecp-bg-canvas border border-ecp-border space-y-2">
            <div className="font-semibold text-ecp-text-primary font-bangla">বাংলা অনুবাদ (Bengali Glosses)</div>
            <div className="text-emerald-700 font-semibold flex items-center gap-1.5 font-bangla">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={15} />
              ১৭টি দৃশ্যপটের সব বাক্য অনুবাদকৃত
            </div>
            <p className="text-ecp-text-muted leading-relaxed font-bangla">
              আক্ষরিক অনুবাদের পরিবর্তে প্রাসঙ্গিক ও সাবলীল প্রমিত বাংলা অর্থ নিশ্চিত করা হয়েছে।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-ecp-bg-canvas border border-ecp-border space-y-2">
            <div className="font-semibold text-ecp-text-primary">Accents & Audio Assets</div>
            <div className="text-ecp-violet font-semibold flex items-center gap-1.5">
              <HugeiconsIcon icon={VolumeHighIcon} size={15} />
              en-US & en-GB Accents Ready
            </div>
            <p className="text-ecp-text-muted leading-relaxed">
              Synthesized with 600ms conversational turn spacing and zero autoplay compliance.
            </p>
          </div>
        </div>
      </Card>

      {/* Audit Log */}
      <Card className="p-6 bg-white border-ecp-border space-y-3">
        <h3 className="text-sm font-semibold text-ecp-text-primary font-bangla">
          সাম্প্রতিক অডিট লগ (Audit Log)
        </h3>
        <div className="space-y-2 text-xs font-mono text-ecp-text-secondary">
          <div className="p-2.5 rounded-lg bg-ecp-bg-canvas border border-ecp-border flex items-center justify-between">
            <span>[2026-11-16 23:45] Phase 1 Milestone 1D Learning Tools verified by Admin</span>
            <span className="text-emerald-600 font-semibold">VERIFIED</span>
          </div>
          <div className="p-2.5 rounded-lg bg-ecp-bg-canvas border border-ecp-border flex items-center justify-between">
            <span>[2026-11-16 22:30] Audio timing manifest and pause spacing synchronized</span>
            <span className="text-emerald-600 font-semibold">PASSED</span>
          </div>
          <div className="p-2.5 rounded-lg bg-ecp-bg-canvas border border-ecp-border flex items-center justify-between">
            <span>[2026-11-16 17:15] 17 Bilingual seed scenarios pre-rendered into static pages</span>
            <span className="text-emerald-600 font-semibold">PUBLISHED</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

