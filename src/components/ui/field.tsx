import * as React from "react"
import { cn } from "@/lib/utils"

export interface FieldProps extends React.ComponentProps<"div"> {
  orientation?: "vertical" | "horizontal";
  invalid?: boolean;
}

const FieldContext = React.createContext<{
  id: string;
  invalid: boolean;
}>({
  id: "",
  invalid: false,
})

function Field({
  className,
  orientation = "vertical",
  invalid = false,
  id: customId,
  children,
  ...props
}: FieldProps) {
  const generatedId = React.useId()
  const fieldId = customId || generatedId

  return (
    <FieldContext.Provider value={{ id: fieldId, invalid }}>
      <div
        data-slot="field"
        data-invalid={invalid ? "true" : undefined}
        className={cn(
          orientation === "horizontal"
            ? "flex items-center justify-between gap-4"
            : "flex flex-col gap-1.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </FieldContext.Provider>
  )
}

function FieldLabel({
  className,
  htmlFor,
  ...props
}: React.ComponentProps<"label">) {
  const context = React.useContext(FieldContext)
  return (
    <label
      data-slot="field-label"
      htmlFor={htmlFor || context.id}
      className={cn(
        "text-label font-semibold text-foreground select-none cursor-pointer",
        context.invalid && "text-destructive",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-chip text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const context = React.useContext(FieldContext)
  if (!children && !context.invalid) return null

  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn("text-chip text-destructive font-medium", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export { Field, FieldLabel, FieldDescription, FieldError, FieldContext }
