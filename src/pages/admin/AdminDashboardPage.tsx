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
      admin: { color: 'text-primary-700 dark:text-primary-300', bgColor: 'bg-primary-100 dark:bg-primary-900/30' },
      agent: { color: 'text-info-700 dark:text-info-300', bgColor: 'bg-info-100 dark:bg-info-900/30' },
      customer: { color: 'text-success-700 dark:text-success-300', bgColor: 'bg-success-100 dark:bg-success-900/30' },
    };

    const config = roleConfig[role] || { color: 'text-neutral-700 dark:text-neutral-300', bgColor: 'bg-neutral-100 dark:bg-neutral-800/50' };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${config.bgColor} ${config.color} border border-neutral-200 dark:border-neutral-700/50`}>
        {role.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; bgColor: string } } = {
      published: { color: 'text-success-700 dark:text-success-300', bgColor: 'bg-success-100 dark:bg-success-900/30' },
      draft: { color: 'text-warning-700 dark:text-warning-300', bgColor: 'bg-warning-100 dark:bg-warning-900/30' },
      sold: { color: 'text-primary-700 dark:text-primary-300', bgColor: 'bg-primary-100 dark:bg-primary-900/30' },
      rented: { color: 'text-info-700 dark:text-info-300', bgColor: 'bg-info-100 dark:bg-info-900/30' },
      pending: { color: 'text-warning-700 dark:text-warning-300', bgColor: 'bg-warning-100 dark:bg-warning-900/30' },
      approved: { color: 'text-success-700 dark:text-success-300', bgColor: 'bg-success-100 dark:bg-success-900/30' },
      rejected: { color: 'text-error-700 dark:text-error-300', bgColor: 'bg-error-100 dark:bg-error-900/30' },
    };

    const config = statusConfig[status] || { color: 'text-neutral-700 dark:text-neutral-300', bgColor: 'bg-neutral-100 dark:bg-neutral-800/50' };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${config.bgColor} ${config.color} border border-neutral-200 dark:border-neutral-700/50`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
    <>
        <div className="min-h-screen bg-neutral-100/50 dark:bg-neutral-950 flex items-center justify-center">
          <Loader />
        </div>
    </>
  );
  }

  if (error) {
    return (
    <>
        <div className="min-h-screen bg-neutral-100/50 dark:bg-neutral-950 flex items-center justify-center">
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
        <div className="min-h-screen bg-neutral-100/50 dark:bg-neutral-950 flex items-center justify-center">
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
      <div className="p-6 space-y-6 bg-neutral-100/50 dark:bg-neutral-950 min-h-screen">
        {/* Welcome Header - Elegant & Professional */}
        <div className="bg-white dark:bg-neutral-900 py-8 px-8 rounded-xl border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Welcome back, {userName}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 text-base">
                System overview and performance analytics
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <Calendar className="text-neutral-500 dark:text-neutral-400" size={20} />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
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

        {/* Overview Statistics - Clean & Professional */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {overviewStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-800 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium mb-2">{stat.label}</p>
                    <p className="text-neutral-900 dark:text-neutral-100 text-2xl font-semibold">{stat.value.toLocaleString()}</p>
                    <div className="flex items-center gap-1.5 mt-3">
                      {stat.changeType === 'up' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-success-600" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-error-600" />
                      )}
                      <span className={`text-xs font-medium ${stat.changeType === 'up' ? 'text-success-600' : 'text-error-600'}`}>
                        +{stat.change} this month
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Statistics Grid - Elegant Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* User Statistics */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-semibold">User Statistics</h3>
              </div>
              <div className="space-y-3">
                {userStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between py-3 px-4 bg-neutral-50/80 dark:bg-neutral-800/50 rounded-lg border border-neutral-200/60 dark:border-neutral-700/50 hover:bg-white dark:hover:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">{stat.label}</span>
                      </div>
                      <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Property Statistics */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-semibold">Property Statistics</h3>
              </div>
              <div className="space-y-3">
                {propertyStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between py-3 px-4 bg-neutral-50/80 dark:bg-neutral-800/50 rounded-lg border border-neutral-200/60 dark:border-neutral-700/50 hover:bg-white dark:hover:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">{stat.label}</span>
                      </div>
                      <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Statistics */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-semibold">Inquiry Statistics</h3>
              </div>
              <div className="space-y-3">
                {inquiryStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between py-3 px-4 bg-neutral-50/80 dark:bg-neutral-800/50 rounded-lg border border-neutral-200/60 dark:border-neutral-700/50 hover:bg-white dark:hover:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">{stat.label}</span>
                      </div>
                      <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{stat.value}</span>
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
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-semibold">Recent Users</h3>
                </div>
              </div>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/60 dark:border-neutral-700/50 rounded-lg p-4 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="text-neutral-900 dark:text-neutral-100 text-sm font-semibold">{user.name}</p>
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
                  <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-800/30 rounded-lg border border-dashed border-neutral-300/60 dark:border-neutral-700">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50 text-primary-400 dark:text-primary-400" />
                    <p className="font-semibold">No recent users</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Properties */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-semibold">Recent Properties</h3>
                </div>
              </div>
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div 
                    key={property.id} 
                    className="bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/60 dark:border-neutral-700/50 rounded-lg p-4 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm transition-all"
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
                  <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-800/30 rounded-lg border border-dashed border-neutral-300/60 dark:border-neutral-700">
                    <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50 text-success-400 dark:text-success-400" />
                    <p className="font-semibold">No recent properties</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <Clock4 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-semibold">Pending Approvals</h3>
                </div>
                <span className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 px-3 py-1.5 rounded-full text-sm font-bold border border-neutral-200 dark:border-neutral-700">
                  {pendingApprovals.length}
                </span>
              </div>
              <div className="space-y-4">
                {pendingApprovals.map((property) => (
                  <div 
                    key={property.id} 
                    className="bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/60 dark:border-neutral-700/50 rounded-lg p-4 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm transition-all"
                  >
                    <h4 className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm mb-3 line-clamp-2">{property.title}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-warning-600 dark:text-warning-400 font-bold">{formatAmount(property.price)}</span>
                      <span className="dark:text-gray-300 text-gray-700 font-medium">{property.agent.name}</span>
                    </div>
                  </div>
                ))}
                {pendingApprovals.length === 0 && (
                  <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-800/30 rounded-lg border border-dashed border-neutral-300/60 dark:border-neutral-700">
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
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-semibold">Top Agents (Properties)</h3>
              </div>
              <div className="space-y-4">
                {topAgentsByProperties.map((agent, index) => (
                  <div 
                    key={agent.id} 
                    className="bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/60 dark:border-neutral-700/50 rounded-lg p-4 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-warning-500 text-white' :
                          index === 1 ? 'bg-neutral-400 text-white' :
                          index === 2 ? 'bg-warning-600 text-white' :
                          'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        }`}>
                          {index < 3 ? (
                            <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          ) : (
                            <span className="text-sm font-bold text-white">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-neutral-900 dark:text-neutral-100 text-sm font-semibold">{agent.name}</p>
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
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-semibold">Top Agents (Inquiries)</h3>
              </div>
              <div className="space-y-4">
                {topAgentsByInquiries.map((agent, index) => (
                  <div 
                    key={agent.id} 
                    className="bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/60 dark:border-neutral-700/50 rounded-lg p-4 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-warning-500 text-white' :
                          index === 1 ? 'bg-neutral-400 text-white' :
                          index === 2 ? 'bg-warning-600 text-white' :
                          'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        }`}>
                          {index < 3 ? (
                            <Star className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          ) : (
                            <span className="text-sm font-bold text-white">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-neutral-900 dark:text-neutral-100 text-sm font-semibold">{agent.name}</p>
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
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-semibold">Properties by Type</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {propertiesByType.map((type, index) => {
                const colors = [
                  'dark:from-blue-600 dark:to-cyan-600 from-blue-500 to-cyan-500', 
                  'dark:from-emerald-600 dark:to-green-600 from-emerald-500 to-green-500', 
                  'dark:from-rose-600 dark:to-pink-600 from-rose-500 to-pink-500',
                  'dark:from-violet-600 dark:to-purple-600 from-violet-500 to-purple-500', 
                  'dark:from-orange-600 dark:to-amber-600 from-orange-500 to-amber-500', 
                  'dark:from-teal-600 dark:to-cyan-600 from-teal-500 to-cyan-500'
                ];
                const bgColorsLight = [
                  'from-blue-50 to-cyan-50', 'from-emerald-50 to-green-50', 'from-rose-50 to-pink-50',
                  'from-violet-50 to-purple-50', 'from-orange-50 to-amber-50', 'from-teal-50 to-cyan-50'
                ];
                const bgColorsDark = [
                  'dark:from-gray-800/70 dark:to-gray-800/50', 'dark:from-gray-800/70 dark:to-gray-800/50', 'dark:from-gray-800/70 dark:to-gray-800/50',
                  'dark:from-gray-800/70 dark:to-gray-800/50', 'dark:from-gray-800/70 dark:to-gray-800/50', 'dark:from-gray-800/70 dark:to-gray-800/50'
                ];
                
                return (
                  <div 
                    key={type.type} 
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 text-center hover:shadow-md dark:hover:shadow-neutral-900/50 transition-all"
                  >
                    <div className="text-3xl font-bold mb-2 text-primary-600 dark:text-primary-400">
                      {type.count}
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-300 text-sm font-semibold capitalize">{type.type || 'Unknown'}</div>
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