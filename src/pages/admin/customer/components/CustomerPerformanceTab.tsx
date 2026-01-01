import { TrendingUp, Eye, MessageSquare, Heart, ArrowUpRight } from "lucide-react";

interface CustomerPerformanceTabProps {
  customerId: number;
}

const CustomerPerformanceTab = ({ customerId }: CustomerPerformanceTabProps) => {
  const performanceMetrics = [
    {
      label: "Properties Viewed",
      value: "24",
      icon: Eye,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
      trend: "+18%",
    },
    {
      label: "Inquiries Sent",
      value: "12",
      icon: MessageSquare,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
      trend: "+24%",
    },
    {
      label: "Favorites Added",
      value: "8",
      icon: Heart,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
      trend: "+10%",
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
            Performance Tracking
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">
          Performance metrics for customer ID {customerId}
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
          Note: These are sample metrics. Performance data will be populated from the backend.
        </p>
      </div>
    </div>
  );
};

export default CustomerPerformanceTab;
