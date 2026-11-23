"use client";

import React from "react";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface LocaleTitleProps extends React.HTMLAttributes<HTMLElement> {
  titleEn: string;
  titleBn?: string | null;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p" | "div";
}

export function LocaleTitle({
  titleEn,
  titleBn,
  as: Component = "h3",
  className,
  ...props
}: LocaleTitleProps) {
  const locale = useLocale();
  const text = locale === "bn" ? titleBn || titleEn : titleEn || titleBn;
  const isBangla = locale === "bn" && !!titleBn;

  return (
    <Component
      className={cn(isBangla && "font-bangla text-bangla", className)}
      {...props}
    >
      {text}
    </Component>
  );
}
