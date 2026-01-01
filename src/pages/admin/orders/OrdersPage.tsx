import { useState } from "react";
import { HousePlus, Search, Eye, Filter } from "lucide-react";

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - replace with actual API call
  const orders = [
    {
      id: 1,
      customerName: "John Doe",
      propertyTitle: "Modern Luxury Villa",
      orderType: "Purchase",
      amount: "$1,250,000",
      date: "2024-01-15",
      status: "confirmed"
    },
    {
      id: 2,
      customerName: "Jane Smith",
      propertyTitle: "Downtown Apartment",
      orderType: "Rent",
      amount: "$3,500/month",
      date: "2024-01-12",
      status: "pending"
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      propertyTitle: "Suburban House",
      orderType: "Purchase",
      amount: "$750,000",
      date: "2024-01-10",
      status: "confirmed"
    },
    {
      id: 4,
      customerName: "Sarah Williams",
      propertyTitle: "Beach Condo",
      orderType: "Rent",
      amount: "$4,200/month",
      date: "2024-01-08",
      status: "cancelled"
    },
  ];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         o.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || o.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30">
                <HousePlus className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
                  Orders
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  View and manage property orders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 shadow-sm hover:border-primary-500 hover:shadow-md transition-all">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-900 dark:text-white w-48 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 shadow-sm">
                <Filter size={16} className="text-gray-400 mr-2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Order ID</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Customer</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Property</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Type</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Amount</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Date</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all group ${
                      index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/50"
                    }`}
                  >
                    <td className="py-4 px-6 font-mono text-sm text-gray-600 dark:text-gray-400">#{order.id.toString().padStart(4, '0')}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">{order.customerName}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{order.propertyTitle}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-sm">
                        {order.orderType}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-primary-600 dark:text-primary-400">{order.amount}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-all opacity-0 group-hover:opacity-100 hover:shadow-md">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-primary-200 dark:border-primary-900/30 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{orders.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-emerald-200 dark:border-emerald-900/30 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Confirmed</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{orders.filter(o => o.status === "confirmed").length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-amber-200 dark:border-amber-900/30 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pending</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{orders.filter(o => o.status === "pending").length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-red-200 dark:border-red-900/30 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cancelled</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{orders.filter(o => o.status === "cancelled").length}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
