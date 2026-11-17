import * as React from "react";
import { cn } from "@/lib/utils";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const levelStyles: Record<CefrLevel, string> = {
  A1: "bg-cefr-a1-bg text-cefr-a1-ink border-cefr-a1-border",
  A2: "bg-cefr-a2-bg text-cefr-a2-ink border-cefr-a2-border",
  B1: "bg-cefr-b1-bg text-cefr-b1-ink border-cefr-b1-border",
  B2: "bg-cefr-b2-bg text-cefr-b2-ink border-cefr-b2-border",
  C1: "bg-cefr-c1-bg text-cefr-c1-ink border-cefr-c1-border",
  C2: "bg-cefr-c2-bg text-cefr-c2-ink border-cefr-c2-border",
};

export interface CefrChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: CefrLevel;
  label?: string;
}

export function CefrChip({ level, label, className, ...props }: CefrChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-pill text-chip border shadow-2xs select-none",
        levelStyles[level],
        className
      )}
      {...props}
    >
      {label || level}
    </span>
  );
}

