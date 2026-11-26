"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { t, useTranslations } from "@/lib/i18n";
import { ScenarioCard } from "@/components/discovery/ScenarioCard";
import { CategoryPills } from "@/components/discovery/CategoryPills";
import { FilterBar } from "@/components/discovery/FilterBar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupPrefix, InputGroupSuffix } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  SearchXIcon,
  Cancel01Icon,
  Briefcase01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  Clock01Icon,
  Layers01Icon,
  CompassIcon,
} from "@hugeicons/core-free-icons";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import { ALL_PROFESSIONS, type ProfessionCefrLevel } from "@/lib/professions/registry";
import { LocaleTitle } from "@/components/shared";
import { paginateItems } from "@/lib/pagination/faceted-pagination";
import { FacetedPagination } from "@/components/discovery/FacetedPagination";
import { getLengthTierById } from "@/lib/content/length-tiers";
import { cn } from "@/lib/utils";

type ExploreTab = "conversations" | "professional";
const CEFR_LEVELS: readonly ("all" | ProfessionCefrLevel)[] = [
  "all",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export function ExploreClient() {
  const { locale, t: tKey } = useTranslations();
  const searchParams = useSearchParams();
  const initialTab: ExploreTab =
    searchParams.get("tab") === "professional" ? "professional" : "conversations";

  const [activeTab, setActiveTab] = useState<ExploreTab>(initialTab);

  // Conversations Tab State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [lengthType, setLengthType] = useState("all");
  const [style, setStyle] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [isPending, startTransition] = useTransition();

  // Professional / Career Tracks Tab State
  const [selectedProfCat, setSelectedProfCat] = useState<string>("all");
  const [selectedProfLevel, setSelectedProfLevel] = useState<"all" | ProfessionCefrLevel>("all");
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

  const filteredScenarios = useMemo(() => {
    return SEED_SCENARIOS.filter((item) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesTitleBn = item.titleBn.includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesDescBn = item.descriptionBn.includes(query);
        const matchesKeyword = item.keywords.some((k) => k.toLowerCase().includes(query));

        if (!matchesTitle && !matchesTitleBn && !matchesDesc && !matchesDescBn && !matchesKeyword) {
          return false;
        }
      }

      if (selectedCategory !== "all") {
        const inCategory = item.categories.some((c) => c.slug === selectedCategory);
        if (!inCategory) return false;
      }

      if (level !== "all" && item.level !== level) {
        return false;
      }

      if (lengthType !== "all") {
        const tier = getLengthTierById(lengthType);
        if (tier && item.level !== tier.cefrLevel) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, level, lengthType]);

  const filteredProfessions = useMemo(() => {
    return ALL_PROFESSIONS.filter((p) => {
      if (selectedProfCat !== "all" && p.category !== selectedProfCat) return false;
      if (selectedProfLevel !== "all" && !p.supportedLevels.includes(selectedProfLevel)) {
        return false;
      }
      return true;
    });
  }, [selectedProfCat, selectedProfLevel]);

  const isFiltered = Boolean(
    searchQuery ||
      selectedCategory !== "all" ||
      level !== "all" ||
      lengthType !== "all" ||
      style !== "all"
  );

  const paginatedScenarios = useMemo(() => {
    return paginateItems(filteredScenarios, { page: currentPage, pageSize });
  }, [filteredScenarios, currentPage, pageSize]);

  const handleResetFilters = () => {
    startTransition(() => {
      setSearchQuery("");
      setSelectedCategory("all");
      setLevel("all");
      setLengthType("all");
      setStyle("all");
      setCurrentPage(1);
    });
  };

  const handleCategorySelect = (slug: string) => {
    startTransition(() => {
      setSelectedCategory(slug);
      setCurrentPage(1);
    });
  };

  const sidebarControls =
    activeTab === "conversations" ? (
      <>
        {/* Search Input */}
        <div className="space-y-2">
          <p className="text-chip uppercase tracking-wider text-muted-foreground">
            {locale === "bn" ? "অনুসন্ধান" : "Search"}
          </p>
          <InputGroup className="bg-muted/30">
            <InputGroupPrefix>
              <HugeiconsIcon icon={Search01Icon} size={18} className="text-muted-foreground" />
            </InputGroupPrefix>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                startTransition(() => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                });
              }}
              placeholder={t("discovery.searchPlaceholder", locale)}
              variant="ghost"
              inputSize="default"
              className="w-full pl-11 pr-11 text-body h-11"
            />
            {searchQuery && (
              <InputGroupSuffix>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  aria-label="Clear search"
                  className="p-1.5 rounded-control text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} />
                </button>
              </InputGroupSuffix>
            )}
          </InputGroup>
        </div>

        {/* Category Pills */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <p className="text-chip uppercase tracking-wider text-muted-foreground">
            {locale === "bn" ? "বিষয়সমূহ" : "Categories"}
          </p>
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            wrap
          />
        </div>

        {/* Embedded Filter Bar */}
        <div className="pt-3 border-t border-border/60">
          <FilterBar
            level={level}
            setLevel={(l) =>
              startTransition(() => {
                setLevel(l);
                setCurrentPage(1);
              })
            }
            lengthType={lengthType}
            setLengthType={(len) =>
              startTransition(() => {
                setLengthType(len);
                setCurrentPage(1);
              })
            }
            style={style}
            setStyle={(st) =>
              startTransition(() => {
                setStyle(st);
                setCurrentPage(1);
              })
            }
            onReset={handleResetFilters}
            isFiltered={isFiltered}
            embedded
            sidebar
          />
        </div>
      </>
    ) : (
      <div className="space-y-4">
        <p className="text-chip uppercase tracking-wider text-muted-foreground">
          {locale === "bn" ? "ক্যারিয়ার ট্র্যাক ফিল্টার" : "Career Track Filters"}
        </p>

        <div className="space-y-2">
          <p className="text-chip text-muted-foreground">
            {locale === "bn" ? "ট্র্যাক:" : "Track:"}
          </p>
          <div className="relative">
            <select
              aria-label={locale === "bn" ? "ক্যারিয়ার ট্র্যাক নির্বাচন করুন" : "Select career track"}
              value={selectedProfCat}
              onChange={(e) => setSelectedProfCat(e.target.value)}
              className="w-full h-11 appearance-none rounded-control border border-border bg-muted/40 pl-3.5 pr-9 text-label text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[
                { id: "all", labelEn: "All Tracks", labelBn: "সব ট্র্যাক" },
                { id: "tech", labelEn: "Tech & Engineering", labelBn: "টেক ও ইঞ্জিনিয়ারিং" },
                { id: "business", labelEn: "Business & Freelance", labelBn: "ব্যবসা ও ফ্রিল্যান্সিং" },
                { id: "service", labelEn: "Healthcare", labelBn: "স্বাস্থ্যসেবা" },
                { id: "education", labelEn: "Education", labelBn: "শিক্ষা" },
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
        </div>

        <div className="space-y-2">
          <p className="text-chip text-muted-foreground">
            {locale === "bn" ? "CEFR লেভেল:" : "CEFR Level:"}
          </p>
          <div className="relative">
            <select
              aria-label={locale === "bn" ? "CEFR লেভেল নির্বাচন করুন" : "Filter by CEFR level"}
              value={selectedProfLevel}
              onChange={(e) =>
                setSelectedProfLevel(e.target.value as "all" | ProfessionCefrLevel)
              }
              className="w-full h-11 appearance-none rounded-control border border-border bg-muted/40 pl-3.5 pr-9 text-label text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CEFR_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl === "all"
                    ? locale === "bn"
                      ? "সব লেভেল (A1–C2)"
                      : "All Levels (A1–C2)"
                    : userTargetLevel === lvl
                      ? `${lvl} (${locale === "bn" ? "আপনার লক্ষ্য" : "Your Target"})`
                      : lvl}
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
      </div>
    );

  return (
    <div className="w-full lg:pr-80 xl:pr-96">
      {/* ================= MIDDLE CONTENT AREA ================= */}
      <div className="w-full px-4 sm:px-6 lg:px-9 py-6 pb-16 space-y-6">
        {/* Merged Explore & Professional Header Card */}
        <Card className="p-5 sm:p-6 bg-card border border-border shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <LocaleTitle
                as="h1"
                titleEn={
                  activeTab === "conversations"
                    ? "Explore Conversations"
                    : "Professional English Career Paths"
                }
                titleBn={
                  activeTab === "conversations"
                    ? "কথোপকথন অন্বেষণ করুন"
                    : "পেশাগত ইংরেজি ক্যারিয়ার পাথ"
                }
                className="text-page-title text-foreground"
              />
              <LocaleTitle
                as="p"
                titleEn={
                  activeTab === "conversations"
                    ? "Explore and practice natural dialogues crafted for everyday and workplace situations."
                    : tKey("professions.subtitle")
                }
                titleBn={
                  activeTab === "conversations"
                    ? "বাস্তব জীবনের পরিস্থিতি ও কর্মক্ষেত্র অনুযায়ী কথোপকথন অনুসন্ধান ও অনুশীলন করুন।"
                    : tKey("professions.subtitle")
                }
                className="text-meta text-muted-foreground mt-1"
              />
            </div>

            <Badge variant="outline" size="sm" className="shrink-0 font-mono self-start sm:self-center">
              {activeTab === "conversations"
                ? `${filteredScenarios.length} ${locale === "bn" ? "কথোপকথন" : "conversations"}`
                : `${filteredProfessions.length} ${locale === "bn" ? "টি ট্র্যাক" : "Tracks"}`}
            </Badge>
          </div>

          {/* 2 Unified Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              size="sm"
              variant={activeTab === "conversations" ? "default" : "outline"}
              onClick={() => setActiveTab("conversations")}
              className="gap-1.5"
            >
              <HugeiconsIcon icon={CompassIcon} size={15} />
              <span>{locale === "bn" ? "সব কথোপকথন" : "All Conversations"}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeTab === "professional" ? "default" : "outline"}
              onClick={() => setActiveTab("professional")}
              className="gap-1.5"
            >
              <HugeiconsIcon icon={Briefcase01Icon} size={15} />
              <span>
                {locale === "bn" ? "প্রফেশনাল / ক্যারিয়ার ট্র্যাক" : "Professional / Career Tracks"}
              </span>
            </Button>
          </div>
        </Card>

        {/* Mobile/Tablet Search & Filters Fallback */}
        <Card className="lg:hidden p-4 sm:p-5 bg-card border border-border space-y-4 shadow-xs">
          {sidebarControls}
        </Card>

        {/* TAB 1: ALL CONVERSATIONS */}
        {activeTab === "conversations" ? (
          isPending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-7 rounded-card bg-card space-y-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-tile rounded-control" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-control-md w-full rounded-pill" />
                </div>
              ))}
            </div>
          ) : filteredScenarios.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {paginatedScenarios.items.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    selectedLengthTierId={lengthType !== "all" ? lengthType : undefined}
                    selectedStyle={style !== "all" ? style : undefined}
                  />
                ))}
              </div>

              <FacetedPagination
                currentPage={paginatedScenarios.currentPage}
                totalPages={paginatedScenarios.totalPages}
                totalItems={paginatedScenarios.totalItems}
                startIndex={paginatedScenarios.startIndex}
                endIndex={paginatedScenarios.endIndex}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
            </div>
          ) : (
            <EmptyState
              title={t("discovery.noConversationsFound", locale)}
              description={`We couldn't find any situation matching "${searchQuery}". Try different keywords in English or বাংলা.`}
              icon={<HugeiconsIcon icon={SearchXIcon} size={28} />}
              action={
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleResetFilters}
                  className="btn-press rounded-control"
                >
                  Reset All Filters
                </Button>
              }
            />
          )
        ) : (
          /* TAB 2: PROFESSIONAL / CAREER TRACKS */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProfessions.map((profession) => {
              const matchingScenarios = SEED_SCENARIOS.filter((s) => {
                if (s.profession?.slug !== profession.slug) return false;
                if (selectedProfLevel !== "all" && s.level !== selectedProfLevel) return false;
                return true;
              });

              return (
                <Card
                  key={profession.slug}
                  className="p-5 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="space-y-2.5">
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

                    <p
                      className={cn(
                        "text-meta text-muted-foreground line-clamp-2",
                        locale === "bn" && "text-bangla"
                      )}
                    >
                      {locale === "bn" ? profession.taglineBn : profession.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-chip text-muted-foreground">
                      <span className="flex items-center gap-1 font-mono">
                        <HugeiconsIcon icon={Layers01Icon} size={14} />
                        {matchingScenarios.length} {tKey("professions.scenariosUnit")}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <HugeiconsIcon icon={Clock01Icon} size={14} />
                        ~{profession.estimatedHours} {tKey("professions.hoursUnit")}
                      </span>
                    </div>

                    <Link href={`/professions/${profession.slug}`}>
                      <Button size="sm" className="rounded-control gap-1.5 cursor-pointer text-chip">
                        <span className={locale === "bn" ? "text-bangla" : ""}>
                          {tKey("professions.startPath")}
                        </span>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= FIXED RIGHT SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4 space-y-5">
        {sidebarControls}
      </aside>
    </div>
  );
}
