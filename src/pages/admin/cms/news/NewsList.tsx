/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  X,
  Filter,
  Grid3x3,
  List,
  Plus,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Save,
  Image as ImageIcon,
  Calendar,
  Newspaper
} from "lucide-react";
import { toast } from "sonner";
import { News, NewsFormData, createNews, deleteNews, getNews, updateNews, updateNewsStatus } from "@/api/admin/cms";
import { validateImage } from "@/helpers/image_helper";
import DeleteModal from "../../agents/components/DeleteModal";

const NewsList = () => {
  const [news, setNews] = useState<News[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showStatusUpdatePopup, setShowStatusUpdatePopup] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [expandedNews, setExpandedNews] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    image: null,
    status: 0
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    content: "",
    image: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await getNews();
      if (data.success) {
        const filteredNews = data.data.filter((news: News) => {
          const matchesSearch = search === "" || 
            news.title.toLowerCase().includes(search.toLowerCase()) ||
            news.content.toLowerCase().includes(search.toLowerCase());
          
          const matchesFilter = filter === "all" || 
            (filter === "active" && news.status) ||
            (filter === "inactive" && !news.status);
          
          return matchesSearch && matchesFilter;
        });
        
        setNews(filteredNews);
      } else {
        setError("Failed to fetch news.");
      }
    } catch {
      setError("Failed to fetch news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [search, filter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = validateImage(e, 5);
    if (!validFiles) return;

    if (validFiles.length > 0) {
      setImage(validFiles[0]);
      setImagePreview(URL.createObjectURL(validFiles[0]))
    } else {
      e.target.value = "";
    }
  };

  const refresh = async () => {
    await loadNews();
  };

  const handleToggleStatus = async () => {
    try {      
      setSubmitting(true);
      await updateNewsStatus(selectedNews!.id);
      toast.success("News status updated successfully");
      setShowStatusUpdatePopup(false);
      refresh();
      setSubmitting(false);
    } catch {
      toast.error("Failed to update news status");
    }
  };

  const openDeletePopup = (news: News) => {
    setSelectedNews(news);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!selectedNews) return;
    
    try {
      await deleteNews(selectedNews.id);
      toast.success("News deleted successfully");
      setShowDeletePopup(false);
      refresh();
    } catch {
      toast.error("Failed to delete news");
    }
  };

  const toggleNews = (id: number) => {
    setExpandedNews(expandedNews === id ? null : id);
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      title: "",
      content: "",
      image: "",
      status: 1
    });
    setFormErrors({ title: "", content: "", image: "" });
    setImagePreview("");
    setShowAddModal(true);
  };

  // Open Edit Modal
  const openEditModal = (news: News) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      content: news.content,
      status: news.status,
    });
    setFormErrors({ title: "", content: "", image: "" });
    setImagePreview(news?.image_url ?? "");
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
    const errors = { title: "", content: "", image: "" };
    let isValid = true;

    if (!formData?.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!formData?.content.trim()) {
      errors.content = "content is required";
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
      const form = new FormData();

      (Object.keys(formData) as Array<keyof NewsFormData>).forEach((key) => {
        form.append(key, formData[key] as any);
      });

      if(image){
        form.append('image', image);
      }

      const response = await createNews(form);
      if (response.success) {
        toast.success("News added successfully");
        setShowAddModal(false);
        refresh();
      } else {
        toast.error(response.message || "Failed to add news");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add news");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submission for Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !editingNews) return;
    
    setSubmitting(true);
    try {
      const form = new FormData();

      (Object.keys(formData) as Array<keyof NewsFormData>).forEach((key) => {        
        form.append(key, formData[key] as any);
      });

      if(image){
        form.append('image', image);
      }

      const response = await updateNews(editingNews.id, form);
      if (response.success) {
        toast.success("News updated successfully");
        setShowEditModal(false);
        refresh();
      } else {
        toast.error(response.message || "Failed to update news");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update news");
    } finally {
      setSubmitting(false);
    }
  };

  const badge = (status: number) => {     
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold";
    
    switch(status) {
      case 1:
        return `${baseClasses} bg-primary-100 text-primary-700 dark:bg-primary-700/20 dark:text-primary-400`;
      case 0:
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400`;
      default:
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-xl shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.2)]">
                <Newspaper className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-primary">
                  News
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage all news
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 shadow-sm hover:border-primary/50 transition-all">
                <Search size={16} className="text-gray-400 dark:text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search News..."
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
                <span>Add News</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading news...</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-5 rounded-xl border border-primary/20 dark:border-primary/30 shadow-[0_2px_8px_rgba(var(--color-primary-rgb),0.1)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary/80 dark:text-primary/90">Total News</p>
                    <p className="text-2xl font-bold text-primary mt-1">{news.length}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Newspaper className="text-primary" size={24} />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-5 rounded-xl border border-primary-200 dark:border-primary-800 shadow-[0_2px_8px_rgba(16,185,129,0.1)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-700 dark:text-primary-300">Active News</p>
                    <p className="text-2xl font-bold text-primary-900 dark:text-primary-100 mt-1">
                      {news.filter(b => b.status === 1).length}
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
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Inactive News</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
                      {news.filter(b => b.status === 0).length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <XCircle className="text-red-600 dark:text-red-400" size={24} />
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
                        <th className="py-4 px-6 text-left font-semibold">News</th>
                        <th className="py-4 px-6 text-left font-semibold">Created</th>
                        <th className="py-4 px-6 text-left font-semibold">Status</th>
                        <th className="py-4 px-6 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-900">
                      {news.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-12 text-center text-gray-500 dark:text-gray-400"
                          >
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                                <Search className="text-gray-400 dark:text-gray-500" size={24} />
                              </div>
                              <p className="font-medium">No news found</p>
                              <p className="text-sm">Try adjusting your search criteria</p>
                              <button
                                onClick={openAddModal}
                                className="mt-2 px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-white rounded-lg transition-all shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.3)]"
                              >
                                <Plus size={16} className="inline mr-2" />
                                Add Your First News
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        news.map((news, index) => (
                          <>
                            <tr
                              key={news.id}
                              className={`border-b border-gray-100 dark:border-neutral-800 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group cursor-pointer ${
                                index % 2 === 0 ? "bg-white dark:bg-neutral-900" : "bg-gray-50/50 dark:bg-neutral-800/50"
                              }`}
                              onClick={() => toggleNews(news.id)}
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                    <img 
                                      src={news?.image_url ?? "/assets/no_image_found.jpg"} 
                                      alt={news.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                                      {news.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                      {truncateText(news.content, 100)}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
                                  {formatDate(news.created_at)}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={badge(news.status)}>
                                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                    news.status === 1 ? "bg-primary-600 dark:bg-primary-400" : "bg-red-600 dark:bg-red-400"
                                  }`}></span>
                                  {news.status === 1 ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditModal(news);
                                    }}
                                    className="p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 text-primary transition-all hover:scale-110"
                                    title="Edit News"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedNews(news);
                                      setShowStatusUpdatePopup(true)
                                    }}
                                    className={`p-2 rounded-lg transition-all hover:scale-110 ${
                                      news.status === 1
                                        ? "hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                        : "hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                                    }`}
                                    title={news.status === 1 ? "Deactivate news" : "Activate news"}
                                  >
                                    {news.status === 1 ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDeletePopup(news);
                                    }}
                                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all hover:scale-110"
                                    title="Delete news"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {expandedNews === news.id && (
                              <tr className="bg-primary/5 dark:bg-primary/10 border-b border-gray-100 dark:border-neutral-800">
                                <td colSpan={5} className="px-6 py-4">
                                  <div className="pl-20 pr-4">
                                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-700">
                                      <div className="flex gap-4">
                                        <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                          <img 
                                            src={news?.image_url ?? ""} 
                                            alt={news.title}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">content:</h4>
                                          <p className="text-gray-600 dark:text-gray-400">{news.content}</p>
                                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-neutral-700">
                                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                              <span>Updated: {formatDate(news.updated_at)}</span>
                                            </div>
                                            <button
                                              onClick={() => setExpandedNews(null)}
                                              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                              <ChevronUp size={16} />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                        <Search className="text-gray-400 dark:text-gray-500" size={24} />
                      </div>
                      <p className="font-medium text-gray-500 dark:text-gray-400">No news found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                      <button
                        onClick={openAddModal}
                        className="mt-4 px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-white rounded-lg transition-all shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.3)]"
                      >
                        <Plus size={16} className="inline mr-2" />
                        Add Your First News
                      </button>
                    </div>
                  </div>
                ) : (
                  news.map((news) => (
                    <div
                      key={news.id}
                      className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] hover:border-primary/30 dark:hover:border-primary/50 transition-all group overflow-hidden"
                    >
                      {/* News Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={news?.image_url ?? "/assets/no_image_found.jpg"} 
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={badge(news.status)}>
                            {news.status === 1 ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => toggleNews(news.id)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                            {news.title}
                          </h3>
                          <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 ml-2">
                            {expandedNews === news.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>{formatDate(news.created_at)}</span>
                          </div>
                        </div>

                        {expandedNews === news.id ? (
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-700">
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">content:</h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">{news.content}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                              </div>
                              <span>Updated: {formatDate(news.updated_at)}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                            {truncateText(news.content, 150)}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 p-4 border-t border-gray-100 dark:border-neutral-700 items-center justify-between">
                        <button
                          onClick={() => openEditModal(news)}
                          className="flex items-center justify-center gap-2 p-2.5 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 text-primary transition-all font-medium text-sm cursor-pointer"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedNews(news);
                            setShowStatusUpdatePopup(true)
                          }}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            news.status === 1
                              ? "hover:bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400  dark:hover:bg-amber-900/50"
                              : "hover:bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 dark:hover:bg-primary-900/50"
                          }`}
                        >
                          {news.status === 1 ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          <span>{news.status === 1 ? "Deactivate" : "Activate"}</span>
                        </button>
                        <button
                          onClick={() => openDeletePopup(news)}
                          className="p-2.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Add Modal */}
        <NewsModal 
          isEdit={false}
          isOpen={showAddModal}
          setIsOpen={setShowAddModal}
          onSubmit={handleAddSubmit}
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          imagePreview={imagePreview ?? ""}
          handleFileChange={handleFileChange}
          submitting={submitting}
        />

        {/* Edit Modal */}
        <NewsModal 
          isEdit={true}
          isOpen={showEditModal}
          setIsOpen={setShowEditModal}
          onSubmit={handleEditSubmit}
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          imagePreview={imagePreview ?? ""}
          handleFileChange={handleFileChange}
          submitting={submitting}
        />

        {/* Status update Confirmation Popup */}
        <DeleteModal
          show={showStatusUpdatePopup}
          title="Update News Status"
          message="Do you really want to update this news status?"
          onClose={() => setShowStatusUpdatePopup(false)}
          onConfirm={handleToggleStatus}
          loading={submitting}
          confirmText="Update"
          cancelText="Cancel"
          loadingText="Updating..."
          buttonColor={!selectedNews?.status ? "amber" : "green"}
          modalIcon={CheckCircle}
        />

        {/* Delete Confirmation Popup */}
        <DeleteModal
          show={showDeletePopup}
          title="Delete News"
          message="This action cannot be undone. Do you really want to delete this news?"
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

  // Modal component
  const NewsModal = ({ 
    isEdit = false,
    isOpen,
    setIsOpen,
    onSubmit,
    formData,
    formErrors,
    handleInputChange,
    imagePreview,
    handleFileChange,
    submitting
  }: {
    isEdit?: boolean;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: any;
    formErrors: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    imagePreview: string | null;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    submitting: boolean;
  }) => {
    const title = isEdit ? "Edit News" : "Add New News";
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-neutral-700 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700 sticky top-0 bg-white dark:bg-neutral-800 z-10">
            <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <div className="p-2 bg-primary rounded-lg shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.2)]">
                <Newspaper className="text-white" size={20} />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Image & Basic Info */}
              <div className="space-y-6">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.title
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-primary/50 focus:border-primary'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all`}
                    placeholder="Enter news title"
                    disabled={submitting}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.title}</p>
                  )}
                </div>

                {/* Status Field */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Active news will be visible to users
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status === 1}
                      onChange={handleInputChange}
                      className="sr-only peer"
                      disabled={submitting}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {formData.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Right Column - Image & content */}
              <div className="space-y-6">
                {/* Image Upload/URL Field */}
                <div>                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=400&h=200&fit=crop";
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                          Preview
                        </div>
                      </div>
                    </div>
                  )}

                  {/* File Upload Alternative */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                        disabled={submitting}
                      />
                      <label 
                        htmlFor="image-upload" 
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <ImageIcon className="text-gray-400 dark:text-gray-500 mb-2" size={24} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* content Field - Full Width */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formErrors.content
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary/50 focus:border-primary'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all resize-none`}
                placeholder="Enter news content/content"
                disabled={submitting}
              />
              {formErrors.content && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.content}</p>
              )}
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
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-primary hover:bg-primary/90 text-white transition-all shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_6px_16px_rgba(var(--color-primary-rgb),0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isEdit ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isEdit ? "Update News" : "Create News"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default NewsList;