"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useGrammar } from "@/lib/grammar/context";
import type { GrammarLayerId, DetailLevel } from "@/lib/grammar/types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SlidersHorizontalIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

interface GrammarLayerPickerProps {
  className?: string;
  lang?: "en" | "bn";
}

const LAYERS: { id: GrammarLayerId; labelEn: string; labelBn: string; channelEn: string; channelBn: string }[] = [
  {
    id: "pos",
    labelEn: "Parts of Speech",
    labelBn: "পদ প্রকরণ (POS)",
    channelEn: "Color text",
    channelBn: "রঙিন পাঠ্য",
  },
  {
    id: "role",
    labelEn: "Sentence Roles",
    labelBn: "বাক্যের ভূমিকা (Roles)",
    channelEn: "Underline & tint",
    channelBn: "আন্ডারলাইন ও শেড",
  },
  {
    id: "tense",
    labelEn: "Verbs & Tenses",
    labelBn: "ক্রিয়ার কাল (Tenses)",
    channelEn: "Tense bar",
    channelBn: "কাল নির্দেশক বার",
  },
  {
    id: "phrase",
    labelEn: "Phrases & Clauses",
    labelBn: "বাক্যাংশ (Phrases)",
    channelEn: "Brackets",
    channelBn: "ব্র্যাকেট বর্ডার",
  },
  {
    id: "pattern",
    labelEn: "Patterns & Rules",
    labelBn: "বিশেষ প্যাটার্ন",
    channelEn: "Overline chip",
    channelBn: "ওভারলাইন ও চিপ",
  },
];

export function GrammarLayerPicker({
  className,
  lang = "bn",
}: GrammarLayerPickerProps) {
  const {
    activeLayers,
    toggleLayer,
    detailLevel,
    setDetailLevel,
    showLabels,
    setShowLabels,
    focusedKey,
    clearFocus,
  } = useGrammar();

  const isBn = lang === "bn";

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-control border border-border bg-card/60 hover:bg-card text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className
        )}
        aria-label={isBn ? "ব্যাকরণ লেয়ার ও সেটিংস" : "Grammar Layers & Settings"}
      >
        <HugeiconsIcon icon={SlidersHorizontalIcon} size={16} />
        <span className="hidden sm:inline text-xs font-semibold font-bangla">
          {isBn ? "লেয়ার সেটিংস" : "Layers"}
        </span>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        className="w-80 p-4 space-y-4 bg-popover text-popover-foreground rounded-panel border border-border shadow-md"
      >
        <PopoverHeader className="pb-2 border-b border-border flex items-center justify-between">
          <PopoverTitle className="text-sm font-semibold font-bangla">
            {isBn ? "ব্যাকরণ লেয়ার নির্বাচন" : "Grammar Layers"}
          </PopoverTitle>
          {focusedKey && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFocus}
              className="text-xs h-7 px-2 text-primary gap-1"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} />
              <span>{isBn ? "ফোকাস মুছুন" : "Clear Focus"}</span>
            </Button>
          )}
        </PopoverHeader>

        {/* 1. Layers Checklist */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block font-bangla">
            {isBn ? "সক্রিয় লেয়ারসমূহ" : "Active Layers"}
          </span>
          <div className="space-y-1.5">
            {LAYERS.map((layer) => {
              const isChecked = activeLayers.includes(layer.id);
              return (
                <label
                  key={layer.id}
                  className="flex items-center justify-between p-2 rounded-control bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer select-none"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold font-bangla text-foreground">
                      {isBn ? layer.labelBn : layer.labelEn}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isBn ? layer.channelBn : layer.channelEn}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleLayer(layer.id)}
                    className="size-4 rounded-xs border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* 2. Detail Level (Basic vs Advanced) */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block font-bangla">
            {isBn ? "বিশ্লেষণের গভীরতা" : "Detail Level"}
          </span>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/60 rounded-control">
            {(["basic", "advanced"] as DetailLevel[]).map((level) => {
              const isSelected = detailLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDetailLevel(level)}
                  className={cn(
                    "py-1.5 px-2 text-xs font-semibold rounded-xs transition-colors cursor-pointer capitalize font-bangla",
                    isSelected
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {level === "basic"
                    ? isBn
                      ? "সাধারণ (Basic)"
                      : "Basic"
                    : isBn
                      ? "বিস্তারিত (Advanced)"
                      : "Advanced"}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Non-Color Cue: Show Labels */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex flex-col">
            <label
              htmlFor="grammar-show-labels"
              className="text-xs font-semibold font-bangla text-foreground cursor-pointer"
            >
              {isBn ? "শব্দের উপরে লেবেল দেখান" : "Show text labels (Ruby)"}
            </label>
            <span className="text-xs text-muted-foreground">
              {isBn ? "রঙ ছাড়াও সহজে চেনার সুবিধার্থে" : "Non-color accessibility cue"}
            </span>
          </div>
          <Switch
            id="grammar-show-labels"
            checked={showLabels}
            onCheckedChange={setShowLabels}
            aria-label={isBn ? "শব্দের উপরে লেবেল দেখান" : "Show text labels"}
            className="cursor-pointer"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
