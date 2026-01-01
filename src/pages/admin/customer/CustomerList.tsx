/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  //Trash2,
  X,
  AlertTriangle,
  Filter,
  FileDown,
  Contact,
  Grid3x3,
  List,
  UserPlus,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";
import { exportUsers } from "@/api/admin/userExport";
import { getCustomers, Customer } from "@/api/customer/customerList";
import {
  activateCustomer,
  deactivateCustomer,
  // deleteCustomer,
} from "@/api/customer/customerActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeactivatePopup, setShowDeactivatePopup] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        let is_active = "";
        if (filter === "active") is_active = "1";
        if (filter === "inactive") is_active = "0";

        const data = await getCustomers(page, search, is_active);
        if (data.success) {
          setCustomers(data.data.customers || []);
          setTotalPages(data.data.pagination.last_page || 1);
        } else setError("Failed to fetch customers.");
      } catch {
        setError("Failed to fetch customers.");
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, [page, search, filter]);

  const refresh = async () => {
    let is_active = "";
    if (filter === "active") is_active = "1";
    if (filter === "inactive") is_active = "0";

    const data = await getCustomers(page, search, is_active);
    setCustomers(data.data.customers || []);
  };

  const handleActivate = async (id: number) => {
    try {
      await activateCustomer(id);
      toast.success("Customer activated successfully");
      refresh();
    } catch {
      toast.error("Failed to activate customer");
    }
  };

  const openDeactivatePopup = (customer: Customer) => {
    setSelectedCustomer(customer);
    setReason("");
    setShowDeactivatePopup(true);
  };

  const confirmDeactivate = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }
    try {
      await deactivateCustomer(selectedCustomer!.id, reason);
      toast.success("Customer deactivated successfully");
      setShowDeactivatePopup(false);
      refresh();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to deactivate customer"
      );
    }
  };

  // const handleDelete = async (id: number) => {
  //   try {
  //     await deleteCustomer(id);
  //     toast.success("Customer deleted successfully");
  //     refresh();
  //   } catch {
  //     toast.error("Failed to delete customer");
  //   }
  // };

  const badge = (isActive: boolean) =>
    isActive
      ? "bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/40"
      : "bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400";

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-xl shadow-md shadow-primary-500/30">
                <Contact className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Customers
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage all registered customers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 shadow-sm hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 transition-all">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-900 dark:text-white w-48 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 shadow-md shadow-primary-500/30 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "table"
                      ? "bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 shadow-md shadow-primary-500/30 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  title="Table View"
                >
                  <List size={18} />
                </button>
              </div>

              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 shadow-sm hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 transition-all">
                <Filter size={16} className="text-gray-400 mr-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <Button
                onClick={async () => {
                  try {
                    toast.info("Preparing your download...");
                    await exportUsers(
                      "customer",
                      filter === "active"
                        ? 1
                        : filter === "inactive"
                        ? 0
                        : undefined
                    );
                    toast.success("Export successful!");
                  } catch {
                    toast.error("Failed to export users");
                  }
                }}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md shadow-primary-500/30 hover:shadow-lg hover:shadow-primary-500/40 cursor-pointer"
              >
                <FileDown size={18} />
                <span>Export</span>
              </Button>

              <Button
                onClick={() => navigate("/admin/customers/new")}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md shadow-primary-500/30 hover:shadow-lg hover:shadow-primary-500/40"
              >
                <UserPlus size={18} />
                <span>Add Customer</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary-200/30 dark:hover:shadow-primary-900/20 hover:-translate-y-1 hover:border-primary-300/60 dark:hover:border-primary-700/60 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {customers.length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-lg shadow-md shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Contact className="text-white" size={20} />
                </div>
              </div>
            </div>
            <div className="group bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary-200/30 dark:hover:shadow-primary-900/20 hover:-translate-y-1 hover:border-primary-300/60 dark:hover:border-primary-700/60 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Active Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {customers.filter((c) => c.status).length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-lg shadow-md shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="text-white" size={20} />
                </div>
              </div>
            </div>
            <div className="group bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-red-200/30 dark:hover:shadow-red-900/20 hover:-translate-y-1 hover:border-red-300/60 dark:hover:border-red-700/60 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Inactive Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {customers.filter((c) => !c.status).length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-lg shadow-md shadow-red-500/30 group-hover:scale-110 transition-transform duration-300">
                  <UserX className="text-white" size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary-500 dark:border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading customers...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 transition-all duration-300 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-200">
                        <th className="py-4 px-6 text-left font-semibold">Customer</th>
                        <th className="py-4 px-6 text-left font-semibold">Email</th>
                        <th className="py-4 px-6 text-left font-semibold">Created</th>
                        <th className="py-4 px-6 text-left font-semibold">Status</th>
                        <th className="py-4 px-6 text-left font-semibold">2FA</th>
                        <th className="py-4 px-6 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900">
                      {customers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-12 text-center text-gray-500 dark:text-gray-400"
                          >
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <Search className="text-gray-400" size={24} />
                              </div>
                              <p className="font-medium">No customers found</p>
                              <p className="text-sm">Try adjusting your search criteria</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        customers.map((c, index) => (
                          <tr
                            key={c.id}
                            className={`border-b border-gray-100 dark:border-gray-800 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all group ${
                              index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/50"
                            }`}
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-500/30">
                                  <img src={c.avatar || undefined} alt={c.name} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {c.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">ID: {c.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <p className="text-gray-700 dark:text-gray-300">{c.email}</p>
                            </td>
                            <td className="py-4 px-6 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {new Date(c.joined).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${badge(
                                  c.status
                                )}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  c.status ? "bg-primary-600 dark:bg-primary-400" : "bg-red-600 dark:bg-red-400"
                                }`}></span>
                                {c.status ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 hidden md:table-cell">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                  c.two_factor_enabled
                                    ? "bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/20 text-primary-700 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/40"
                                    : "bg-red-100 dark:bg-gray-800 text-red-700 dark:text-gray-400"
                                }`}
                              >
                                <Shield className="mr-1" size={14} />
                                {c.two_factor_enabled ? "2FA Enabled" : "2FA Disabled"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() =>
                                    navigate(`/admin/customers/${c.id}`)
                                  }
                                  className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-all hover:scale-110"
                                  title="View Details"
                                >
                                  <Eye size={18} />
                                </button>
                                {c.status ? (
                                  <button
                                    onClick={() => openDeactivatePopup(c)}
                                    className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-xs font-semibold transition-all"
                                    title="Deactivate Customer"
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleActivate(c.id)}
                                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/20 text-primary-700 dark:text-primary-400 hover:from-primary-200 hover:to-primary-100 dark:hover:from-primary-900/50 dark:hover:to-primary-900/30 text-xs font-semibold transition-all border border-primary-200/60 dark:border-primary-800/40"
                                    title="Activate Customer"
                                  >
                                    Activate
                                  </button>
                                )}
                                {/* <button
                                  onClick={() => handleDelete(c.id)}
                                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all hover:scale-110"
                                  title="Delete Customer"
                                >
                                  <Trash2 size={18} />
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Search className="text-gray-400" size={24} />
                      </div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">No customers found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                    </div>
                  </div>
                ) : (
                  customers.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary-200/30 dark:hover:shadow-primary-900/20 hover:border-primary-300/60 dark:hover:border-primary-700/60 transition-all hover:-translate-y-1 group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                           <img src={c.avatar || "/assets/user.jpg"} alt={c.name} className="w-full h-full object-cover rounded-xl" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                              {c.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{c.email}</p>
                            <span
                              className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                c.two_factor_enabled
                                  ? "bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/20 text-primary-700 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/40"
                                  : "bg-red-100 dark:bg-gray-700 text-red-700 dark:text-gray-400"
                              }`}
                            >
                              <Shield className="mr-1" size={14} />
                              {c.two_factor_enabled ? "2FA On" : "2FA Off"}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-full ${badge(
                            c.status
                          )}`}
                        >
                          {c.status ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Joined: {new Date(c.joined).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() => navigate(`/admin/customers/${c.id}`)}
                          className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-all font-medium text-sm cursor-pointer"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        {c.status ? (
                          <button
                            onClick={() => openDeactivatePopup(c)}
                            className="flex-1 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-xl hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all cursor-pointer"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(c.id)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded-xl hover:from-primary-200 hover:to-primary-100 dark:hover:from-primary-900/50 dark:hover:to-primary-900/30 transition-all cursor-pointer border border-primary-200/60 dark:border-primary-800/40"
                          >
                            Activate
                          </button>
                        )}
                        {/* <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button> */}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg shadow-neutral-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary-200/20 dark:hover:shadow-primary-900/10 transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Showing page <span className="text-primary-600 dark:text-primary-400 font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-500 dark:hover:border-primary-500 text-gray-700 dark:text-gray-300 transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-primary-500/30 hover:shadow-lg hover:shadow-primary-500/40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deactivate Popup */}
        {showDeactivatePopup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-[90%] max-w-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <AlertTriangle className="text-amber-600 dark:text-amber-400" size={20} />
                  </div>
                  Deactivate Customer
                </h4>
                <button
                  onClick={() => setShowDeactivatePopup(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Provide a reason for deactivating{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{selectedCustomer?.name}</span>.
              </p>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 focus:border-amber-400 dark:focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4 transition-all"
                placeholder="Enter reason..."
              ></textarea>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeactivatePopup(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeactivate}
                  className="px-4 py-2 rounded-lg text-sm bg-amber-600 hover:bg-amber-700 text-white font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerList;
