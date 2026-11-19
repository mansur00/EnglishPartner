"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { LineAnnotation, RenderToken } from "@/lib/grammar/types";
import { resolveRenderTokens } from "@/lib/grammar/resolve";
import { useGrammar } from "@/lib/grammar/context";

interface GrammarTextProps {
  annotation: LineAnnotation;
  onTokenClick?: (token: RenderToken) => void;
  className?: string;
  lang?: "en" | "bn";
  isGrammarActive?: boolean;
}

export function GrammarText({
  annotation,
  onTokenClick,
  className,
  lang = "bn",
  isGrammarActive = true,
}: GrammarTextProps) {
  const { activeLayers, detailLevel, showLabels, focusedKey } = useGrammar();

  const renderTokens = resolveRenderTokens(annotation, {
    activeLayers: isGrammarActive ? activeLayers : [],
    detailLevel,
    showLabels: isGrammarActive ? showLabels : false,
    focusedKey: isGrammarActive ? focusedKey : null,
    lang,
  });

  return (
    <div
      className={cn("gram-container inline", className)}
      data-gram-focus-active={isGrammarActive ? Boolean(focusedKey) : undefined}
    >
      {renderTokens.map((token, index) => {
        const isPunctuation = token.pos === "punctuation";
        const isClickable = !isPunctuation && Boolean(onTokenClick);

        return (
          <React.Fragment key={`${token.i}-${index}`}>
            <span
              className={cn(
                "gram-token",
                isClickable &&
                  "cursor-pointer hover:bg-muted/40 transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
              )}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              data-gram-pos={
                isGrammarActive && token.pos !== "unannotated" ? token.pos : undefined
              }
              data-gram-role={isGrammarActive ? token.role || undefined : undefined}
              data-gram-time={isGrammarActive ? token.tenseTime || undefined : undefined}
              data-gram-aspect={isGrammarActive ? token.tenseAspect || undefined : undefined}
              data-gram-edge={isGrammarActive ? token.edge || undefined : undefined}
              data-gram-phrase={isGrammarActive ? token.phraseEdge || undefined : undefined}
              data-gram-clause={isGrammarActive ? token.clauseEdge || undefined : undefined}
              data-gram-pattern={isGrammarActive ? token.patternFamily || undefined : undefined}
              data-gram-focused={
                isGrammarActive && token.isFocused ? "true" : undefined
              }
              onClick={() => isClickable && onTokenClick?.(token)}
              onKeyDown={(e) => {
                if (isClickable && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onTokenClick?.(token);
                }
              }}
              title={
                !isPunctuation && isGrammarActive
                  ? `${token.text} (${token.pos}${token.role ? ` • ${token.role}` : ""})`
                  : undefined
              }
            >
              {token.rubyLabel && isGrammarActive ? (
                <ruby className="gram-ruby">
                  {token.text}
                  <rt className="gram-rt">{token.rubyLabel}</rt>
                </ruby>
              ) : (
                token.text
              )}
            </span>
            {/* Space between tokens if next token is not punctuation */}
            {index < renderTokens.length - 1 &&
              renderTokens[index + 1].pos !== "punctuation" &&
              " "}
          </React.Fragment>
        );
      })}
    </div>
  );
}
