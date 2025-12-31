import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        primary:
          "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
        success:
          "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
        warning:
          "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
        error:
          "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400",
        info:
          "bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400",
        outline:
          "border border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
