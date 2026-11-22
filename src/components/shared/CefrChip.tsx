import * as React from "react";
import { cn } from "@/lib/utils";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const levelStyles: Record<CefrLevel, string> = {
  A1: "bg-cefr-a1-bg text-cefr-a1-ink",
  A2: "bg-cefr-a2-bg text-cefr-a2-ink",
  B1: "bg-cefr-b1-bg text-cefr-b1-ink",
  B2: "bg-cefr-b2-bg text-cefr-b2-ink",
  C1: "bg-cefr-c1-bg text-cefr-c1-ink",
  C2: "bg-cefr-c2-bg text-cefr-c2-ink",
};

export interface CefrChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: CefrLevel;
  label?: string;
}

export function CefrChip({ level, label, className, ...props }: CefrChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center h-6 px-2.5 rounded-pill text-chip select-none shrink-0",
        levelStyles[level],
        className
      )}
      {...props}
    >
      {label || level}
    </span>
  );
}

