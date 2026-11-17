import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  speaker?: "1" | "2";
}

export function ChatBubble({ speaker = "1", className, children, ...props }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "rounded-bubble p-3.5 shadow-2xs text-body border border-border max-w-[88%]",
        speaker === "1"
          ? "rounded-bubble-tail-tl bg-brand-100 dark:bg-brand-950/40 text-brand-950 dark:text-brand-100"
          : "rounded-bubble-tail-tr bg-topic-tile text-topic-ink",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

