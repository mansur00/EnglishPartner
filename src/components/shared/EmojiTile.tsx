import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmojiTileProps extends React.HTMLAttributes<HTMLDivElement> {
  emoji?: string;
}

export function EmojiTile({ emoji, className, children, ...props }: EmojiTileProps) {
  return (
    <div
      className={cn(
        "size-tile rounded-control bg-topic-tile text-topic-ink flex items-center justify-center text-stat shadow-2xs select-none shrink-0",
        className
      )}
      {...props}
    >
      {emoji || children}
    </div>
  );
}

