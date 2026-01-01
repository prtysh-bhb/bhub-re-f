/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getPropertyStats } from "@/api/admin/property";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Home,
  BarChart3,
  Building2,
  CheckCircle2,
  XCircle,
  Clock4,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const PropertyStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPropertyStats()
      .then((data) => setStats(data))
      .catch(() => console.error("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
    <>
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-16 h-16 text-primary dark:text-primary animate-spin mx-auto" />
            <p className="text-gray-500 dark:text-gray-400">Loading statistics...</p>
          </div>
        </div>
    </>
  );

  if (!stats)
    return (
    <>
        <div className="flex flex-col justify-center items-center min-h-[70vh] text-gray-500 dark:text-gray-400">
          <Home className="w-16 h-16 mb-3 text-gray-400" />
          <p className="font-medium">No statistics available.</p>
        </div>
    </>
  );

  const statItems = [
    {
      label: "Total Properties",
      value: stats.total,
      icon: Building2,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
      borderColor: "border-primary/20 dark:border-primary/30",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Published",
      value: stats.published,
      icon: CheckCircle2,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
      borderColor: "border-primary/20 dark:border-primary/30",
      change: "+8%",
      trend: "up",
    },
    {
      label: "Pending Approval",
      value: stats.pending_approval,
      icon: Clock4,
      bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-800",
      change: "-5%",
      trend: "down",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: TrendingUp,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
      borderColor: "border-primary/20 dark:border-primary/30",
      change: "+15%",
      trend: "up",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      bgColor: "bg-red-500/10 dark:bg-red-500/20",
      iconColor: "text-red-600 dark:text-red-400",
      borderColor: "border-red-200 dark:border-red-800",
      change: "-3%",
      trend: "down",
    },
    {
      label: "Sold",
      value: stats.sold,
      icon: DollarSign,
      bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-200 dark:border-purple-800",
      change: "+22%",
      trend: "up",
    },
    {
      label: "Rented",
      value: stats.rented,
      icon: BarChart3,
      bgColor: "bg-primary-500/10 dark:bg-primary-500/20",
      iconColor: "text-primary-600 dark:text-primary-400",
      borderColor: "border-primary-200 dark:border-primary-800",
      change: "+18%",
      trend: "up",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 mr-auto">
              <div className="p-3 bg-gradient-to-br from-primary to-primary-600 rounded-xl shadow-md">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Property Statistics
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Overview of all property metrics and performance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20 dark:border-primary/30">
              <BarChart3 className="text-primary dark:text-primary" size={16} />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Live Stats
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.label}
                className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${item.bgColor} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`${item.iconColor}`} size={24} />
                    </div>
                    <div
                      className={`flex items-center gap-0.5 text-xs font-semibold ${
                        item.trend === "up"
                          ? "text-green-600 dark:text-green-500"
                          : "text-red-600 dark:text-red-500"
                      }`}
                    >
                      {item.trend === "up" ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}
                      <span>{item.change}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {item.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {item.value?.toLocaleString() || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 dark:border-primary/30 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white dark:bg-neutral-800 rounded-xl shadow-md">
                <TrendingUp className="text-primary dark:text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance Summary
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Overall property portfolio health
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Approval Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sold/Rented</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(stats.sold + stats.rented)?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.published?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PropertyStats;
