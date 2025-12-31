import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down";
    period: string;
  };
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  loading,
  className,
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </p>
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {value}
          </h3>
          {change && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                change.trend === "up"
                  ? "text-success-600 dark:text-success-400"
                  : "text-error-600 dark:text-error-400"
              )}
            >
              {change.trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        {change && (
          <p className="mt-2 text-xs text-neutral-500">
            {change.trend === "up" ? "+" : "-"}
            {change.value}% from {change.period}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
