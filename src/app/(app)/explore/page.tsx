"use client";

import { useState, useMemo } from "react";
import { ScenarioCard } from "@/components/discovery/ScenarioCard";
import { CategoryPills } from "@/components/discovery/CategoryPills";
import { FilterBar } from "@/components/discovery/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, SearchXIcon } from "@hugeicons/core-free-icons";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [lengthType, setLengthType] = useState("all");
  const [style, setStyle] = useState("all");

  // Filtering Logic (English + Bangla Search & Multi-criteria)
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
    setSearchQuery("");
    setSelectedCategory("all");
    setLevel("all");
    setLengthType("all");
    setStyle("all");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--ecp-brand-950)]">
          Explore Conversations
        </h1>
        <p className="text-sm text-[var(--ecp-text-secondary)] mt-1">
          Search and practice real-life English dialogues in English & বাংলা.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ecp-text-muted)]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by situation, topic, or keyword (e.g. 'airport', 'এয়ারপোর্ট', 'doctor', 'refund')..."
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-[var(--ecp-border-strong)] bg-[var(--ecp-surface)] text-sm text-[var(--ecp-text-primary)] placeholder:text-[var(--ecp-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ecp-brand-800)] shadow-sm"
        />
      </div>

      {/* Category Horizontal Pills */}
      <CategoryPills
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Advanced Filter Bar */}
      <FilterBar
        level={level}
        setLevel={setLevel}
        lengthType={lengthType}
        setLengthType={setLengthType}
        style={style}
        setStyle={setStyle}
        onReset={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* Scenarios Header & Results Count */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs font-semibold text-[var(--ecp-text-secondary)]">
          Showing <span className="text-[var(--ecp-brand-800)] font-bold">{filteredScenarios.length}</span> conversation{filteredScenarios.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Scenarios Grid */}
      {filteredScenarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No conversations found"
          description={`We couldn't find any situation matching "${searchQuery}". Try different keywords in English or বাংলা.`}
          icon={<HugeiconsIcon icon={SearchXIcon} size={24} />}
          action={
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
          }
        />
      )}
    </div>
  );
}
