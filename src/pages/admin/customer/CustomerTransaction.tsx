import { useState } from "react";
import { ArrowLeftRight, Search, Eye, FileDown, Filter } from "lucide-react";

const CustomerTransaction = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - replace with actual API call
  const transactions = [
    {
      id: 1,
      customerName: "Alice Brown",
      propertyTitle: "Luxury Penthouse",
      amount: "$2,500,000",
      date: "2024-01-15",
      status: "completed",
      type: "purchase"
    },
    {
      id: 2,
      customerName: "Bob Taylor",
      propertyTitle: "Beach House",
      amount: "$1,800,000",
      date: "2023-11-20",
      status: "completed",
      type: "purchase"
    },
    {
      id: 3,
      customerName: "Carol White",
      propertyTitle: "Downtown Loft",
      amount: "$950,000",
      date: "2024-01-05",
      status: "pending",
      type: "purchase"
    },
  ];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-400";
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-lg dark:shadow-black/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-600 dark:bg-primary-700 rounded-xl shadow-md">
                <ArrowLeftRight className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Customer Transactions
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  View and manage all customer transactions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 shadow-sm hover:border-primary-400 transition-all">
                <Search size={16} className="text-gray-400 dark:text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-900 dark:text-white w-48 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 shadow-sm">
                <Filter size={16} className="text-gray-400 dark:text-gray-500 mr-2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-all text-sm shadow-md hover:shadow-lg font-medium">
                <FileDown size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-lg dark:shadow-black/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-neutral-800">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">ID</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Customer</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Property</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Amount</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Type</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Date</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`border-b border-gray-100 dark:border-neutral-800 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all group ${
                      index % 2 === 0 ? "bg-white dark:bg-neutral-900" : "bg-gray-50/50 dark:bg-neutral-800/50"
                    }`}
                  >
                    <td className="py-4 px-6 font-mono text-sm text-gray-600 dark:text-gray-400">#{transaction.id}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">{transaction.customerName}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{transaction.propertyTitle}</td>
                    <td className="py-4 px-6 font-bold text-primary-600 dark:text-primary-400">{transaction.amount}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400 capitalize">{transaction.type}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(transaction.status)}`}>
                        {transaction.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-all opacity-0 group-hover:opacity-100">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-50 dark:bg-primary-950/20 p-6 rounded-xl border border-primary-100 dark:border-primary-900/50 shadow-md dark:shadow-black/20">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Transactions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{transactions.length}</p>
          </div>
          <div className="bg-primary-50 dark:bg-primary-950/20 p-6 rounded-xl border border-primary-100 dark:border-primary-900/50 shadow-md dark:shadow-black/20">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Value</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$5.25M</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl border border-amber-100 dark:border-amber-900/50 shadow-md dark:shadow-black/20">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pending</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">1</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerTransaction;
