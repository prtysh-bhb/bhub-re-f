/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAgentInquiries } from "@/api/agent/inquiry";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  User,
  Phone,
  Eye,
  MapPin,
  Home,
  DollarSign,
  ClipboardList,
  NotebookPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LeadList = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const data = await getAgentInquiries();
      setLeads(data?.inquiries || []);
    } catch {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case "new":
        return "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800";
      case "contacted":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
      case "interested":
        return "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800";
      case "closed":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800";
      case "lost":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-neutral-700";
    }
  };

  if (loading)
    return (
    <>
        <div className="p-6 flex items-center justify-center text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Loading leads...
        </div>
    </>
  );

  return (
    <>
      <div className="min-h-screen transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 mr-auto">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/30">
              <NotebookPen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">My Leads</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage and track your inquiries
              </p>
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {leads.length} lead{leads.length !== 1 && "s"}
          </span>
        </div>

        {/* Empty State */}
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ClipboardList size={50} className="text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No leads found
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="relative bg-white dark:bg-neutral-800/50 p-5 rounded-2xl shadow-lg dark:shadow-black/30 border border-gray-100 dark:border-neutral-700/50 hover:shadow-xl dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Customer Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 capitalize">
                      {lead.customer_name || "Unnamed"}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {lead.customer_email || "No email"}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex items-center">
                  <Phone className="inline mr-2 text-primary-600 dark:text-primary-400" size={14} />
                  {lead.customer_phone || "No phone"}
                </div>

                {/* Property Info */}
                {lead.property && (
                  <div className="border-t border-gray-100 dark:border-neutral-700 pt-3 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <Home size={14} className="text-primary-600 dark:text-primary-400" />
                      <span>{lead.property.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <MapPin size={14} className="text-rose-500 dark:text-rose-400" />
                      <span>{lead.property.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <DollarSign size={14} className="text-primary-500 dark:text-primary-400" />
                      <span>${Number(lead.property.price).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Stage */}
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize ${getStageColor(
                      lead.stage
                    )}`}
                  >
                    {lead.stage || "unknown"}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 cursor-pointer transition-all rounded-lg px-4 py-2"
                    onClick={() =>
                      navigate(`/agent/leads/${lead.id}`)
                    }
                  >
                    <Eye size={15} />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LeadList;
