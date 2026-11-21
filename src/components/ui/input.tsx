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
  ...props
}: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, inputSize, pill, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
