/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAdminProperties, approveProperty, rejectProperty } from "@/api/admin/property";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Check,
  X,
  Home,
  AlertTriangle,
  Grid3x3,
  List,
  Search,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  DollarSign,
  Star,
} from "lucide-react";
import { toast } from "sonner";

const PropertyList = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingPropertyId, setRejectingPropertyId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch all properties
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await getAdminProperties({
        approval_status: selectedFilter,
      });
      setProperties(data?.properties ?? []);
    } catch {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [selectedFilter]);

  // ✅ Approve property
  const handleApprove = async (id: number) => {
    try {
      await approveProperty(id);
      toast.success("Property approved successfully");
      fetchProperties();
    } catch {
      toast.error("Failed to approve property");
    }
  };

  // ✅ Show reject popup
  const openRejectPopup = (id: number) => {
    setRejectingPropertyId(id);
    setRejectReason("");
    setShowRejectPopup(true);
  };

  // ✅ Confirm reject
  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a reason for rejection");
      return;
    }

    if (!rejectingPropertyId) {
      toast.error("No property selected for rejection");
      return;
    }

    try {
      await rejectProperty(rejectingPropertyId, rejectReason);
      toast.success("Property rejected successfully");
      setShowRejectPopup(false);
      setRejectingPropertyId(null);
      fetchProperties();
    } catch {
      toast.error("Failed to reject property");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border-primary-300 dark:border-primary-700 shadow-sm shadow-primary-100 dark:shadow-primary-900/20";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700 shadow-sm shadow-amber-100 dark:shadow-amber-900/20";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700 shadow-sm shadow-red-100 dark:shadow-red-900/20";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600";
    }
  };

  // Filter properties by search query
  const filteredProperties = properties.filter(
    (p) =>
      (p.title || "").toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.agent?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg shadow-primary-500/5 dark:shadow-primary-500/10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3 mr-auto">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/30 dark:shadow-primary-500/40">
                <List className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Properties Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage and approve property listings
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 shadow-sm hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md hover:shadow-primary-500/10 transition-all duration-300">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-900 dark:text-white w-48 placeholder-gray-500"
                />
              </div>

              {/* Filter Dropdown */}
              <select
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg text-sm shadow-sm hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md hover:shadow-primary-500/10 transition-all duration-300 text-gray-900 dark:text-white"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Properties</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 shadow-lg shadow-primary-500/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "table"
                      ? "bg-white dark:bg-gray-700 shadow-lg shadow-primary-500/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading / Empty */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-16 h-16 text-primary-600 dark:text-primary-400 animate-spin mx-auto drop-shadow-lg" />
              <p className="text-gray-500 dark:text-gray-400">Loading properties...</p>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
            <Home className="w-16 h-16 text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-300 font-medium">No properties found.</p>
            <p className="text-gray-400 text-sm mt-1">Try changing the filter or search query.</p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProperties.map((p) => {
                  // showApprove => show approve action (true when not already approved)
                  const showApprove = (p.approval_status || "").toLowerCase() !== "approved";
                  // showReject => show reject action (true when not already rejected)
                  const showReject = (p.approval_status || "").toLowerCase() !== "rejected";

                  return (
                    <div
                      key={p.id}
                      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/20 transition-all duration-500 group overflow-hidden hover:border-primary-200 dark:hover:border-primary-800"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {p.primary_image_url || p.image_urls?.[0] ? (
                          <img
                            src={p.primary_image_url || p.image_urls?.[0]}
                            alt={p.title}
                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute flex gap-1 top-3 left-3">
                          <Badge
                            className={`px-3 py-1 border font-semibold text-xs ${getStatusColor(
                              p.approval_status
                            )}`}
                          >
                            {p.approval_status}
                          </Badge>
                          {p?.is_featured && (
                            <span className="flex justify-center items-center text-xs font-semibold p-[5px] rounded-full capitalize bg-purple-600 text-white">
                              <Star size={16} />
                            </span>
                          )}
                        </div>

                        {/* Price Tag */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              ${p.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {p.title}
                        </h3>

                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <p className="text-sm line-clamp-1">
                            {p.city}, {p.state}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-1 shadow-sm shadow-primary-100 dark:shadow-primary-900/20">
                              <Bed className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {p.bedrooms} Beds
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-1 shadow-sm shadow-primary-100 dark:shadow-primary-900/20">
                              <Bath className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {p.bathrooms} Baths
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-1 shadow-sm shadow-primary-100 dark:shadow-primary-900/20">
                              <Maximize2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {p.area} sqft
                            </span>
                          </div>
                        </div>

                        {/* Agent Info */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                          Agent:{" "}
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {p.agent?.name || "N/A"}
                          </span>
                        </p>

                        {/* Actions - logic:
                          - pending => show both approve & reject
                          - approved => show only reject
                          - rejected => show only approve
                        */}
                        <div className="flex gap-2">
                          {showApprove && (
                            <Button
                              size="sm"
                              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white cursor-pointer shadow-md shadow-primary-500/30 hover:shadow-lg hover:shadow-primary-500/40 transition-all duration-300"
                              onClick={() => handleApprove(p.id)}
                            >
                              <Check className="w-4 h-4 mr-1" /> Approve
                            </Button>
                          )}

                          {showReject && (
                            <Button
                              size="sm"
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-300"
                              onClick={() => openRejectPopup(p.id)}
                            >
                              <X className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Agent
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredProperties.map((p) => {
                        const showApprove = (p.approval_status || "").toLowerCase() !== "approved";
                        const showReject = (p.approval_status || "").toLowerCase() !== "rejected";

                        return (
                          <tr
                            key={p.id}
                            className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all duration-300"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                  {p.primary_image_url || p.image_urls?.[0] ? (
                                    <img
                                      src={p.primary_image_url || p.image_urls?.[0]}
                                      alt={p.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Home className="w-6 h-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white line-clamp-1 max-w-[200px]">
                                    {p.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {p.type || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              {p.agent?.name || "N/A"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1 text-gray-900 dark:text-white font-semibold">
                                <DollarSign
                                  size={16}
                                  className="text-primary-600 dark:text-primary-400"
                                />
                                {p.price?.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <MapPin size={14} className="text-gray-400" />
                                {p.city}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Bed size={14} /> {p.bedrooms}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Bath size={14} /> {p.bathrooms}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Maximize2 size={14} /> {p.area}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                className={`px-3 py-1 border font-semibold text-xs ${getStatusColor(
                                  p.approval_status
                                )}`}
                              >
                                {p.approval_status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                {showApprove && (
                                  <Button
                                    size="sm"
                                    className="bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/30 hover:shadow-lg hover:shadow-primary-500/40 transition-all duration-300"
                                    onClick={() => handleApprove(p.id)}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                )}
                                {showReject && (
                                  <Button
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-300"
                                    onClick={() => openRejectPopup(p.id)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ✅ Popup Modal for Rejection */}
        {showRejectPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-[90%] max-w-md border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                  <AlertTriangle className="text-red-600" size={20} />
                  Reject Property
                </h4>
                <button
                  onClick={() => setShowRejectPopup(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Please enter the reason for rejecting this property.
              </p>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-3 text-sm mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white placeholder-gray-500"
                placeholder="Enter rejection reason..."
              ></textarea>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectPopup(false)}
                  className="border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmReject}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-300"
                >
                  Reject Property
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PropertyList;
