import * as React from "react";
import { cn } from "@/lib/utils";

export type HeroBandProps = React.HTMLAttributes<HTMLDivElement>;

export function HeroBand({ className, children, ...props }: HeroBandProps) {
  return (
    <div
      className={cn(
        "w-full bg-gradient-to-b from-brand-800 to-brand-900 dark:from-brand-900 dark:to-brand-950 text-white rounded-band pt-8 pb-12 md:pt-10 md:pb-14 shadow-xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
