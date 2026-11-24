"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
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
import { paginateItems } from "@/lib/pagination/faceted-pagination";
import { FacetedPagination } from "@/components/discovery/FacetedPagination";

interface AdminMetricCardProps {
  title: string;
  value: React.ReactNode;
  subtitle: string;
  valueClass?: string;
  subtitleClass?: string;
}

function AdminMetricCard({
  title,
  value,
  subtitle,
  valueClass,
  subtitleClass = "text-muted-foreground",
}: AdminMetricCardProps) {
  return (
    <Card className="p-5 bg-card border-border rounded-card space-y-1">
      <span className="text-chip text-muted-foreground uppercase tracking-wider block">
        {title}
      </span>
      <div className={cn("text-stat text-foreground", valueClass)}>{value}</div>
      <span className={cn("text-chip", subtitleClass)}>{subtitle}</span>
    </Card>
  );
}

interface CoveragePanelProps {
  title: string;
  status: string;
  statusIcon: typeof CheckmarkCircle01Icon;
  statusClass?: string;
  description: string;
  isBangla?: boolean;
}

function CoveragePanel({
  title,
  status,
  statusIcon: StatusIcon,
  statusClass = "text-success",
  description,
  isBangla,
}: CoveragePanelProps) {
  return (
    <div className="p-4 rounded-panel bg-muted/40 border border-border space-y-2">
      <div className={cn("text-label text-foreground", isBangla && "text-bangla")}>{title}</div>
      <div className={cn("flex items-center gap-1.5", statusClass, isBangla && "text-bangla")}>
        <HugeiconsIcon icon={StatusIcon} size={15} />
        {status}
      </div>
      <p className={cn("text-muted-foreground leading-relaxed", isBangla && "text-bangla")}>
        {description}
      </p>
    </div>
  );
}

function AuditLogRow({ message, status }: { message: string; status: string }) {
  return (
    <div className="p-2.5 rounded-control bg-muted/40 border border-border flex items-center justify-between">
      <span>{message}</span>
      <span className="text-success">{status}</span>
    </div>
  );
}

