import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface TopicCardProps extends React.ComponentProps<typeof Card> {
  topic?: "shopping" | "travel" | "health" | "social" | "workplace" | "pro";
}

export function TopicCard({ topic, className, children, ...props }: TopicCardProps) {
  return (
    <Card
      data-topic={topic}
      className={cn(
        "rounded-card bg-card shadow-card transition-all",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
