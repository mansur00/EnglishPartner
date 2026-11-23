"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputGroupProps extends React.ComponentProps<"div"> {
  className?: string;
  hasRainbowFocus?: boolean;
}

function InputGroup({
  className,
  children,
  hasRainbowFocus = true,
  onFocus,
  onBlur,
  ...props
}: InputGroupProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div
      data-slot="input-group"
      onFocus={(e) => {
        setIsFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
        onBlur?.(e);
      }}
      className={cn(
        "relative flex items-center w-full min-w-0 rounded-control transition-all duration-200",
        hasRainbowFocus && isFocused
          ? "rainbow-border border border-transparent shadow-none"
          : "border border-input shadow-xs",
        className
      )}
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
