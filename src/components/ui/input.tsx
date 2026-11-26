"use client";

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { inputVariants, type InputVariantProps } from "./input-variants"
import { cn } from "@/lib/utils"

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    InputVariantProps {
  pill?: boolean;
}

function Input({
  className,
  type,
  variant = "outline",
  inputSize = "default",
  pill = false,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  // When variant is "ghost" (typically inside InputGroup), InputGroup owns the rainbow-border wrapper.
  if (variant === "ghost") {
    return (
      <InputPrimitive
        type={type}
        data-slot="input"
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn(inputVariants({ variant, inputSize, pill, className }))}
        {...props}
      />
    );
  }

  return (
    <div
      data-slot="input-wrapper"
      className={cn(
        "relative w-full min-w-0 transition-all duration-200",
        pill ? "rounded-pill" : "rounded-control",
        isFocused
          ? "rainbow-border border-0 shadow-none ring-0 outline-none"
          : variant === "filled"
            ? "border border-transparent bg-muted/60 hover:bg-muted"
            : "border border-input shadow-xs"
      )}
    >
      <InputPrimitive
        type={type}
        data-slot="input"
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        className={cn(
          inputVariants({ variant: "ghost", inputSize, pill, className })
        )}
        {...props}
      />
    </div>
  );
}

export { Input, inputVariants }
