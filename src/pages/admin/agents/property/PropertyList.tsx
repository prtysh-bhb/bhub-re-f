/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAgentProperties, deleteProperty } from "@/api/agent/property";
import type { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Eye,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Home,
  Loader2,
  AlertTriangle,
  X,
  Star,
  Bell,
  House,
  Building2,
  TrendingUp,
  Shield,
} from "lucide-react";
import { formatAmount } from "@/helpers/customer_helper";

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch agent properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getAgentProperties();
      setProperties(data?.data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ✅ Open confirm popup
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // ✅ Delete property
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(deleteId);
      await deleteProperty(deleteId);
      toast.success("Property deleted successfully");
      fetchProperties();
    } catch (err) {
      toast.error("Failed to delete property");
    } finally {
      setDeleting(null);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  // ✅ Property publish status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-800";
      case "draft":
        return "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-neutral-700";
      case "sold":
        return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      case "rented":
        return "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-800";
      default:
        return "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-neutral-700";
    }
  };

  // ✅ Admin approval color
  const getApprovalColor = (approval?: string) => {
    switch (approval?.toLowerCase()) {
      case "approved":
        return "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-800";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    }
  };

  // Property type icon and color
  const getPropertyTypeIcon = (propertyType?: string) => {
    switch (propertyType?.toLowerCase()) {
      case 'house':
        return { icon: Home, color: 'text-primary-600 dark:text-primary-400' };
      case 'apartment':
        return { icon: Building2, color: 'text-purple-600 dark:text-purple-400' };
      case 'villa':
        return { icon: Home, color: 'text-primary-600 dark:text-primary-400' };
      case 'commercial':
        return { icon: Building2, color: 'text-amber-600 dark:text-amber-400' };
      default:
        return { icon: Home, color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  return (
    <>
      <div className="p-6 min-h-screen dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950">
        {/* ---------- Header ---------- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--color-primary-500)] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
              <House className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-800">
                My Properties
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage and track all your property listings
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/agent/properties/new")}
            className="bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white cursor-pointer shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_0_rgb(0,0,0,0.15)] dark:shadow-[0_4px_14px_0_rgb(0,0,0,0.4)] dark:hover:shadow-[0_6px_20px_0_rgb(0,0,0,0.5)] transition-all duration-300 px-6 py-3 rounded-xl font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Property
          </Button>
        </div>

        {/* Stats Summary */}
        {properties.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-200 dark:border-neutral-700/50 shadow-[0_2px_8px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{properties.length}</p>
                </div>
                <div className="p-2 bg-[var(--color-primary-500)]/10 dark:bg-[var(--color-primary-500)]/20 rounded-lg">
                  <Home className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]" size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-200 dark:border-neutral-700/50 shadow-[0_2px_8px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {properties.filter(p => p.status.toLowerCase() === 'published').length}
                  </p>
                </div>
                <div className="p-2 bg-primary-500/10 dark:bg-primary-500/20 rounded-lg">
                  <TrendingUp className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-200 dark:border-neutral-700/50 shadow-[0_2px_8px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {properties.filter(p => !p.approval_status || p.approval_status.toLowerCase() !== 'approved').length}
                  </p>
                </div>
                <div className="p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg">
                  <Shield className="text-amber-600 dark:text-amber-400" size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-200 dark:border-neutral-700/50 shadow-[0_2px_8px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Featured</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {properties.filter(p => p.is_featured).length}
                  </p>
                </div>
                <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
                  <Star className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
              </div>
            </div>
          </div>
        )}
      
        {/* ---------- Loading / Empty / List ---------- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-[var(--color-primary-500)] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading properties...</p>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 dark:bg-neutral-800/50 bg-white rounded-xl border-2 border-dashed dark:border-neutral-700 border-gray-200 shadow-[0_2px_8px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgb(0,0,0,0.2)]">
            <div className="w-20 h-20 bg-[var(--color-primary-500)]/10 dark:bg-[var(--color-primary-500)]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-primary-200)] dark:border-[var(--color-primary-800)]/30">
              <Home className="w-8 h-8 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]" />
            </div>
            <h3 className="text-lg font-semibold dark:text-gray-300 text-gray-700 mb-2">No Properties Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Start your journey by adding your first property listing
            </p>
            <Button
              onClick={() => navigate("/agent/properties/new")}
              className="bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_0_rgb(0,0,0,0.15)] dark:shadow-[0_4px_14px_0_rgb(0,0,0,0.4)] dark:hover:shadow-[0_6px_20px_0_rgb(0,0,0,0.5)] px-6 py-3 rounded-xl"
            >
              + Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => {
              const typeIcon = getPropertyTypeIcon(property.property_type);
              const IconComponent = typeIcon.icon;
              
              return (
                <div
                  key={property.id}
                  className="group dark:bg-neutral-800/50 bg-white rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300 border dark:border-neutral-700/50 border-gray-100 overflow-hidden hover:-translate-y-1"
                >
                  {/* Property Image Section */}
                  {property.image_urls?.[0] ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={property.image_urls[0] ?? "/assets/no_image_found.png"}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop";
                        }}
                      />
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {property.is_featured && (
                          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md">
                            <Star className="inline w-3 h-3 mr-1" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
                      <Home className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}

                  <div className="p-5 flex flex-col justify-between">
                    {/* ---------- Property Info ---------- */}
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-lg font-bold dark:text-white text-gray-800 group-hover:text-[var(--color-primary-600)] dark:group-hover:text-[var(--color-primary-400)] transition-colors line-clamp-2">
                            {property.title}
                          </h2>
                          <div className="flex items-center gap-2 mt-2">
                            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${typeIcon.color.replace('text', 'from').replace('dark:text', 'dark:from')}/10`}>
                              <IconComponent className={`w-4 h-4 ${typeIcon.color}`} />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {property.property_type || "Property"}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize border ${getStatusColor(
                              property.status
                            )}`}
                          >
                            {property.status}
                          </span>
                          <span
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize border ${getApprovalColor(
                              property.approval_status
                            )}`}
                          >
                            {property.approval_status || "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1.5 rounded-lg bg-[var(--color-primary-500)]/10 dark:bg-[var(--color-primary-500)]/20">
                            <MapPin className="w-4 h-4 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]" />
                          </div>
                          <span className="text-gray-600 dark:text-gray-300">
                            {property.city}, {property.state}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1.5 rounded-lg bg-[var(--color-primary-500)]/10 dark:bg-[var(--color-primary-500)]/20">
                            <DollarSign className="w-4 h-4 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]" />
                          </div>
                          <span className="text-lg font-bold dark:text-white text-gray-800">
                            {formatAmount(property.price)}
                          </span>
                        </div>

                        {property.bedrooms && property.bathrooms && (
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t dark:border-neutral-700 border-gray-100">
                            <span className="flex items-center gap-1">
                              <Home className="w-3 h-3" />
                              {property.bedrooms} bed
                            </span>
                            <span className="flex items-center gap-1">
                              <Home className="w-3 h-3" />
                              {property.bathrooms} bath
                            </span>
                            {property.area && (
                              <span className="flex items-center gap-1">
                                <Home className="w-3 h-3" />
                                {property.area} sqft
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ---------- Actions ---------- */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t dark:border-neutral-700 border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] border-[var(--color-primary-200)] dark:border-[var(--color-primary-800)] hover:bg-[var(--color-primary-50)] dark:hover:bg-[var(--color-primary-900)]/30 cursor-pointer rounded-lg px-4 py-2 transition-all"
                        onClick={() => navigate(`/agent/properties/${property.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] border-[var(--color-primary-200)] dark:border-[var(--color-primary-800)] hover:bg-[var(--color-primary-50)] dark:hover:bg-[var(--color-primary-900)]/30 cursor-pointer rounded-lg p-2 transition-all hover:scale-110"
                          onClick={() => navigate(`/agent/properties/${property.id}/edit`)}
                          title="Edit Property"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-white border-red-200 dark:border-red-800 bg-red-600 dark:bg-red-600/80 hover:bg-red-700 dark:hover:bg-red-700 cursor-pointer rounded-lg p-2 transition-all hover:scale-110"
                          onClick={() => confirmDelete(property.id)}
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="dark:bg-neutral-800 bg-white rounded-2xl shadow-2xl dark:shadow-black/40 p-6 w-full max-w-md animate-fadeIn border dark:border-neutral-700/50 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg">
                    <AlertTriangle className="text-white" size={20} />
                  </div>
                  <h4 className="text-lg font-semibold dark:text-white text-gray-800">
                    Confirm Delete
                  </h4>
                </div>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="dark:text-gray-300 text-gray-600 text-sm mb-6 leading-relaxed">
                Are you sure you want to delete this property? This action cannot be undone and all associated data will be permanently removed.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-300 text-gray-700 text-sm font-medium cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting === deleteId}
                  className={`px-5 py-2.5 rounded-xl text-white text-sm font-medium cursor-pointer transition-all ${
                    deleting === deleteId
                      ? "bg-red-400 dark:bg-red-500/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {deleting === deleteId ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    "Delete Property"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Missing Plus icon component
const Plus = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default PropertyList;