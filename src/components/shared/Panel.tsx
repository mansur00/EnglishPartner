import * as React from "react";
import { cn } from "@/lib/utils";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "topic" | "brand";
}

export function Panel({ variant = "default", className, children, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-panel p-4",
        variant === "default" && "bg-card text-card-foreground",
        variant === "topic" && "bg-topic-surface text-foreground",
        variant === "brand" && "bg-panel-brand text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

