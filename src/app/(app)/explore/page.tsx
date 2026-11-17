"use client";

import { useState, useMemo, useTransition } from "react";
import { ScenarioCard } from "@/components/discovery/ScenarioCard";
import { CategoryPills } from "@/components/discovery/CategoryPills";
import { FilterBar } from "@/components/discovery/FilterBar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  SearchXIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [lengthType, setLengthType] = useState("all");
  const [style, setStyle] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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

      // 4. Length Type Filter
      if (lengthType !== "all" && item.lengthType !== lengthType) {
        return false;
      }

      // 5. Communication Style Filter
      if (style !== "all" && item.communicationStyle !== style) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, level, lengthType, style]);

  const isFiltered = Boolean(
    searchQuery || selectedCategory !== "all" || level !== "all" || lengthType !== "all" || style !== "all"
  );

  const handleResetFilters = () => {
    startTransition(() => {
      setSearchQuery("");
      setSelectedCategory("all");
      setLevel("all");
      setLengthType("all");
      setStyle("all");
    });
  };

  const handleCategorySelect = (slug: string) => {
    startTransition(() => {
      setSelectedCategory(slug);
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground tracking-[-0.01em]">
          Explore Conversations
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1.5 font-bangla">
          বাস্তব জীবনের পরিস্থিতি অনুযায়ী কথোপকথন অনুসন্ধান ও অনুশীলন করুন (EN + BN)
        </p>
      </div>

      {/* Search Input with Rainbow Border on Focus & Clear Button */}
      <div className={cn("rounded-[14px] transition-all duration-200", isSearchFocused && "rainbow-border")}>
        <div className="relative bg-card rounded-[14px] border border-border shadow-xs">
          <HugeiconsIcon
            icon={Search01Icon}
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onChange={(e) => {
              const val = e.target.value;
              startTransition(() => {
                setSearchQuery(val);
              });
            }}
            placeholder="Search by topic, keyword, or role (e.g. 'airport', 'এয়ারপোর্ট', 'doctor', 'refund')..."
            className="w-full h-12 pl-12 pr-12 border-0 shadow-none bg-transparent text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category Horizontal Pills */}
      <CategoryPills
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Sticky Advanced Filter Bar */}
      <FilterBar
        level={level}
        setLevel={(l) => startTransition(() => setLevel(l))}
        lengthType={lengthType}
        setLengthType={(len) => startTransition(() => setLengthType(len))}
        style={style}
        setStyle={(st) => startTransition(() => setStyle(st))}
        onReset={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* Results Count Summary */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-sm font-semibold text-muted-foreground">
          Showing <span className="text-primary font-bold">{filteredScenarios.length}</span> conversation{filteredScenarios.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Scenarios Grid / Skeletons / Empty State */}
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-7 rounded-2xl bg-card border border-border space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-11 w-full rounded-full" />
            </div>
          ))}
        </div>
      ) : filteredScenarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredScenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No conversations found"
          description={`We couldn't find any situation matching "${searchQuery}". Try different keywords in English or বাংলা.`}
          icon={<HugeiconsIcon icon={SearchXIcon} size={28} />}
          action={
            <Button variant="outline" size="md" onClick={handleResetFilters} className="btn-press">
              Reset All Filters
            </Button>
          }
        />
      )}
    </div>
  );
}
