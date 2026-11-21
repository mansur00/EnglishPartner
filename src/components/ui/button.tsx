import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { buttonVariants, type ButtonVariantProps } from "./button-variants"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends ButtonPrimitive.Props,
    ButtonVariantProps {
  loading?: boolean;
  pill?: boolean;
}

function Button({
  className,
  variant = "default",
  size = "default",
  pill = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || loading}
      aria-busy={loading ? "true" : undefined}
      className={cn(buttonVariants({ variant, size, pill, className }))}
      {...props}
    >
      {loading && (
        <svg
          className="size-4 animate-spin shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
