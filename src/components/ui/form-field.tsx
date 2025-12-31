import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  helperText,
  children,
  className,
  labelClassName,
}) => {
  return (
    <div className={cn("w-full space-y-2", className)}>
      <label className={cn("block text-sm font-medium text-neutral-700 dark:text-neutral-300", labelClassName)}>
        {label}
        {required && <span className="text-error-600 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
};
