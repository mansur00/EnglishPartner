import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-card border border-dashed border-border bg-card/50",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="size-control rounded-pill bg-primary/10 text-primary flex items-center justify-center mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-card-title text-foreground mb-1">
        {title}
      </h3>
      <p className="text-meta text-muted-foreground max-w-sm mb-4">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

