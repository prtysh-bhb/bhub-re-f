/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  CreditCard,
  Calendar, 
  Zap, 
  Star, 
  Edit, 
  ArrowLeft,
  Image,
  Video,
  Headphones,
  CheckCircle,
  XCircle,
  Building2,
  Crown,
  Sparkles,
  Clock,
  Tag,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { getSubscriptionPlan } from "@/api/admin/subscriptions";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatReadableDate } from "@/utils";

interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration_days: number;
  property_limit: number;
  featured_limit: number;
  image_limit: number;
  video_allowed: boolean;
  priority_support: boolean;
  is_active: boolean;
  sort_order: number;
  features: string[];
  created_at: string;
  updated_at: string;
}

const ShowSubscriptionPlan = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptionPlan();
  }, [id]);

  const fetchSubscriptionPlan = async () => {
    try {
      setLoading(true);
      const response = await getSubscriptionPlan(Number(id));
      
      if (response.success && response.data) {
        setPlan(response.data.plan);
      } else {
        toast.error("Failed to fetch subscription plan");
        navigate('/admin/subscriptions');
      }
    } catch (error: any) {
      toast.error("Error fetching subscription plan: " + (error.message || ""));
      navigate('/admin/subscriptions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
    <>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading subscription plan...</p>
          </div>
        </div>
    </>
  );
  }

  if (!plan) {
    return (
    <>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center text-gray-500">
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Subscription plan not found</p>
          </div>
        </div>
    </>
  );
  }

  return (
    <>
      <div className="space-y-6 p-6 dark:bg-gray-950 bg-gray-50 min-h-screen">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Plan Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Overview Card */}
            <Card className={`bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-2xl shadow-xl overflow-hidden`}>
              <CardContent className="p-0">
                {/* Plan Header */}
                <div className={`bg-primary-600 dark:bg-primary-700 p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{plan.name}</h2>
                        <p className="text-white/80 text-sm mt-1">/{plan.slug}</p>
                      </div>
                      <Badge 
                        variant={plan.is_active ? "default" : "secondary"}
                        className={`${
                          plan.is_active 
                            ? 'bg-white/20 backdrop-blur-sm text-white border-white/30' 
                            : 'bg-white/10 backdrop-blur-sm text-white/80 border-white/20'
                        } border text-sm font-semibold px-3 py-1`}
                      >
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                      <div>
                        <p className="text-4xl font-bold">${plan.price}</p>
                        <p className="text-white/80 text-lg">per {plan.duration_days} days</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/80 text-sm">Display Order</p>
                        <p className="text-2xl font-bold">{plan.sort_order}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Description */}
                <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{plan.description}</p>
                </div>

                {/* Plan Limits */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    Plan Limits & Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Property Limit</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Maximum properties</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                          {plan.property_limit === 0 ? 'Unlimited' : plan.property_limit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <Star className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Featured Properties</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Featured listings</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{plan.featured_limit}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <Image className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Images per Property</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Maximum images</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{plan.image_limit}</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Duration</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Plan period</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{plan.duration_days} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features List */}
            <Card className="bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  Plan Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-xl border border-primary-200 dark:border-primary-800/50"
                    >
                      <div className="w-8 h-8 bg-primary-600 dark:bg-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Premium Features */}
            <Card className="bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  Premium Features
                </h3>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                    plan.video_allowed ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/30 dark:border-primary-800/50' : 'bg-gray-50 border-gray-200 dark:bg-neutral-800 dark:border-neutral-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        plan.video_allowed ? 'bg-primary-100 dark:bg-primary-800/30' : 'bg-gray-100 dark:bg-neutral-700'
                      }`}>
                        <Video className={`w-5 h-5 ${plan.video_allowed ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Video Tours</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Property video uploads</p>
                      </div>
                    </div>
                    {plan.video_allowed ? (
                      <CheckCircle className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                    plan.priority_support ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/30 dark:border-primary-800/50' : 'bg-gray-50 border-gray-200 dark:bg-neutral-800 dark:border-neutral-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        plan.priority_support ? 'bg-primary-100 dark:bg-primary-800/30' : 'bg-gray-100 dark:bg-neutral-700'
                      }`}>
                        <Headphones className={`w-5 h-5 ${plan.priority_support ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Priority Support</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">24/7 dedicated support</p>
                      </div>
                    </div>
                    {plan.priority_support ? (
                      <CheckCircle className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Information */}
            <Card className="bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  Plan Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Plan ID</span>
                    <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white">#{plan.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">URL Slug</span>
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">/{plan.slug}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Display Order</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{plan.sort_order}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <Badge
                      variant={plan.is_active ? "default" : "secondary"}
                      className={plan.is_active ? "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400" : "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-300"}
                    >
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card className="bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  Timestamps
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Created</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatReadableDate(plan.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Last Updated</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatReadableDate(plan.updated_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate(`/admin/subscriptions/${plan.id}/edit`)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Plan
                  </Button>
                  <Button
                    onClick={() => navigate('/admin/subscriptions')}
                    variant="outline"
                    className="w-full border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowSubscriptionPlan;