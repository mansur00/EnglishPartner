"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { VolumeHighIcon, SparklesIcon, BookOpen01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { speakText } from "@/lib/audio/speech-engine";
import type { WordDetails } from "@/lib/ai/word-details-schema";

interface WordDetailsSectionsProps {
  details: WordDetails | null;
  isLoading: boolean;
  locale: string;
}

function FormChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2.5 py-1.5 rounded-control bg-muted/50 text-chip flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function TranslatedWordList({
  title,
  items,
  variant = "neutral",
  isBn,
}: {
  title: string;
  items: { word: string; meaningBn: string }[];
  variant?: "neutral" | "peach" | "brand";
  isBn: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <span className={cn("text-chip font-semibold text-foreground block", isBn && "text-bangla")}>
        {title}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Badge key={item.word} variant={variant} size="sm" className="text-chip gap-1 py-1 h-auto">
            <span className="font-semibold">{item.word}</span>
            {item.meaningBn && (
              <span className="text-muted-foreground text-bangla">({item.meaningBn})</span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function WordDetailsSections({
  details,
  isLoading,
  locale,
}: WordDetailsSectionsProps) {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const isBn = locale === "bn";

  if (isLoading && !details) {
    return (
      <div className="space-y-2.5 pt-2">
        <div className="h-4 w-36 rounded-control bg-muted animate-pulse" />
        <div className="h-16 w-full rounded-panel bg-muted/60 animate-pulse" />
        <div className="h-20 w-full rounded-panel bg-muted/60 animate-pulse" />
      </div>
    );
  }

  if (!details) return null;

  const hasVerbForms =
    details.verbForms &&
    Object.values(details.verbForms).some((v) => Boolean(v && v.trim()));
  const hasNounAdjForms =
    details.nounAndAdjForms &&
    Object.values(details.nounAndAdjForms).some((v) => Boolean(v && v.trim()));
  const hasPosFamily =
    details.posFamily &&
    Object.values(details.posFamily).some((v) => Boolean(v && v.trim()));

  return (
    <div className="space-y-3.5">
      {/* Direct Translated Word Meaning (when available) */}
      {details.wordMeaningBn && (
        <div className="p-3 rounded-panel bg-muted/40 space-y-1">
          <span className={cn("text-chip font-semibold text-muted-foreground block", isBn && "text-bangla")}>
            {isBn ? "শব্দের অনুবাদ অর্থ (Translated Meaning)" : "Translated Word Meaning"}
          </span>
          <p className="text-meta font-semibold text-foreground text-bangla">
            {details.wordMeaningBn}
          </p>
        </div>
      )}

      {/* Related Words, Synonyms & Antonyms (with Bangla Translations) */}
      {(details.relatedWords.length > 0 ||
        details.synonyms.length > 0 ||
        details.antonyms.length > 0) && (
        <div className="space-y-2.5 pt-2 border-t border-border/60">
          <TranslatedWordList
            title={isBn ? "সম্পর্কিত শব্দ ও অর্থ (Related Words)" : "Related Words & Meanings"}
            items={details.relatedWords}
            variant="brand"
            isBn={isBn}
          />
          <TranslatedWordList
            title={isBn ? "সমার্থক শব্দ ও অর্থ (Synonyms)" : "Synonyms"}
            items={details.synonyms}
            variant="neutral"
            isBn={isBn}
          />
          <TranslatedWordList
            title={isBn ? "বিপরীত শব্দ ও অর্থ (Antonyms)" : "Antonyms"}
            items={details.antonyms}
            variant="peach"
            isBn={isBn}
          />
        </div>
      )}

      {/* Tense & Word Forms (Verb V1/V2/V3/V-ing + Noun/Adj Forms) */}
      {(details.tenseInfo?.detectedTense || hasVerbForms || hasNounAdjForms) && (
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className={cn("text-chip font-semibold text-foreground flex items-center gap-1.5", isBn && "text-bangla")}>
              <HugeiconsIcon icon={BookOpen01Icon} size={14} className="text-primary" />
              {isBn ? "Tense ও শব্দের রূপ (Word Forms)" : "Tense & Word Forms"}
            </span>
            {details.tenseInfo?.detectedTense && (
              <Badge variant="brand" size="sm" className="text-chip">
                {details.tenseInfo.detectedTense}
              </Badge>
            )}
          </div>

          {details.tenseInfo?.explanationBn && (
            <p className="text-chip text-muted-foreground text-bangla leading-relaxed">
              {details.tenseInfo.explanationBn}
            </p>
          )}

          {hasVerbForms && details.verbForms && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {details.verbForms.base && (
                <FormChip label="Base (V1)" value={details.verbForms.base} />
              )}
              {details.verbForms.thirdPerson && (
                <FormChip label="3rd Person (s/es)" value={details.verbForms.thirdPerson} />
              )}
              {details.verbForms.past && (
                <FormChip label="Past (V2)" value={details.verbForms.past} />
              )}
              {details.verbForms.pastParticiple && (
                <FormChip label="Past Participle (V3)" value={details.verbForms.pastParticiple} />
              )}
              {details.verbForms.presentParticiple && (
                <FormChip label="Continuous (-ing)" value={details.verbForms.presentParticiple} />
              )}
            </div>
          )}

          {hasNounAdjForms && details.nounAndAdjForms && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {details.nounAndAdjForms.plural && (
                <FormChip label="Plural" value={details.nounAndAdjForms.plural} />
              )}
              {details.nounAndAdjForms.comparative && (
                <FormChip label="Comparative" value={details.nounAndAdjForms.comparative} />
              )}
              {details.nounAndAdjForms.superlative && (
                <FormChip label="Superlative" value={details.nounAndAdjForms.superlative} />
              )}
            </div>
          )}
        </div>
      )}

      {/* Parts of Speech Family */}
      {hasPosFamily && details.posFamily && (
        <div className="space-y-2 pt-2 border-t border-border/60">
          <span className={cn("text-chip font-semibold text-foreground block", isBn && "text-bangla")}>
            {isBn ? "Parts of Speech অনুযায়ী রূপ" : "Parts of Speech Forms"}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {details.posFamily.noun && (
              <FormChip label="Noun" value={details.posFamily.noun} />
            )}
            {details.posFamily.verb && (
              <FormChip label="Verb" value={details.posFamily.verb} />
            )}
            {details.posFamily.adjective && (
              <FormChip label="Adjective" value={details.posFamily.adjective} />
            )}
            {details.posFamily.adverb && (
              <FormChip label="Adverb" value={details.posFamily.adverb} />
            )}
          </div>
        </div>
      )}

      {/* Sentence Making */}
      {details.sentences.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/60">
          <span className={cn("text-chip font-semibold text-foreground flex items-center gap-1.5", isBn && "text-bangla")}>
            <HugeiconsIcon icon={SparklesIcon} size={14} className="text-primary" />
            {isBn ? "বাক্য তৈরি (Sentence Making)" : "Sentence Making"}
          </span>
          <div className="space-y-2">
            {details.sentences.map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="p-2.5 rounded-control bg-muted/40 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" size="sm" className="text-chip">
                    {item.label}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => {
                      setPlayingIdx(idx);
                      speakText(item.en, {
                        onEnd: () => setPlayingIdx(null),
                        onError: () => setPlayingIdx(null),
                      });
                    }}
                    className={cn(
                      "inline-flex items-center gap-1 text-chip text-primary hover:underline cursor-pointer",
                      playingIdx === idx && "opacity-70"
                    )}
                    aria-label={`Play sentence: ${item.en}`}
                  >
                    <HugeiconsIcon icon={VolumeHighIcon} size={13} />
                    <span>{isBn ? "শুনুন" : "Play"}</span>
                  </button>
                </div>
                <p className="text-meta text-foreground leading-snug">{item.en}</p>
                <p className="text-chip text-muted-foreground text-bangla leading-relaxed">
                  {item.bn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
