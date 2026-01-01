/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAnalytics, type AnalyticsData } from "@/api/admin/analytics";
import Loader from "@/components/ui/Loader";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  Building2,
  MessageCircle,
  Eye,
  DollarSign,
  Award,
  Calendar,
  BarChart3,
} from "lucide-react";

// Dynamic primary color palette - shades of the user's selected primary color
const COLORS = [
  "hsl(var(--primary-600))",
  "hsl(var(--primary-500))",
  "hsl(var(--primary-700))",
  "hsl(var(--primary-400))",
  "hsl(var(--primary-800))",
  "hsl(var(--primary-300))",
  "hsl(var(--primary-600))",
  "hsl(var(--primary-500))",
];

const AdminAnalyticsDashboardPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getAnalytics(period);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
    <>
        <div className="min-h-screen bg-neutral-100/50 dark:bg-neutral-950 flex items-center justify-center">
          <Loader />
        </div>
    </>
  );
  }

  return (
    <>
      <div className="p-6 space-y-6 bg-gradient-to-br from-neutral-50 via-primary-50/10 to-neutral-50 dark:from-neutral-950 dark:via-primary-950/5 dark:to-neutral-950 min-h-screen">
        {/* Welcome Header - Elegant & Professional */}
        <div className="relative bg-gradient-to-br from-white via-primary-50/20 to-primary-100/40 dark:from-neutral-900 dark:via-primary-950/20 dark:to-primary-900/30 py-10 px-8 rounded-2xl border border-primary-200/60 dark:border-primary-800/60 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/5 to-transparent opacity-50"></div>

          <div className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                  <BarChart3 className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                    Analytics Dashboard
                  </h1>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-base ml-5">
                  Visual insights and performance trends
                </p>
              </div>

              {/* Period Selector */}
              <div className="flex gap-2">
                {[7, 30, 90, 365].map((days) => (
                  <button
                    key={days}
                    onClick={() => setPeriod(days)}
                    className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                      period === days
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                        : "bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-neutral-200 dark:border-neutral-700"
                    }`}
                  >
                    {days === 365 ? "1 Year" : `${days} Days`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="group bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-md shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary-200/30 dark:hover:shadow-primary-900/20 hover:-translate-y-1 hover:border-primary-400/60 dark:hover:border-primary-600/60 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Total Views
                </p>
                <p className="text-neutral-900 dark:text-neutral-100 text-3xl font-bold">
                  {analytics.conversion_metrics.total_views.toLocaleString()}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                <Eye className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-md shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary-200/30 dark:hover:shadow-primary-900/20 hover:-translate-y-1 hover:border-primary-400/60 dark:hover:border-primary-600/60 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Total Inquiries
                </p>
                <p className="text-neutral-900 dark:text-neutral-100 text-3xl font-bold">
                  {analytics.conversion_metrics.total_inquiries.toLocaleString()}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                <MessageCircle className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-md shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary-200/30 dark:hover:shadow-primary-900/20 hover:-translate-y-1 hover:border-primary-400/60 dark:hover:border-primary-600/60 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Closed Inquiries
                </p>
                <p className="text-neutral-900 dark:text-neutral-100 text-3xl font-bold">
                  {analytics.conversion_metrics.closed_inquiries.toLocaleString()}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                <TrendingUp className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-md shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary-200/30 dark:hover:shadow-primary-900/20 hover:-translate-y-1 hover:border-primary-400/60 dark:hover:border-primary-600/60 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  View → Inquiry
                </p>
                <p className="text-neutral-900 dark:text-neutral-100 text-3xl font-bold">
                  {analytics.conversion_metrics.view_to_inquiry_rate}%
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                <TrendingUp className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-md shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary-200/30 dark:hover:shadow-primary-900/20 hover:-translate-y-1 hover:border-primary-400/60 dark:hover:border-primary-600/60 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Inquiry → Close
                </p>
                <p className="text-neutral-900 dark:text-neutral-100 text-3xl font-bold">
                  {analytics.conversion_metrics.inquiry_to_close_rate}%
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>

        {/* User Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Registrations */}
          <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                  User Registrations Over Time
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.user_trends.registrations}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" stroke="hsl(var(--neutral-300))" />
                  <XAxis dataKey="date" className="dark:text-neutral-400 text-neutral-600" />
                  <YAxis className="dark:text-neutral-400 text-neutral-600" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--neutral-900))",
                      border: "none",
                      borderRadius: "8px",
                      color: "hsl(var(--neutral-100))",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stackId="1"
                    stroke="hsl(var(--primary-600))"
                    fill="hsl(var(--primary-600))"
                    name="Total"
                  />
                  <Area
                    type="monotone"
                    dataKey="agents"
                    stackId="2"
                    stroke="hsl(var(--primary-500))"
                    fill="hsl(var(--primary-500))"
                    name="Agents"
                  />
                  <Area
                    type="monotone"
                    dataKey="customers"
                    stackId="2"
                    stroke="hsl(var(--primary-400))"
                    fill="hsl(var(--primary-400))"
                    name="Customers"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Role Distribution */}
          <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                  User Distribution by Role
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.user_trends.role_distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.role}: ${entry.count}`}
                    outerRadius={100}
                    fill="hsl(var(--primary-500))"
                    dataKey="count"
                  >
                    {analytics.user_trends.role_distribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--neutral-900))",
                      border: "none",
                      borderRadius: "8px",
                      color: "hsl(var(--neutral-100))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Property Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Listings */}
          <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                  Property Listings Trend
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.property_trends.listings}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" stroke="hsl(var(--neutral-300))" />
                  <XAxis dataKey="date" className="dark:text-neutral-400 text-neutral-600" />
                  <YAxis className="dark:text-neutral-400 text-neutral-600" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--neutral-900))",
                      border: "none",
                      borderRadius: "8px",
                      color: "hsl(var(--neutral-100))",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary-600))"
                    strokeWidth={2}
                    name="Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="published"
                    stroke="hsl(var(--primary-500))"
                    strokeWidth={2}
                    name="Published"
                  />
                  <Line
                    type="monotone"
                    dataKey="sold"
                    stroke="hsl(var(--primary-700))"
                    strokeWidth={2}
                    name="Sold"
                  />
                  <Line
                    type="monotone"
                    dataKey="rented"
                    stroke="hsl(var(--primary-400))"
                    strokeWidth={2}
                    name="Rented"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Property Status Distribution */}
          <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                  Properties by Status
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.property_trends.status_summary}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" stroke="hsl(var(--neutral-300))" />
                  <XAxis dataKey="status" className="dark:text-neutral-400 text-neutral-600" />
                  <YAxis className="dark:text-neutral-400 text-neutral-600" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--neutral-900))",
                      border: "none",
                      borderRadius: "8px",
                      color: "hsl(var(--neutral-100))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(var(--primary-600))" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Inquiry and View Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inquiry Trends */}
          <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">Inquiry Trends</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.inquiry_trends.trends}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" stroke="hsl(var(--neutral-300))" />
                  <XAxis dataKey="date" className="dark:text-neutral-400 text-neutral-600" />
                  <YAxis className="dark:text-neutral-400 text-neutral-600" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--neutral-900))",
                      border: "none",
                      borderRadius: "8px",
                      color: "hsl(var(--neutral-100))",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="new"
                    stackId="1"
                    stroke="hsl(var(--primary-600))"
                    fill="hsl(var(--primary-600))"
                    name="New"
                  />
                  <Area
                    type="monotone"
                    dataKey="contacted"
                    stackId="1"
                    stroke="hsl(var(--primary-500))"
                    fill="hsl(var(--primary-500))"
                    name="Contacted"
                  />
                  <Area
                    type="monotone"
                    dataKey="closed"
                    stackId="1"
                    stroke="hsl(var(--primary-400))"
                    fill="hsl(var(--primary-400))"
                    name="Closed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Property Views */}
          <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                  Property Views Over Time
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.view_trends.trends}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" stroke="hsl(var(--neutral-300))" />
                  <XAxis dataKey="date" className="dark:text-neutral-400 text-neutral-600" />
                  <YAxis className="dark:text-neutral-400 text-neutral-600" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--neutral-900))",
                      border: "none",
                      borderRadius: "8px",
                      color: "hsl(var(--neutral-100))",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary-600))"
                    fill="hsl(var(--primary-600))"
                    name="Views"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Financial Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Revenue */}
          <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                  Payment Revenue Trend
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.financial_trends.payments}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" stroke="hsl(var(--neutral-300))" />
                  <XAxis dataKey="date" className="dark:text-neutral-400 text-neutral-600" />
                  <YAxis className="dark:text-neutral-400 text-neutral-600" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--neutral-900))",
                      border: "none",
                      borderRadius: "8px",
                      color: "hsl(var(--neutral-100))",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total_amount"
                    stroke="hsl(var(--primary-600))"
                    fill="hsl(var(--primary-600))"
                    name="Revenue ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subscriptions */}
          <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                  New Subscriptions
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.financial_trends.subscriptions}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" stroke="hsl(var(--neutral-300))" />
                  <XAxis dataKey="date" className="dark:text-neutral-400 text-neutral-600" />
                  <YAxis className="dark:text-neutral-400 text-neutral-600" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--neutral-900))",
                      border: "none",
                      borderRadius: "8px",
                      color: "hsl(var(--neutral-100))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(var(--primary-600))" name="Subscriptions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Agents by Properties */}
          <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                  Top Agents by Properties
                </h3>
              </div>
              <div className="space-y-3">
                {analytics.agent_performance.by_properties.slice(0, 5).map((agent, index) => (
                  <div
                    key={agent.id}
                    className="group bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-800/30 dark:to-neutral-800/10 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl p-4 hover:from-primary-50/30 hover:to-white dark:hover:from-primary-900/10 dark:hover:to-neutral-800/20 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-lg hover:shadow-primary-200/10 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-full flex items-center justify-center font-bold shadow-md shadow-primary-500/30 group-hover:scale-110 transition-transform duration-200">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm">
                            {agent.name}
                          </p>
                          <p className="text-neutral-600 dark:text-neutral-400 text-xs">{agent.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {agent.properties_count}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 font-semibold">Properties</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Agents by Inquiries */}
          <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                  Top Agents by Inquiries
                </h3>
              </div>
              <div className="space-y-3">
                {analytics.agent_performance.by_inquiries.slice(0, 5).map((agent, index) => (
                  <div
                    key={agent.id}
                    className="group bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-800/30 dark:to-neutral-800/10 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl p-4 hover:from-primary-50/30 hover:to-white dark:hover:from-primary-900/10 dark:hover:to-neutral-800/20 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-lg hover:shadow-primary-200/10 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-full flex items-center justify-center font-bold shadow-md shadow-primary-500/30 group-hover:scale-110 transition-transform duration-200">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm">
                            {agent.name}
                          </p>
                          <p className="text-neutral-600 dark:text-neutral-400 text-xs">{agent.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {agent.inquiries_count}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 font-semibold">Inquiries</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Rated Agents */}
          <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                  Top Rated Agents
                </h3>
              </div>
              <div className="space-y-3">
                {analytics.agent_performance.top_rated.slice(0, 5).map((agent, index) => (
                  <div
                    key={agent.id}
                    className="group bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-800/30 dark:to-neutral-800/10 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl p-4 hover:from-primary-50/30 hover:to-white dark:hover:from-primary-900/10 dark:hover:to-neutral-800/20 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-lg hover:shadow-primary-200/10 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-full flex items-center justify-center font-bold shadow-md shadow-primary-500/30 group-hover:scale-110 transition-transform duration-200">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm">
                            {agent.name}
                          </p>
                          <p className="text-neutral-600 dark:text-neutral-400 text-xs">
                            {agent.review_count} reviews
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {Number(agent.avg_rating).toFixed(1)} ★
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 font-semibold">Rating</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Type Distribution */}
        <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                Properties by Type
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.property_trends.type_distribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" stroke="hsl(var(--neutral-300))" />
                <XAxis type="number" className="dark:text-neutral-400 text-neutral-600" />
                <YAxis
                  dataKey="type"
                  type="category"
                  width={100}
                  className="dark:text-neutral-400 text-neutral-600"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--neutral-900))",
                    border: "none",
                    borderRadius: "8px",
                    color: "hsl(var(--neutral-100))",
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary-600))" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Viewed Properties */}
        <Card className="bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 border border-primary-200/40 dark:border-primary-800/40 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                Most Viewed Properties
              </h3>
            </div>
            <div className="space-y-3">
              {analytics.view_trends.top_properties.slice(0, 10).map((item, index) => (
                <div
                  key={item.property_id}
                  className="group bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-800/30 dark:to-neutral-800/10 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl p-4 hover:from-primary-50/30 hover:to-white dark:hover:from-primary-900/10 dark:hover:to-neutral-800/20 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-lg hover:shadow-primary-200/10 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-full flex items-center justify-center font-bold shadow-md shadow-primary-500/30 group-hover:scale-110 transition-transform duration-200">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm">
                          {item.property?.title || `Property #${item.property_id}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {item.view_count.toLocaleString()}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 font-semibold">Views</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminAnalyticsDashboardPage;
