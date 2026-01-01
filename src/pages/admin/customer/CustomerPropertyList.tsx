import { useState } from "react";
import { Building2, Search, Eye, Grid3x3, List } from "lucide-react";

const CustomerPropertyList = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const properties = [
    {
      id: 1,
      title: "Luxury Penthouse",
      address: "100 Park Avenue, New York, NY",
      price: "$2,500,000",
      bedrooms: 3,
      bathrooms: 3,
      area: "2800 sq ft",
      purchaseDate: "2024-01-15",
      image: "https://placehold.co/400x300/3b82f6/ffffff?text=Property+1"
    },
    {
      id: 2,
      title: "Beach House",
      address: "50 Ocean Drive, Miami, FL",
      price: "$1,800,000",
      bedrooms: 4,
      bathrooms: 3.5,
      area: "3500 sq ft",
      purchaseDate: "2023-11-20",
      image: "https://placehold.co/400x300/10b981/ffffff?text=Property+2"
    },
  ];

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-black/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-600 dark:bg-primary-700 rounded-xl shadow-md">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  My Properties
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  View your purchased and rented properties
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 shadow-sm hover:border-primary-400 transition-all">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-900 dark:text-white w-48 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "table"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg dark:hover:shadow-black/30 hover:border-primary-200 dark:hover:border-primary-800 transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{property.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{property.address}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      {property.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{property.bedrooms} Beds</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>{property.area}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Purchased: {new Date(property.purchaseDate).toLocaleDateString()}</p>
                  <button className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all text-sm font-medium">
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-black/30 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Property</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Location</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Price</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Details</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Purchase Date</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property, index) => (
                  <tr
                    key={property.id}
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all ${
                      index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/50"
                    }`}
                  >
                    <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">{property.title}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{property.address}</td>
                    <td className="py-4 px-6 font-bold text-primary-600 dark:text-primary-400">{property.price}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                      {property.bedrooms} Beds · {property.bathrooms} Baths · {property.area}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {new Date(property.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-all">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerPropertyList;
