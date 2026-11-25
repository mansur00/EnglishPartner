"use client";

import { useState, useMemo, useTransition } from "react";
import { t, useLocale } from "@/lib/i18n";
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
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  SearchXIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import { PageContainer, LocaleTitle } from "@/components/shared";
import { paginateItems } from "@/lib/pagination/faceted-pagination";
import { FacetedPagination } from "@/components/discovery/FacetedPagination";
import { getLengthTierById } from "@/lib/content/length-tiers";

export default function ExplorePage() {
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [lengthType, setLengthType] = useState("all");
  const [style, setStyle] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [isPending, startTransition] = useTransition();

  // Multi-criteria Filtering
  const filteredScenarios = useMemo(() => {
    return SEED_SCENARIOS.filter((item) => {
      // 1. Text Search (English title, Bangla title, description, or keywords)
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

      // 2. Category Filter
      if (selectedCategory !== "all") {
        const inCategory = item.categories.some((c) => c.slug === selectedCategory);
        if (!inCategory) return false;
      }

      // 3. Level Filter
      if (level !== "all" && item.level !== level) {
        return false;
      }

      // 4. Length Tier Filter (24-tier: matches CEFR level of selected tier; every scenario supports all 4 tiers & 3 styles)
      if (lengthType !== "all") {
        const tier = getLengthTierById(lengthType);
        if (tier && item.level !== tier.cefrLevel) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, level, lengthType]);

  const isFiltered = Boolean(
    searchQuery || selectedCategory !== "all" || level !== "all" || lengthType !== "all" || style !== "all"
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

  return (
    <PageContainer className="space-y-6 pb-16">
      {/* Unified Header, Search, Categories & Filters Card */}
      <Card className="p-5 sm:p-6 bg-card border border-border space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <LocaleTitle
              as="h1"
              titleEn="Explore Conversations"
              titleBn="কথোপকথন অন্বেষণ করুন"
              className="text-page-title text-foreground"
            />
            <LocaleTitle
              as="p"
              titleEn="Explore and practice natural dialogues crafted for everyday real-world situations."
              titleBn="বাস্তব জীবনের পরিস্থিতি অনুযায়ী কথোপকথন অনুসন্ধান ও অনুশীলন করুন।"
              className="text-meta text-muted-foreground mt-1"
            />
          </div>
          <Badge variant="outline" size="sm" className="shrink-0 font-mono self-start sm:self-center">
            {filteredScenarios.length} {locale === "bn" ? "কথোপকথন" : `conversation${filteredScenarios.length !== 1 ? "s" : ""}`}
            {filteredScenarios.length > pageSize ? ` • ${paginatedScenarios.currentPage}/${paginatedScenarios.totalPages}` : ""}
          </Badge>
        </div>

        {/* Search Input with Rainbow Border on Focus & Clear Button */}
        <InputGroup className="bg-muted/30">
          <InputGroupPrefix>
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="text-muted-foreground"
            />
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

        {/* Category Horizontal Pills */}
        <div className="pt-1">
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Embedded Filter Bar */}
        <div className="pt-3 border-t border-border/60">
          <FilterBar
            level={level}
            setLevel={(l) => startTransition(() => { setLevel(l); setCurrentPage(1); })}
            lengthType={lengthType}
            setLengthType={(len) => startTransition(() => { setLengthType(len); setCurrentPage(1); })}
            style={style}
            setStyle={(st) => startTransition(() => { setStyle(st); setCurrentPage(1); })}
            onReset={handleResetFilters}
            isFiltered={isFiltered}
            embedded
          />
        </div>
      </Card>

      {/* Scenarios Grid / Skeletons / Empty State */}
      {isPending ? (
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

          {/* Faceted Pagination Controls (Milestone 1D / KI-10) */}
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
            <Button variant="outline" size="md" onClick={handleResetFilters} className="btn-press rounded-control">
              Reset All Filters
            </Button>
          }
        />
      )}
    </PageContainer>
  );
}
