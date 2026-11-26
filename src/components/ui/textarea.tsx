"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.ComponentProps<"textarea">;

function Textarea({ className, onFocus, onBlur, ...props }: TextareaProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div
      data-slot="textarea-wrapper"
      className={cn(
        "relative w-full min-w-0 rounded-control transition-all duration-200",
        isFocused
          ? "rainbow-border border-0 shadow-none ring-0 outline-none"
          : "border border-input shadow-xs"
      )}
    >
      <textarea
        data-slot="textarea"
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        className={cn(
          "w-full min-w-0 rounded-control border-0 bg-transparent px-3.5 py-2.5 text-body text-foreground placeholder:text-muted-foreground outline-none focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Textarea };
