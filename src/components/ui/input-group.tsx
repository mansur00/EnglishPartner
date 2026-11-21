import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputGroupProps extends React.ComponentProps<"div"> {
  className?: string;
}

function InputGroup({ className, children, ...props }: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      className={cn("relative flex items-center w-full min-w-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function InputGroupPrefix({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group-prefix"
      className={cn(
        "absolute left-3.5 flex items-center justify-center text-muted-foreground pointer-events-none select-none [&>svg]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function InputGroupSuffix({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group-suffix"
      className={cn(
        "absolute right-3.5 flex items-center justify-center text-muted-foreground select-none [&>svg]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { InputGroup, InputGroupPrefix, InputGroupSuffix }
