import * as React from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm",
              "ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-primary-500 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:border-neutral-700 dark:bg-neutral-900 dark:ring-offset-neutral-950",
              "dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-300",
              error && "border-error-500 focus-visible:ring-error-500",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
