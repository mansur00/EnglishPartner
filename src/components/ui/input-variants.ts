import { cva, type VariantProps } from "class-variance-authority"

export const inputVariants = cva(
  "w-full min-w-0 rounded-control transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-meta file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        outline:
          "border border-input bg-transparent text-foreground focus-visible:border-ring dark:bg-transparent disabled:bg-muted/30",
        filled:
          "border border-transparent bg-muted/60 hover:bg-muted focus-visible:bg-card focus-visible:border-ring disabled:bg-muted/30",
        ghost:
          "border border-transparent bg-transparent hover:bg-muted/40 focus-visible:border-ring focus-visible:bg-card disabled:bg-transparent",
      },
      inputSize: {
        sm: "h-control-sm px-3 text-meta",
        default: "h-input px-4 text-body",
        lg: "h-control-lg px-4 text-lead",
      },
      pill: {
        true: "rounded-pill",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      inputSize: "default",
      pill: false,
    },
  }
)

export type InputVariantProps = VariantProps<typeof inputVariants>;
