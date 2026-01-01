/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  X,
  Filter,
  FolderOpen,
  Grid3x3,
  List,
  Plus,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Save,
  Hash,
  Tag,
  Folder,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import DeleteModal from "../../agents/components/DeleteModal";
import { BlogCategory, BlogCategoryFormData, createBlogCategory, deleteBlogCategory, getBlogCategories, updateBlogCategory, updateBlogCategoryStatus } from "@/api/admin/cms";
import { formatReadableDate } from "@/helpers/customer_helper";

const BlogCategories = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showStatusUpdatePopup, setShowStatusUpdatePopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<BlogCategoryFormData>({
    name: "",
    content: "",
    is_active: false
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    content: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Color palette for category cards
  const categoryColors = [
    { gradient: "from-primary-500 to-primary-500", light: "from-primary-50 to-primary-50", dark: "from-primary-900/20 to-primary-900/20" },
    { gradient: "from-primary-500 to-green-500", light: "from-primary-50 to-green-50", dark: "from-primary-900/20 to-green-900/20" },
    { gradient: "from-purple-500 to-primary-500", light: "from-purple-50 to-primary-50", dark: "from-purple-900/20 to-primary-900/20" },
    { gradient: "from-amber-500 to-orange-500", light: "from-amber-50 to-orange-50", dark: "from-amber-900/20 to-orange-900/20" },
    { gradient: "from-rose-500 to-pink-500", light: "from-rose-50 to-pink-50", dark: "from-rose-900/20 to-pink-900/20" },
    { gradient: "from-primary-500 to-primary-500", light: "from-primary-50 to-primary-50", dark: "from-primary-900/20 to-primary-900/20" },
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getBlogCategories();
      if (data.success) {
        const filteredCategories = data.data.filter((category: BlogCategory) => {
          const matchesSearch = search === "" || 
            category.name.toLowerCase().includes(search.toLowerCase()) ||
            category.content.toLowerCase().includes(search.toLowerCase());
          
          const matchesFilter = filter === "all" || 
            (filter === "active" && category.is_active) ||
            (filter === "inactive" && !category.is_active);
          
          return matchesSearch && matchesFilter;
        });
        
        setCategories(filteredCategories);
      } else {
        setError("Failed to fetch blog categories.");
      }
    } catch {
      setError("Failed to fetch blog categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [search, filter]);

  const refresh = async () => {
    await loadCategories();
  };

  const handleToggleStatus = async () => {
    try {
      setSubmitting(true);
      await updateBlogCategoryStatus(selectedCategory!.id);
      toast.success("Category status updated successfully");
      setShowStatusUpdatePopup(false);
      refresh();
      setSubmitting(false);
    } catch {
      toast.error("Failed to update category status");
    }
  };

  const openDeletePopup = (category: BlogCategory) => {
    setSelectedCategory(category);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      await deleteBlogCategory(selectedCategory.id);
      toast.success("Category deleted successfully");
      setShowDeletePopup(false);
      refresh();
    } catch (error:any) {
      toast.error(error.response.data.message);
    }
  };

  const toggleCategory = (id: number) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      name: "",
      content: "",
      is_active: false
    });
    setFormErrors({ name: "", content: "" });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const openEditModal = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      content: category.content,
      is_active: category.is_active
    });
    setFormErrors({ name: "", content: "" });
    setShowEditModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked ? 1 : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when user starts typing
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = { name: "", content: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Category name is required";
      isValid = false;
    } else if (formData.name.length < 3) {
      errors.name = "Category name must be at least 3 characters";
      isValid = false;
    }

    if (!formData.content.trim()) {
      errors.content = "content is required";
      isValid = false;
    } else if (formData.content.length < 10) {
      errors.content = "content must be at least 10 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission for Add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const response = await createBlogCategory(formData);
      if (response.success) {
        toast.success("Category added successfully");
        setShowAddModal(false);
        refresh();
      } else {
        toast.error(response.message || "Failed to add category");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add category");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submission for Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !editingCategory) return;
    
    setSubmitting(true);
    try {
      const response = await updateBlogCategory(editingCategory.id, formData);
      if (response.success) {
        toast.success("Category updated successfully");
        setShowEditModal(false);
        refresh();
      } else {
        toast.error(response.message || "Failed to update category");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  const badge = (status: boolean) => {     
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold";
    
    switch(status) {
      case true:
        return `${baseClasses} bg-primary-100 text-primary-700 dark:bg-primary-700/20 dark:text-primary-400`;
      case false:
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400`;
      default:
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400`;
    }
  };

  const getCategoryColor = (index: number) => {
    return categoryColors[index % categoryColors.length];
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-xl shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.2)]">
                <FolderOpen className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-primary">
                  Blog Categories
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Organize and manage your blog content with categories
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 shadow-sm hover:border-primary/50 transition-all">
                <Search size={16} className="text-gray-400 dark:text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-900 dark:text-white w-48 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
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
                      ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  title="Table View"
                >
                  <List size={18} />
                </button>
              </div>

              <div className="flex items-center border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 shadow-sm hover:border-primary/50 transition-all">
                <Filter size={16} className="text-gray-400 dark:text-gray-500 mr-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-all text-sm shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_6px_16px_rgba(var(--color-primary-rgb),0.4)] font-medium"
              >
                <Plus size={16} />
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
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
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-5 rounded-xl border border-primary/20 dark:border-primary/30 shadow-[0_2px_8px_rgba(var(--color-primary-rgb),0.1)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary/80 dark:text-primary/90">Total Categories</p>
                    <p className="text-2xl font-bold text-primary mt-1">{categories.length}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FolderOpen className="text-primary" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-5 rounded-xl border border-primary-200 dark:border-primary-800 shadow-[0_2px_8px_rgba(16,185,129,0.1)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-700 dark:text-primary-300">Active Categories</p>
                    <p className="text-2xl font-bold text-primary-900 dark:text-primary-100 mt-1">
                      {categories.filter(c => c.is_active).length}
                    </p>
                  </div>
                  <div className="p-3 bg-primary-500/10 rounded-lg">
                    <CheckCircle className="text-primary-600 dark:text-primary-400" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-5 rounded-xl border border-red-200 dark:border-red-800 shadow-[0_2px_8px_rgba(239,68,68,0.1)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Inactive Categories</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
                      {categories.filter(c => !c.is_active).length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <XCircle className="text-red-600 dark:text-red-400" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Blogs</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                      {categories.reduce((sum, cat) => sum + (cat.blogs_count || 0), 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-500/10 rounded-lg">
                    <FileText className="text-gray-600 dark:text-gray-400" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-200">
                        <th className="py-4 px-6 text-left font-semibold">Category</th>
                        <th className="py-4 px-6 text-left font-semibold">Blogs</th>
                        <th className="py-4 px-6 text-left font-semibold">Created</th>
                        <th className="py-4 px-6 text-left font-semibold">Status</th>
                        <th className="py-4 px-6 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-900">
                      {categories.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-12 text-center text-gray-500 dark:text-gray-400"
                          >
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                                <Search className="text-gray-400 dark:text-gray-500" size={24} />
                              </div>
                              <p className="font-medium">No categories found</p>
                              <p className="text-sm">Try adjusting your search criteria</p>
                              <button
                                onClick={openAddModal}
                                className="mt-2 px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-white rounded-lg transition-all shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.3)]"
                              >
                                <Plus size={16} className="inline mr-2" />
                                Add Your First Category
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        categories.map((category, index) => {
                          const color = getCategoryColor(index);
                          return (
                            <>
                              <tr
                                key={category.id}
                                className={`border-b border-gray-100 dark:border-neutral-800 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group cursor-pointer ${
                                  index % 2 === 0 ? "bg-white dark:bg-neutral-900" : "bg-gray-50/50 dark:bg-neutral-800/50"
                                }`}
                                onClick={() => toggleCategory(category.id)}
                              >
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color.light} dark:${color.dark} flex items-center justify-center`}>
                                      <Folder className="text-gray-700 dark:text-gray-300" size={20} />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900 dark:text-white">
                                        {category.name}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                        {category.content}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-2">
                                    <FileText size={14} className="text-gray-400 dark:text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      {category.blogs_count || 0} Blogs
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                  {formatReadableDate(category.created_at)}
                                </td>
                                <td className="py-4 px-6">
                                  <span className={badge(category.is_active)}>
                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                      category.is_active ? "bg-primary-600 dark:bg-primary-400" : "bg-red-600 dark:bg-red-400"
                                    }`}></span>
                                    {category.is_active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(category);
                                      }}
                                      className="p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 text-primary transition-all hover:scale-110"
                                      title="Edit Category"
                                    >
                                      <Edit size={18} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCategory(category);
                                        setShowStatusUpdatePopup(true)
                                      }}
                                      className={`p-2 rounded-lg transition-all hover:scale-110 ${
                                        category.is_active
                                          ? "hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                          : "hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                                      }`}
                                      title={category.is_active ? "Deactivate Category" : "Activate Category"}
                                    >
                                      {category.is_active ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDeletePopup(category);
                                      }}
                                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all hover:scale-110"
                                      title="Delete Category"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {expandedCategory === category.id && (
                                <tr className="bg-primary/5 dark:bg-primary/10 border-b border-gray-100 dark:border-neutral-800">
                                  <td colSpan={5} className="px-6 py-4">
                                    <div className="pl-12 pr-4">
                                      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-700">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                          <div>
                                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">content:</h4>
                                            <p className="text-gray-600 dark:text-gray-400">{category.content}</p>
                                          </div>
                                          <div>
                                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Details:</h4>
                                            <div className="space-y-2">
                                              <div className="flex items-center gap-2 text-sm">
                                                <Tag size={14} className="text-gray-400 dark:text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                  Slug: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{category.slug}</code>
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-2 text-sm">
                                                <Hash size={14} className="text-gray-400 dark:text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                  ID: {category.id}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-neutral-700">
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Updated: {formatReadableDate(category.updated_at)}
                                          </span>
                                          <button
                                            onClick={() => setExpandedCategory(null)}
                                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                          >
                                            <ChevronUp size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Grid View - Updated Category Cards */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                        <Search className="text-gray-400 dark:text-gray-500" size={24} />
                      </div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">No categories found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                      <button
                        onClick={openAddModal}
                        className="mt-4 px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-white rounded-lg transition-all shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.3)]"
                      >
                        <Plus size={16} className="inline mr-2" />
                        Add Your First Category
                      </button>
                    </div>
                  </div>
                ) : (
                  categories.map((category, index) => {
                    const color = getCategoryColor(index);
                    return (
                      <div
                        key={category.id}
                        className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] hover:border-primary/30 dark:hover:border-primary/50 transition-all group overflow-hidden"
                      >
                        {/* Category Header with Gradient */}
                        <div 
                          className={`p-6 bg-gradient-to-br ${color.light} dark:${color.dark} border-b border-gray-200 dark:border-neutral-700 cursor-pointer`}
                          onClick={() => toggleCategory(category.id)}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-md`}>
                                <Folder className="text-white" size={24} />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                                  {category.name}
                                </h3>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className={badge(category.is_active)}>
                                    {category.is_active ? "Active" : "Inactive"}
                                  </span>
                                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                    <FileText size={14} />
                                    <span>{category.blogs_count || 0} Blogs</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                              {expandedCategory === category.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                          </div>

                          {expandedCategory === category.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">content:</h4>
                              <p className="text-gray-600 dark:text-gray-400 mb-4">{category.content}</p>
                              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <div className="space-x-4">
                                  <span className="flex items-center gap-1">
                                    <Hash size={12} />
                                    ID: {category.id}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Tag size={12} />
                                    {category.slug}
                                  </span>
                                </div>
                                <span>Created: {formatReadableDate(category.created_at)}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Category Info */}
                        <div className="p-4">

                          {/* Actions */}
                          <div className="flex gap-2 justify-between">
                            <button
                              onClick={() => openEditModal(category)}
                              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 text-primary transition-all font-medium text-sm"
                            >
                              <Edit size={16} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCategory(category);
                                setShowStatusUpdatePopup(true);
                              }}
                              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                                category.is_active
                                  ? "hover:bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/50"
                                  : "hover:bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 dark:hover:bg-primary-900/50"
                              }`}
                            >
                              {category.is_active ? <XCircle size={16} /> : <CheckCircle size={16} />}
                              <span>{category.is_active ? "Deactivate" : "Activate"}</span>
                            </button>
                            <button
                              onClick={() => openDeletePopup(category)}
                              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all text-sm"
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}

        {/* Add Modal */}
        <CategoryModal 
          isEdit={false}
          isOpen={showAddModal}
          setIsOpen={setShowAddModal}
          onSubmit={handleAddSubmit}
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          submitting={submitting}
        />

        {/* Edit Modal */}
        <CategoryModal 
          isEdit={true}
          isOpen={showEditModal}
          setIsOpen={setShowEditModal}
          onSubmit={handleEditSubmit}
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          submitting={submitting}
        />

        {/* Status update Confirmation Popup */}
        <DeleteModal
          show={showStatusUpdatePopup}
          title="Update Category Status"
          message="Do you really want to update this category status?"
          onClose={() => setShowStatusUpdatePopup(false)}
          onConfirm={handleToggleStatus}
          loading={submitting}
          confirmText="Update"
          cancelText="Cancel"
          loadingText="Updating..."
          buttonColor={!selectedCategory?.is_active ? "amber" : "green"}
          modalIcon={CheckCircle}
        />

        {/* Delete Confirmation Popup */}
        <DeleteModal
          show={showDeletePopup}
          title="Delete Category"
          message="This action cannot be undone. All blogs in this category will be affected. Do you really want to delete this category?"
          onClose={() => setShowDeletePopup(false)}
          onConfirm={confirmDelete}
          loading={loading}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </>
  );
};

// Category Modal component
const CategoryModal = ({ 
  isEdit = false,
  isOpen,
  setIsOpen,
  onSubmit,
  formData,
  formErrors,
  handleInputChange,
  submitting
}: {
  isEdit?: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  formErrors: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  submitting: boolean;
}) => {
    const title = isEdit ? "Edit Category" : "Add New Category";
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
            <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <div className="p-2 bg-primary rounded-lg shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.2)]">
                <FolderOpen className="text-white" size={20} />
              </div>
              {title}
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              disabled={submitting}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6">
            <div className="space-y-4">
              {/* Category Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.name
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-primary/50 focus:border-primary'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all`}
                  placeholder="Enter category name (e.g., Technology, Lifestyle)"
                  disabled={submitting}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Use descriptive names for better organization
                </p>
              </div>

              {/* content Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.content 
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all resize-none`}
                  placeholder="Describe what this category is about..."
                  disabled={submitting}
                />
                {formErrors.content && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.content}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formData.content.length}/500 characters
                </p>
              </div>

              {/* Status Field */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Active categories will be visible to users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active ? true : false}
                    onChange={handleInputChange}
                    className="sr-only peer"
                    disabled={submitting}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {formData.is_active ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-br from-primary-500 to-primary-500 hover:from-primary-700 hover:to-primary-700 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isEdit ? "Updating..." : "Adding..."}</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isEdit ? "Update Category" : "Add Category"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default BlogCategories;