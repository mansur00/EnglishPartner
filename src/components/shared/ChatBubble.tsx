import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  speaker?: "1" | "2";
}

export function ChatBubble({ speaker = "1", className, children, ...props }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "rounded-bubble p-3.5 shadow-2xs text-conversation max-w-bubble",
        speaker === "1"
          ? "rounded-bubble-tail-tl bg-bubble-primary text-bubble-primary-ink"
          : "rounded-bubble-tail-tr bg-topic-tile text-topic-ink",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

