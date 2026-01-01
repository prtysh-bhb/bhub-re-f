import { Activity, Eye, Heart, MessageSquare, LogIn, Calendar } from "lucide-react";

interface CustomerActivityLogsTabProps {
  customerId: number;
}

const CustomerActivityLogsTab = ({ customerId }: CustomerActivityLogsTabProps) => {
  const activities = [
    {
      action: "Viewed luxury apartment in downtown",
      date: "15 Dec 2025",
      icon: Eye,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
    },
    {
      action: "Added property to favorites",
      date: "14 Dec 2025",
      icon: Heart,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
    },
    {
      action: "Sent inquiry to agent",
      date: "13 Dec 2025",
      icon: MessageSquare,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
    },
    {
      action: "Logged in to account",
      date: "12 Dec 2025",
      icon: LogIn,
      bgColor: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-6 rounded-xl border border-primary/20 dark:border-primary/30 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
            <Activity className="text-primary dark:text-primary" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activity Logs
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">
          Recent activity for customer ID {customerId}
        </p>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${activity.bgColor} group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <Icon className={activity.iconColor} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {activity.action}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={12} />
                    <span>{activity.date}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-md">
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          Note: These are sample activity logs. Real activity data will be populated from the backend.
        </p>
      </div>
    </div>
  );
};

export default CustomerActivityLogsTab;
