/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail, Phone, MapPin, Map, Home, Calendar, MessageSquare, Heart, CheckCircle2, XCircle } from "lucide-react";

interface CustomerDetailsTabProps {
  customer: any;
}

const CustomerDetailsTab = ({ customer }: CustomerDetailsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Info Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Email */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
              <Mail className="text-primary dark:text-primary" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{customer?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
              <Phone className="text-primary dark:text-primary" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{customer?.phone || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* City */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
              <MapPin className="text-primary dark:text-primary" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">City</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{customer?.city || "Unknown"}</p>
            </div>
          </div>
        </div>

        {/* State */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
              <Map className="text-primary dark:text-primary" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">State</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{customer?.state || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
              <Home className="text-primary dark:text-primary" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Address</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{customer?.address || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Joined Date */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
              <Calendar className="text-primary dark:text-primary" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Joined</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {customer?.joined ? new Date(customer.joined).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Inquiries */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
              <MessageSquare className="text-primary dark:text-primary" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{customer?.total_inquiries || 0}</p>
            </div>
          </div>
        </div>

        {/* Total Favorites */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
              <Heart className="text-primary dark:text-primary" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Favorites</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{customer?.total_favorites || 0}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${
              customer?.status
                ? "bg-green-500/10 dark:bg-green-500/20"
                : "bg-red-500/10 dark:bg-red-500/20"
            }`}>
              {customer?.status ? (
                <CheckCircle2 className="text-green-600 dark:text-green-400" size={18} />
              ) : (
                <XCircle className="text-red-600 dark:text-red-400" size={18} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <p className={`text-sm font-semibold ${
                customer?.status
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}>
                {customer?.status ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {customer?.bio && (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-6 rounded-xl border border-primary/20 dark:border-primary/30 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <div className="w-1 h-4 bg-primary dark:bg-primary rounded-full"></div>
            Bio
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{customer.bio}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailsTab;