export function AdminDashboardClient() {
  const searchParams = useSearchParams();
  const currentRole: UserRole = (searchParams.get("role") as UserRole) || "admin";
  const filterStatus = searchParams.get("status") || "all";
  const isRedirectedFromUnauthorized = searchParams.get("unauthorized") === "true";
  const requiredRole = searchParams.get("required") || "editor";

  const [tablePage, setTablePage] = useState(1);
  const pageSize = 5;

  // Server/Client Role Guard
  const isAuthorized = canViewAdminPanel(currentRole);

  // Status Filter & Pagination (Milestone 1D / KI-10)
  const filteredScenarios = useMemo(() => {
    return SEED_SCENARIOS.filter(() => {
      if (filterStatus === "all") return true;
      if (filterStatus === "published") return true;
      return false;
    });
  }, [filterStatus]);

  const paginatedScenarios = useMemo(() => {
    return paginateItems(filteredScenarios, { page: tablePage, pageSize });
  }, [filteredScenarios, tablePage, pageSize]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center space-y-4 p-8 border-destructive/30 shadow-md rounded-card bg-card">
          <div className="size-control rounded-pill bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <HugeiconsIcon icon={Alert02Icon} size={24} />
          </div>

          <h1 className="text-card-title text-foreground">
            403 — অননুমোদিত অ্যাক্সেস
          </h1>

          <p className="text-meta-lead-bn">
            কন্টেন্ট অ্যাডমিনিস্ট্রেশন প্যানেল শুধুমাত্র অনুমোদিত এডিটর এবং পর্যালোচকদের জন্য সংরক্ষিত। বর্তমান ভূমিকা: <strong className="text-destructive font-mono">{currentRole}</strong>।
          </p>

          <div className="pt-3 flex flex-col gap-2">
            <Link href="/admin?role=admin">
              <Button className="w-full justify-center text-label text-bangla rounded-control">
                অ্যাডমিন হিসেবে ডেমো দেখুন
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full justify-center gap-2 text-label rounded-control">
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

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 space-y-8 container-app w-full min-w-0 overflow-x-hidden">
      {/* Unauthorized Redirect Alert (Milestone 1D / KI-10) */}
      {isRedirectedFromUnauthorized && (
        <div className="p-4 rounded-panel bg-destructive/10 border border-destructive/30 flex items-center gap-3 text-destructive">
          <HugeiconsIcon icon={Alert02Icon} size={20} className="shrink-0" />
          <div className="text-chip">
            <strong>অননুমোদিত অ্যাক্সেস:</strong> দৃশ্যপট সম্পাদনা করতে ‘{requiredRole}’ বা উচ্চতর ভূমিকা প্রয়োজন। আপনার বর্তমান ভূমিকা: ‘{currentRole}’।
          </div>
        </div>
      )}

      {/* Top Header & Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3.5">
          <div className="size-control rounded-control bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={DashboardSquare01Icon} size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-page-title text-foreground text-bangla">
                কন্টেন্ট ম্যানেজমেন্ট ও অ্যাডমিন কনসোল
              </h1>
              <Badge variant="brand" size="sm" className="text-chip">
                Role: {currentRole}
              </Badge>
            </div>
            <p className="text-meta text-muted-foreground">
              Author, review, validate, and publish English dialogue scenarios
            </p>
          </div>
        </div>

        {/* Demo Role Switcher Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-card p-1.5 rounded-panel border border-border text-chip">
          <span className="text-muted-foreground px-2 flex items-center gap-1 font-sans">
            <HugeiconsIcon icon={UserGroupIcon} size={14} />
            Test Role:
          </span>
          {(["admin", "reviewer", "editor", "translator", "learner"] as UserRole[]).map((r) => (
            <Link key={r} href={`/admin?role=${r}`}>
              <button
                type="button"
                className={`px-2.5 py-1 rounded-control transition-colors cursor-pointer ${
                  currentRole === r
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
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
        <AdminMetricCard
          title="Total Scenarios"
          value={totalScenarios}
          subtitle="100% Active in Library"
          subtitleClass="text-success"
        />
        <AdminMetricCard
          title="Dialogue Turns"
          value={`${totalDialogueLines}+`}
          subtitle="Short & Medium Versions"
        />
        <AdminMetricCard
          title="Bangla Translations"
          value="100%"
          valueClass="text-success"
          subtitle="All lines fully glossed"
          subtitleClass="text-success"
        />
        <AdminMetricCard
          title="Audio Asset Pipeline"
          value="Piper TTS"
          valueClass="text-primary"
          subtitle="en-US + en-GB offline audio"
        />
      </div>

      {/* Content Library Table with Filter Tabs */}
      <Card className="p-6 bg-card border-border rounded-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={FilterIcon} size={16} className="text-primary" />
            <h2 className="text-card-title-bn">
              দৃশ্যপট তালিকা ও প্রকাশনা স্থিতি
            </h2>
          </div>

          {/* Filter Status Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-muted/40 p-1 rounded-control border border-border text-chip">
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
                  className={`px-3 py-1 rounded-control transition-colors cursor-pointer ${
                    filterStatus === tab.id
                      ? "bg-card text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Scenarios Table */}
        <div className="overflow-x-auto border border-border rounded-control">
          <table className="w-full text-left text-meta">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border text-chip uppercase tracking-wider">
              <tr>
                <th className="p-3.5">দৃশ্যপট ও শিরোনাম</th>
                <th className="p-3.5">ক্যাটাগরি</th>
                <th className="p-3.5">CEFR লেভেল</th>
                <th className="p-3.5">অনুবাদ ও অডিও</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedScenarios.items.map((scenario) => {
                const dialogue = SEED_DIALOGUES[scenario.slug];
                const lines = dialogue?.[0]?.lines || [];
                const turnsCount = lines.length;
                const translatedTurns = lines.filter((l) => Boolean(l.translationBn)).length;
                const coveragePct = turnsCount > 0 ? Math.round((translatedTurns / turnsCount) * 100) : 100;

                return (
                  <tr key={scenario.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5">
                      <div className="text-label text-foreground font-sans">
                        {scenario.title}
                      </div>
                      <div className="text-chip-bn">
                        {scenario.titleBn}
                      </div>
                      <span className="text-chip font-mono text-muted-foreground">
                        /{scenario.slug}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {scenario.categories.map((c) => (
                          <Badge key={c.id} variant="neutral" size="sm" className="text-chip">
                            {c.name}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <Badge variant="brand" size="sm" className="text-chip">
                        {scenario.level}
                      </Badge>
                      <span className="block text-chip text-muted-foreground mt-0.5 capitalize">
                        {scenario.communicationStyle}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-chip text-success bg-success-bg px-2 py-0.5 rounded-control border border-success/30">
                          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} />
                          বাংলা ({coveragePct}%)
                        </span>
                        <span className="inline-flex items-center gap-1 text-chip text-primary bg-primary/10 px-2 py-0.5 rounded-control border border-primary/20">
                          <HugeiconsIcon icon={VolumeHighIcon} size={12} />
                          US/UK
                        </span>
                      </div>
                      <span className="text-chip text-muted-foreground block mt-1">
                        {turnsCount} turns
                      </span>
                    </td>

                    <td className="p-3.5">
                      <Badge variant="success" size="sm" className="text-chip">
                        Published
                      </Badge>
                    </td>

                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <Link href={`/admin/conversations/${scenario.slug}/edit?role=${currentRole}`}>
                        <Button variant="outline" size="sm" className="text-label text-bangla rounded-control gap-1">
                          <HugeiconsIcon icon={PencilEdit01Icon} size={12} />
                          <span>এডিটর</span>
                        </Button>
                      </Link>

                      <Link href={`/conversations/${scenario.slug}`}>
                        <Button variant="ghost" size="sm" className="text-label text-bangla rounded-control">
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

        {/* Faceted Pagination Controls (Milestone 1D / KI-10) */}
        <FacetedPagination
          currentPage={paginatedScenarios.currentPage}
          totalPages={paginatedScenarios.totalPages}
          totalItems={paginatedScenarios.totalItems}
          startIndex={paginatedScenarios.startIndex}
          endIndex={paginatedScenarios.endIndex}
          onPageChange={setTablePage}
        />
      </Card>

      {/* Language Coverage Matrix */}
      <Card className="p-6 bg-card border-border rounded-card space-y-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} size={18} className="text-primary" />
          <h3 className="text-card-title-bn">
            ভাষা ও কভারেজ ম্যাট্রিক্স
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-chip">
          <CoveragePanel
            title="English Source Texts"
            status="17 of 17 Scenarios Certified"
            statusIcon={CheckmarkCircle01Icon}
            description="Reviewed for CEFR progression (A1 to B2) and natural conversational authenticity."
          />
          <CoveragePanel
            title="বাংলা অনুবাদ"
            status="১৭টি দৃশ্যপটের সব বাক্য অনুবাদকৃত"
            statusIcon={CheckmarkCircle01Icon}
            description="আক্ষরিক অনুবাদের পরিবর্তে প্রাসঙ্গিক ও সাবলীল প্রমিত বাংলা অর্থ নিশ্চিত করা হয়েছে।"
            isBangla
          />
          <CoveragePanel
            title="Accents & Audio Assets"
            status="en-US & en-GB Accents Ready"
            statusIcon={VolumeHighIcon}
            statusClass="text-primary"
            description="Synthesized with 600ms conversational turn spacing and zero autoplay compliance."
          />
        </div>
      </Card>

      {/* Audit Log */}
      <Card className="p-6 bg-card border-border rounded-card space-y-3">
        <h3 className="text-card-title-bn">
          সাম্প্রতিক অডিট লগ
        </h3>
        <div className="space-y-2 text-chip font-mono text-muted-foreground">
          <AuditLogRow
            message="[2026-11-16 23:45] Phase 1 Milestone 1D Learning Tools verified by Admin"
            status="VERIFIED"
          />
          <AuditLogRow
            message="[2026-11-16 22:30] Audio timing manifest and pause spacing synchronized"
            status="PASSED"
          />
          <AuditLogRow
            message="[2026-11-16 17:15] 17 Bilingual seed scenarios pre-rendered into static pages"
            status="PUBLISHED"
          />
        </div>
      </Card>
    </div>
  );
}

