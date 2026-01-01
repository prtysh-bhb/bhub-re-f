import { AgentProfile } from "@/api/agent/agentProfile";
import { Mail, Phone, Building2, CreditCard, MapPin, CheckCircle2, XCircle, Home, Calendar } from "lucide-react";

const AgentDetailsTab = ({ agent }: { agent: AgentProfile }) => (
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
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{agent.email}</p>
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
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{agent.phone}</p>
          </div>
        </div>
      </div>

      {/* Company Name */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
            <Building2 className="text-primary dark:text-primary" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Company Name</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{agent.company_name}</p>
          </div>
        </div>
      </div>

      {/* Licence Number */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
            <CreditCard className="text-primary dark:text-primary" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Licence Number</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{agent.licence_number || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
            <MapPin className="text-primary dark:text-primary" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Location</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{agent.city}</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${
            agent.status
              ? "bg-green-500/10 dark:bg-green-500/20"
              : "bg-red-500/10 dark:bg-red-500/20"
          }`}>
            {agent.status ? (
              <CheckCircle2 className="text-green-600 dark:text-green-400" size={18} />
            ) : (
              <XCircle className="text-red-600 dark:text-red-400" size={18} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
            <p className={`text-sm font-semibold ${
              agent.status
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {agent.status ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>

      {/* Total Properties */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/40 transition-all group">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
            <Home className="text-primary dark:text-primary" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Properties</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{agent.total_properties}</p>
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
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{new Date(agent.joined).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Bio Section */}
    {agent.bio && (
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-6 rounded-xl border border-primary/20 dark:border-primary/30 shadow-lg">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <div className="w-1 h-4 bg-primary dark:bg-primary rounded-full"></div>
          Bio
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{agent.bio}</p>
      </div>
    )}
  </div>
);

export default AgentDetailsTab;
