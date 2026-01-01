/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/api/axios";
import { getProfile } from "@/api/admin/profileApi";
import { 
  Users, 
  Building2, 
  MessageCircle, 
  Eye, 
  UserCheck, 
  UserX,
  CheckCircle2,
  Clock4,
  XCircle,
  TrendingUp,
  BarChart3,
  Home,
  Shield,
  Mail,
  Calendar,
  ArrowUp,
  ArrowDown,
  Award,
  Rocket,
  Star,
  Zap
} from "lucide-react";
import { formatAmount, formatReadableDate } from "@/helpers/customer_helper";
import Loader from "@/components/ui/Loader";

interface DashboardResponse {
  success: boolean;
  message: string;
  role: string;
  data: {
    stats: {
      users: {
        total: number;
        agents: number;
        customers: number;
        admins: number;
        active: number;
        deactivated: number;
        this_month: number;
      };
      properties: {
        total: number;
        published: number;
        draft: number;
        sold: number;
        rented: number;
        pending_approval: number;
        approved: number;
        rejected: number;
        this_month: number;
      };
      inquiries: {
        total: number;
        new: number;
        contacted: number;
        closed: number;
        recent: number;
        this_month: number;
      };
      views: {
        total: number;
        this_month: number;
        today: number;
      };
    };
    recent_users: Array<{
      id: number;
      name: string;
      email: string;
      role: string;
      created_at: string;
    }>;
    recent_properties: Array<{
      id: number;
      title: string;
      price: number;
      status: string;
      approval_status: string;
      agent_id: number;
      created_at: string;
      agent: {
        id: number;
        name: string;
        email: string;
      };
    }>;
    pending_approvals: Array<{
      id: number;
      title: string;
      price: number;
      agent_id: number;
      created_at: string;
      agent: {
        id: number;
        name: string;
        email: string;
      };
    }>;
    top_agents_by_properties: Array<{
      id: number;
      name: string;
      email: string;
      properties_count: number;
    }>;
    top_agents_by_inquiries: Array<{
      id: number;
      name: string;
      email: string;
      inquiries_count: number;
    }>;
    properties_by_type: Array<{
      type: string;
      count: number;
    }>;
  };
}

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const profileRes = await getProfile();
        const user = profileRes.data.data.user;
        setProfile(user);

        const res = await api.get<DashboardResponse>("/admin/dashboard");        
        setDashboardData(res.data);

      } catch (err: any) {
        console.error("Error fetching dashboard:", err);
        if (err.response?.status === 403) {
          setError("Access denied. You are not authorized to view this dashboard.");
        } else {
          setError("Failed to fetch dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchAll();
  }, []);

  const stats = dashboardData?.data?.stats;
  const recentUsers = dashboardData?.data?.recent_users || [];
  const recentProperties = dashboardData?.data?.recent_properties || [];
  const pendingApprovals = dashboardData?.data?.pending_approvals || [];
  const topAgentsByProperties = dashboardData?.data?.top_agents_by_properties || [];
  const topAgentsByInquiries = dashboardData?.data?.top_agents_by_inquiries || [];
  const propertiesByType = dashboardData?.data?.properties_by_type || [];

  // Overview Statistics
  const overviewStats = [
    { label: "Total Users", value: stats?.users.total || 0, icon: Users, change: stats?.users.this_month || 0, changeType: "up" as const },
    { label: "Total Properties", value: stats?.properties.total || 0, icon: Building2, change: stats?.properties.this_month || 0, changeType: "up" as const },
    { label: "Total Inquiries", value: stats?.inquiries.total || 0, icon: MessageCircle, change: stats?.inquiries.this_month || 0, changeType: "up" as const },
    { label: "Property Views", value: stats?.views.total || 0, icon: Eye, change: stats?.views.this_month || 0, changeType: "up" as const }
  ];

  // User Statistics
  const userStats = [
    { label: "Agents", value: stats?.users.agents || 0, icon: Users },
    { label: "Customers", value: stats?.users.customers || 0, icon: UserCheck },
    { label: "Admins", value: stats?.users.admins || 0, icon: Shield },
    { label: "Active Users", value: stats?.users.active || 0, icon: UserCheck },
    { label: "Deactivated", value: stats?.users.deactivated || 0, icon: UserX },
  ];

  // Property Statistics
  const propertyStats = [
    { label: "Published", value: stats?.properties.published || 0, icon: CheckCircle2 },
    { label: "Draft", value: stats?.properties.draft || 0, icon: Clock4 },
    { label: "Sold", value: stats?.properties.sold || 0, icon: TrendingUp },
    { label: "Rented", value: stats?.properties.rented || 0, icon: Home },
    { label: "Pending Approval", value: stats?.properties.pending_approval || 0, icon: Clock4 },
    { label: "Approved", value: stats?.properties.approved || 0, icon: CheckCircle2 },
    { label: "Rejected", value: stats?.properties.rejected || 0, icon: XCircle },
  ];

  // Inquiry Statistics
  const inquiryStats = [
    { label: "New", value: stats?.inquiries.new || 0, icon: Mail },
    { label: "Contacted", value: stats?.inquiries.contacted || 0, icon: MessageCircle },
    { label: "Closed", value: stats?.inquiries.closed || 0, icon: CheckCircle2 },
    { label: "Recent (7d)", value: stats?.inquiries.recent || 0, icon: Calendar },
  ];

  const getRoleBadge = (role: string) => {
    const roleConfig: { [key: string]: { color: string; bgColor: string } } = {
      admin: { color: 'text-primary-700 dark:text-primary-300', bgColor: 'bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/20' },
      agent: { color: 'text-primary-600 dark:text-primary-400', bgColor: 'bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-900/10' },
      customer: { color: 'text-primary-600 dark:text-primary-400', bgColor: 'bg-gradient-to-r from-primary-100/80 to-primary-50/50 dark:from-primary-900/25 dark:to-primary-900/15' },
    };

    const config = roleConfig[role] || { color: 'text-neutral-700 dark:text-neutral-300', bgColor: 'bg-neutral-100 dark:bg-neutral-800/50' };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${config.bgColor} ${config.color} border border-primary-200/60 dark:border-primary-800/40 shadow-sm`}>
        {role.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; bgColor: string } } = {
      published: { color: 'text-primary-700 dark:text-primary-300', bgColor: 'bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/20' },
      draft: { color: 'text-neutral-600 dark:text-neutral-400', bgColor: 'bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800/30 dark:to-neutral-800/20' },
      sold: { color: 'text-primary-700 dark:text-primary-300', bgColor: 'bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/20' },
      rented: { color: 'text-primary-600 dark:text-primary-400', bgColor: 'bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-900/10' },
      pending: { color: 'text-neutral-600 dark:text-neutral-400', bgColor: 'bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800/30 dark:to-neutral-800/20' },
      approved: { color: 'text-primary-700 dark:text-primary-300', bgColor: 'bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/20' },
      rejected: { color: 'text-error-700 dark:text-error-300', bgColor: 'bg-gradient-to-r from-error-100 to-error-50 dark:from-error-900/30 dark:to-error-900/20' },
    };

    const config = statusConfig[status] || { color: 'text-neutral-700 dark:text-neutral-300', bgColor: 'bg-neutral-100 dark:bg-neutral-800/50' };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${config.bgColor} ${config.color} border border-primary-200/60 dark:border-primary-800/40 shadow-sm`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
    <>
        <div className="min-h-screen  flex items-center justify-center">
          <Loader />
        </div>
    </>
  );
  }

  if (error) {
    return (
    <>
        <div className="min-h-screen  flex items-center justify-center">
          <div className="text-center text-error-600 dark:text-error-400 p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800">
            <XCircle className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </div>
    </>
  );
  }

  if (!profile) {
    return (
    <>
        <div className="min-h-screen  flex items-center justify-center">
          <div className="text-center text-neutral-500 dark:text-neutral-400 p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800">
            <Users className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-semibold">No profile data found.</p>
          </div>
        </div>
    </>
  );
  }

  const userName = profile.name || "Admin";

  return (
    <>
      <div className="p-6 space-y-6 min-h-screen">
        {/* Welcome Header - Elegant & Professional */}
        <div className="relative bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-primary-950/20 py-6 px-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/5 to-transparent opacity-50"></div>

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                  Welcome back, {userName}
                </h1>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-base ml-5">
                System overview and performance analytics
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 px-5 py-3.5 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 shadow-sm">
              <Calendar className="text-primary-600 dark:text-primary-400" size={20} />
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Overview Statistics - Elegant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {overviewStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-md shadow-neutral-200/50 dark:shadow-black/20 border border-neutral-200/60 dark:border-neutral-800/60 hover:shadow-xl hover:shadow-primary-200/30 dark:hover:shadow-primary-900/20 hover:-translate-y-1 hover:border-primary-400/60 dark:hover:border-primary-600/60 transition-all duration-300"
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 via-primary-50/0 to-primary-100/20 dark:from-primary-950/0 dark:via-primary-950/0 dark:to-primary-900/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>

                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-3">{stat.label}</p>
                    <p className="text-neutral-900 dark:text-neutral-100 text-3xl font-bold mb-3">{stat.value.toLocaleString()}</p>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-full w-fit">
                      {stat.changeType === 'up' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                      )}
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                        +{stat.change}
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">this month</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Statistics Grid - Elegant Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Statistics */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">User Statistics</h3>
              </div>
              <div className="space-y-2.5">
                {userStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="group flex items-center justify-between py-3.5 px-4 bg-gradient-to-r from-neutral-50 to-neutral-50/50 dark:from-neutral-800/40 dark:to-neutral-800/20 rounded-xl border border-neutral-200/60 dark:border-neutral-700/50 hover:from-primary-50/50 hover:to-primary-50/20 dark:hover:from-primary-900/20 dark:hover:to-primary-900/10 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-md hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 border border-primary-200/60 dark:border-primary-800/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm font-semibold">{stat.label}</span>
                      </div>
                      <span className="text-neutral-900 dark:text-neutral-100 font-bold text-lg">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Property Statistics */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">Property Statistics</h3>
              </div>
              <div className="space-y-2.5">
                {propertyStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="group flex items-center justify-between py-3.5 px-4 bg-gradient-to-r from-neutral-50 to-neutral-50/50 dark:from-neutral-800/40 dark:to-neutral-800/20 rounded-xl border border-neutral-200/60 dark:border-neutral-700/50 hover:from-primary-50/50 hover:to-primary-50/20 dark:hover:from-primary-900/20 dark:hover:to-primary-900/10 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-md hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 border border-primary-200/60 dark:border-primary-800/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm font-semibold">{stat.label}</span>
                      </div>
                      <span className="text-neutral-900 dark:text-neutral-100 font-bold text-lg">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Statistics */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <MessageCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">Inquiry Statistics</h3>
              </div>
              <div className="space-y-2.5">
                {inquiryStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="group flex items-center justify-between py-3.5 px-4 bg-gradient-to-r from-neutral-50 to-neutral-50/50 dark:from-neutral-800/40 dark:to-neutral-800/20 rounded-xl border border-neutral-200/60 dark:border-neutral-700/50 hover:from-primary-50/50 hover:to-primary-50/20 dark:hover:from-primary-900/20 dark:hover:to-primary-900/10 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-md hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 border border-primary-200/60 dark:border-primary-800/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm font-semibold">{stat.label}</span>
                      </div>
                      <span className="text-neutral-900 dark:text-neutral-100 font-bold text-lg">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Pending Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                    <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">Recent Users</h3>
                </div>
              </div>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="group bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-800/30 dark:to-neutral-800/10 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl p-4 hover:from-primary-50/30 hover:to-white dark:hover:from-primary-900/10 dark:hover:to-neutral-800/20 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-lg hover:shadow-primary-200/10 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-full flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-110 transition-transform duration-200">
                          <Users className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-neutral-900 dark:text-neutral-100 text-sm font-bold">{user.name}</p>
                          <p className="text-neutral-600 dark:text-neutral-400 text-xs">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getRoleBadge(user.role)}
                        <p className="text-neutral-500 dark:text-neutral-500 text-xs mt-2 font-medium">{formatReadableDate(user.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentUsers.length === 0 && (
                  <div className="text-center py-10 text-neutral-500 dark:text-neutral-400 bg-gradient-to-br from-neutral-50 to-neutral-100/50 dark:from-neutral-800/30 dark:to-neutral-800/10 rounded-xl border-2 border-dashed border-neutral-300/60 dark:border-neutral-700">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50 text-primary-400 dark:text-primary-400" />
                    <p className="font-semibold">No recent users</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Properties */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                    <Rocket className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">Recent Properties</h3>
                </div>
              </div>
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div 
                    key={property.id} 
                    className="group bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-800/30 dark:to-neutral-800/10 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl p-4 hover:from-primary-50/30 hover:to-white dark:hover:from-primary-900/10 dark:hover:to-neutral-800/20 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-lg hover:shadow-primary-200/10 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm line-clamp-2 flex-1 pr-4">{property.title}</h4>
                      {getStatusBadge(property.status)}
                    </div>
                    <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                      <span className="text-primary-600 dark:text-primary-400 font-bold">{formatAmount(property.price)}</span>
                      <span className="font-medium">{property.agent.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(property.approval_status)}
                      <span className="text-neutral-500 dark:text-neutral-500 text-xs font-medium">{formatReadableDate(property.created_at)}</span>
                    </div>
                  </div>
                ))}
                {recentProperties.length === 0 && (
                  <div className="text-center py-10 text-neutral-500 dark:text-neutral-400 bg-gradient-to-br from-neutral-50 to-neutral-100/50 dark:from-neutral-800/30 dark:to-neutral-800/10 rounded-xl border-2 border-dashed border-neutral-300/60 dark:border-neutral-700">
                    <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50 text-success-400 dark:text-success-400" />
                    <p className="font-semibold">No recent properties</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                    <Clock4 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">Pending Approvals</h3>
                </div>
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-primary-500 px-3 py-1.5 rounded-full text-sm font-bold shadow-md shadow-primary-500/30">
                  {pendingApprovals.length}
                </span>
              </div>
              <div className="space-y-4">
                {pendingApprovals.map((property) => (
                  <div 
                    key={property.id} 
                    className="group bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-800/30 dark:to-neutral-800/10 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl p-4 hover:from-primary-50/30 hover:to-white dark:hover:from-primary-900/10 dark:hover:to-neutral-800/20 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-lg hover:shadow-primary-200/10 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <h4 className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm mb-3 line-clamp-2">{property.title}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary-600 dark:text-primary-400 font-bold">{formatAmount(property.price)}</span>
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium">{property.agent.name}</span>
                    </div>
                  </div>
                ))}
                {pendingApprovals.length === 0 && (
                  <div className="text-center py-10 text-neutral-500 dark:text-neutral-400 bg-gradient-to-br from-neutral-50 to-neutral-100/50 dark:from-neutral-800/30 dark:to-neutral-800/10 rounded-xl border-2 border-dashed border-neutral-300/60 dark:border-neutral-700">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50 text-success-400 dark:text-success-400" />
                    <p className="font-semibold">No pending approvals</p>
                    <p className="text-sm mt-1">All caught up! 🎉</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Agents by Properties */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">Top Agents (Properties)</h3>
              </div>
              <div className="space-y-4">
                {topAgentsByProperties.map((agent, index) => (
                  <div 
                    key={agent.id} 
                    className="group bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-800/30 dark:to-neutral-800/10 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl p-4 hover:from-primary-50/30 hover:to-white dark:hover:from-primary-900/10 dark:hover:to-neutral-800/20 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-lg hover:shadow-primary-200/10 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 duration-200 ${
                          index === 0 ? 'bg-gradient-to-br from-primary-400 to-primary-500 text-primary-500 shadow-primary-500/30' :
                          index === 1 ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-primary-500 shadow-primary-600/30' :
                          index === 2 ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-primary-500 shadow-primary-700/30' :
                          'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        }`}>
                          {index < 3 ? (
                            <Award className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-neutral-900 dark:text-neutral-100 text-sm font-bold">{agent.name}</p>
                          <p className="text-neutral-600 dark:text-neutral-400 text-xs">{agent.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-900 dark:text-neutral-100 font-bold text-lg">{agent.properties_count}</span>
                        <p className="text-neutral-500 dark:text-neutral-500 text-xs font-semibold">properties</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Agents by Inquiries */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                  <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">Top Agents (Inquiries)</h3>
              </div>
              <div className="space-y-4">
                {topAgentsByInquiries.map((agent, index) => (
                  <div 
                    key={agent.id} 
                    className="group bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-800/30 dark:to-neutral-800/10 border border-neutral-200/60 dark:border-neutral-700/50 rounded-xl p-4 hover:from-primary-50/30 hover:to-white dark:hover:from-primary-900/10 dark:hover:to-neutral-800/20 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:shadow-lg hover:shadow-primary-200/10 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 duration-200 ${
                          index === 0 ? 'bg-gradient-to-br from-primary-400 to-primary-500 text-primary-500 shadow-primary-500/30' :
                          index === 1 ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-primary-500 shadow-primary-600/30' :
                          index === 2 ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-primary-500 shadow-primary-700/30' :
                          'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        }`}>
                          {index < 3 ? (
                            <Star className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-neutral-900 dark:text-neutral-100 text-sm font-bold">{agent.name}</p>
                          <p className="text-neutral-600 dark:text-neutral-400 text-xs">{agent.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-900 dark:text-neutral-100 font-bold text-lg">{agent.inquiries_count}</span>
                        <p className="text-neutral-500 dark:text-neutral-500 text-xs font-semibold">inquiries</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Types Distribution */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 rounded-2xl hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/30">
                <Home className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">Properties by Type</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {propertiesByType.map((type, index) => {
                // Different primary color shades for visual variety while staying on brand
                const shades = [
                  'from-primary-400 to-primary-500',
                  'from-primary-500 to-primary-600',
                  'from-primary-600 to-primary-700',
                  'from-primary-500 to-primary-600',
                  'from-primary-400 to-primary-500',
                  'from-primary-600 to-primary-700'
                ];

                return (
                  <div
                    key={type.type}
                    className="group relative bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl p-6 text-center hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 hover:-translate-y-1 hover:border-primary-400/60 dark:hover:border-primary-600/60 transition-all duration-300 overflow-hidden"
                  >
                    {/* Background gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/20 dark:from-primary-950/0 dark:to-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${shades[index % shades.length]} shadow-lg shadow-primary-500/20 mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl font-semibold text-primary-500">{type.count}</span>
                      </div>
                      <div className="text-neutral-700 dark:text-neutral-300 text-sm font-bold capitalize">{type.type || 'Unknown'}</div>
                    </div>
                  </div>
                );
              })}
              {propertiesByType.length === 0 && (
                <div className="col-span-full text-center py-12 text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-700">
                  <Home className="w-16 h-16 mx-auto mb-4 opacity-50 text-primary-400 dark:text-primary-400" />
                  <p className="text-lg font-semibold">No property type data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboardPage;