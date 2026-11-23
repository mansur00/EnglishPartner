"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupPrefix, InputGroupSuffix } from "@/components/ui/input-group";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  VolumeHighIcon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  SentIcon,
  HelpCircleIcon,
  Cancel01Icon,
  CpuIcon,
} from "@hugeicons/core-free-icons";
import { resolveSayItIntent } from "@/lib/ai/say-it";
import type { SayItResponse, ToneType } from "@/lib/ai/say-it-schema";
import { useLocale } from "@/lib/i18n";
import { LocaleTitle } from "@/components/shared";

const SAMPLE_INTENTS = [
  { label: "Need 2 more days", intent: "I want to tell my manager that I need two more days to finish the task." },
  { label: "Ask for discount", intent: "দাম কি একটু কমিয়ে রাখা যাবে?" },
  { label: "Running 15 mins late", intent: "I am stuck in traffic and running 15 minutes late." },
  { label: "Speak slower", intent: "একটু ধীরে কথা বললে ভালো হতো, বুঝতে পারছি না।" },
  { label: "Order food", intent: "আমি ঝাল ছাড়া খাবার অর্ডার করতে চাই।" },
];

export function WhatShouldISay() {
  const locale = useLocale();
  const [intentInput, setIntentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState<{ isLive: boolean; statusText: string } | null>(null);
  const [response, setResponse] = useState<SayItResponse | null>(() =>
    resolveSayItIntent({ intent: "I want to tell my manager that I need two more days to finish the task." })
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/v1/ai/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProviderInfo({ isLive: data.isLive, statusText: data.statusText });
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = async (textToResolve?: string) => {
    const query = (textToResolve ?? intentInput).trim();
    if (!query || isLoading) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/ai/say-it", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: query }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data: SayItResponse = await res.json();
      setResponse(data);
    } catch {
      // Seamless local fallback
      const fallbackResult = resolveSayItIntent({ intent: query });
      setResponse(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handlePlayAudio = (text: string, index: number) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      setPlayingIndex(index);

      utterance.onend = () => setPlayingIndex(null);
      utterance.onerror = () => setPlayingIndex(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const getToneBadge = (tone: ToneType) => {
    switch (tone) {
      case "polite_professional":
        return <Tag variant="brand" size="sm">Polite & Professional</Tag>;
      case "neutral":
        return <Tag variant="outline" size="sm">Neutral</Tag>;
      case "casual":
        return <Tag variant="secondary" size="sm">Casual</Tag>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 w-full max-w-reading mx-auto">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="size-control rounded-control bg-primary/10 text-primary flex items-center justify-center">
              <HugeiconsIcon icon={SparklesIcon} size={20} />
            </div>
            <LocaleTitle
              as="h1"
              titleEn="What Should I Say?"
              titleBn="আমি কী বলতে পারি?"
              className="text-page-title text-foreground"
            />
          </div>

          {providerInfo && (
            <Pill
              variant={providerInfo.isLive ? "brand" : "neutral"}
              size="sm"
              className="gap-1 font-mono text-chip"
              title={providerInfo.statusText}
            >
              <HugeiconsIcon icon={CpuIcon} size={12} />
              <span>{providerInfo.statusText}</span>
            </Pill>
          )}
        </div>
        <LocaleTitle
          as="p"
          titleEn="Type what you want to say in your own words, and instantly get polished, natural English alternatives."
          titleBn="আপনি কী বলতে চান তা নিজের ভাষায় লিখুন; মুহূর্তেই পেয়ে যান মার্জিত ও স্বাভাবিক ইংরেজি বিকল্প।"
          className="text-meta-lead-bn"
        />
      </div>

      {/* Input Group with Rainbow Border on Focus */}
      <div className="space-y-3">
        <InputGroup className="bg-card">
          <InputGroupPrefix>
            <HugeiconsIcon icon={SparklesIcon} size={18} className="text-muted-foreground" />
          </InputGroupPrefix>
          <Input
            type="text"
            value={intentInput}
            onChange={(e) => setIntentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder={
              locale === "bn"
                ? "যেমন: আমি মিটিংয়ের সময় পরিবর্তন করতে চাই..."
                : "e.g. I want to reschedule our meeting..."
            }
            variant="ghost"
            inputSize="lg"
            className="w-full pl-10 pr-10 text-body"
          />
          {intentInput && (
            <InputGroupSuffix>
              <button
                type="button"
                onClick={() => setIntentInput("")}
                aria-label="Clear intent"
                className="p-1 rounded-control text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </InputGroupSuffix>
          )}
        </InputGroup>

        {/* Action Button & Suggestions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-chip text-muted-foreground">Try:</span>
            {SAMPLE_INTENTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIntentInput(sample.intent);
                  handleSearch(sample.intent);
                }}
                className="px-2.5 py-1 rounded-pill bg-muted/60 hover:bg-muted text-chip text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleSearch()}
            disabled={!intentInput.trim() || isLoading}
            loading={isLoading}
            className="rounded-control gap-1.5 text-label btn-press"
          >
            <HugeiconsIcon icon={SentIcon} size={14} />
            <span>Show Options</span>
          </Button>
        </div>
      </div>

      {/* Results View */}
      {response && (
        <div className="space-y-4 pt-2">
          {/* Understood Intent Banner */}
          <div className="p-3.5 rounded-panel bg-card flex items-start gap-2.5 shadow-2xs">
            <HugeiconsIcon icon={HelpCircleIcon} size={18} className="text-primary shrink-0 mt-0.5" />
            <div className="text-chip text-foreground leading-relaxed">
              <span className="text-muted-foreground block text-chip uppercase tracking-wider mb-0.5">
                Understood Intent
              </span>
              <span className="text-bangla">{response.understood_intent}</span>
            </div>
          </div>

          {/* Options Cards */}
          <div className="space-y-3">
            {response.options.map((option, idx) => {
              const isCopied = copiedIndex === idx;
              const isPlaying = playingIndex === idx;

              return (
                <Card
                  key={idx}
                  className="p-4 sm:p-5 bg-card rounded-card space-y-3 shadow-xs transition-colors"
                >
                  {/* Top Bar: Tone Tag and Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div>{getToneBadge(option.tone)}</div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlayAudio(option.english, idx)}
                        aria-label="Listen to expression"
                        className={cn(
                          "rounded-control px-2.5 gap-1 text-chip",
                          isPlaying && "text-primary bg-primary/10"
                        )}
                      >
                        <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                        <span className="hidden sm:inline">Listen</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(option.english, idx)}
                        aria-label="Copy to clipboard"
                        className="rounded-control px-2.5 gap-1 text-chip"
                      >
                        <HugeiconsIcon
                          icon={isCopied ? CheckmarkCircle01Icon : Copy01Icon}
                          size={14}
                          className={cn(isCopied && "text-success")}
                        />
                        <span>{isCopied ? "Copied" : "Copy"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* English Text */}
                  <div className="text-lead text-foreground font-sans leading-relaxed select-text">
                    {option.english}
                  </div>

                  {/* Translation */}
                  <div className="text-meta-bn text-muted-foreground border-t border-border/60 pt-2">
                    {option.translation}
                  </div>

                  {/* Placeholders note */}
                  {option.placeholders && option.placeholders.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-chip text-muted-foreground">Fill in:</span>
                      {option.placeholders.map((ph, pIdx) => (
                        <Pill key={pIdx} variant="neutral" size="sm" className="font-mono text-chip">
                          {ph}
                        </Pill>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Useful Expressions Chips */}
          {response.useful_phrases && response.useful_phrases.length > 0 && (
            <Card className="p-4 bg-muted/40 rounded-panel space-y-2.5">
              <span className="text-meta text-muted-foreground uppercase tracking-wider block">
                Useful Expressions (কাজের কিছু শব্দগুচ্ছ)
              </span>
              <div className="flex flex-wrap gap-2">
                {response.useful_phrases.map((phrase, pIdx) => (
                  <div
                    key={pIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-card text-chip shadow-2xs"
                  >
                    <span className="text-label text-foreground">{phrase.phrase}</span>
                    <span className="text-muted-foreground text-bangla">— {phrase.meaning}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
