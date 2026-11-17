import * as React from "react";
import { cn } from "@/lib/utils";

export type PageContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function PageContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <div className={cn("container-app", className)} {...props}>
      {children}
    </div>
  );
}
