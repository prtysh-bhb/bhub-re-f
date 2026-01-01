import { TrendingUp, Clock, Star, Target, ArrowUpRight } from "lucide-react";

const AgentPerformanceTab = ({ agentId }: { agentId: number }) => {
  // Later, connect to real metrics endpoint `/admin/agents/{id}/performance`

  const performanceMetrics = [
    {
      label: "Sales Conversion Rate",
      value: "78%",
      icon: Target,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
      borderColor: "border-primary/20 dark:border-primary/30",
      trend: "+12%",
    },
    {
      label: "Avg Response Time",
      value: "2.4 hrs",
      icon: Clock,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
      borderColor: "border-primary/20 dark:border-primary/30",
      trend: "-15%",
    },
    {
      label: "Client Satisfaction",
      value: "4.5/5",
      icon: Star,
      bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-800",
      trend: "+8%",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-6 rounded-xl border border-primary/20 dark:border-primary/30 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <TrendingUp className="text-primary dark:text-primary" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance Overview
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">
          Performance metrics for agent #{agentId}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${metric.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={metric.iconColor} size={20} />
                </div>
                <div className="flex items-center gap-0.5 text-xs font-semibold text-green-600 dark:text-green-500">
                  <ArrowUpRight size={14} />
                  <span>{metric.trend}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md">
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          Note: These are sample metrics. Connect to real endpoint at <code className="text-primary dark:text-primary">/admin/agents/{agentId}/performance</code> for live data.
        </p>
      </div>
    </div>
  );
};

export default AgentPerformanceTab;
