import { AdminLayout } from "../components/layout";
import { AdminAnimatedPage } from "../components/common";
import { ProductDetailsModal, ProductFormModal, AvailabilityModal, ArchiveModal, DeleteConfirmModal, ProductMetricSkeleton, ProductTableSkeleton, StockUpdateModal } from "../components/products";
import { useProducts } from "../hooks/useProducts";
import { useAdminToast } from "../hooks/useAdminToast";
import { CATEGORIES } from "../constants/categories";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RefreshCw } from "lucide-react";

export default function Products() {
  const { showToast } = useAdminToast();
  const location = useLocation();
  const [stockFilter, setStockFilter] = useState("all"); // all, sold_out, low_stock, in_stock
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Check if coming from dashboard with a filter
  useEffect(() => {
    if (location.state?.stockFilter) {
      setStockFilter(location.state.stockFilter);
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const {
    products,
    loading,
    metrics,
    fetchData,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    showArchived,
    toggleArchivedView,
    selectedProduct,
    showDetailsModal,
    showFormModal,
    showAvailabilityModal,
    showArchiveModal,
    showDeleteModal,
    isRestoring,
    actionLoading,
    handleViewDetails,
    closeDetailsModal,
    handleAddProduct,
    handleEditProduct,
    handleSaveProduct,
    closeFormModal,
    handleAvailabilityClick,
    handleAvailabilityConfirm,
    closeAvailabilityModal,
    handleArchiveClick,
    handleArchiveConfirm,
    closeArchiveModal,
    handleDeleteClick,
    handleDeleteConfirm,
    closeDeleteModal,
  } = useProducts();

  // Handler for quick edit stock
  const handleQuickEdit = (product) => {
    setSelectedProductForStock(product);
    setShowStockUpdateModal(true);
  };

  const handleStockUpdateClose = () => {
    setShowStockUpdateModal(false);
    setSelectedProductForStock(null);
  };

  const handleStockUpdateSave = async (stockData) => {
    try {
      const adminApi = (await import("../services/apiClient")).default;
      await adminApi.post(`/products/${selectedProductForStock.id}/stock`, stockData);

      showToast("Stock updated successfully", { type: "success", dismissible: true });
      handleStockUpdateClose();
      // Refresh products list with skeleton loader
      await fetchData();
    } catch (error) {
      console.error("Failed to update stock:", error);
      showToast(error.response?.data?.message || error.message || "Failed to update stock", { type: "error", dismissible: true, duration: 4000 });
    }
  };

  return (
    <AdminLayout>
      <AdminAnimatedPage className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:mb-2 sm:text-3xl lg:text-4xl">Catalog Management</h1>
              <p className="text-sm text-gray-600 sm:text-base">Manage your products and categories</p>
            </div>
            {/* View Mode Toggle */}
            <div className="flex rounded-full bg-gray-100 p-1">
              <button
                onClick={() => !showArchived || toggleArchivedView()}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-5 sm:py-2.5 ${
                  !showArchived ? "bg-[#30442B] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => showArchived || toggleArchivedView()}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-5 sm:py-2.5 ${
                  showArchived ? "bg-[#30442B] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Archived
              </button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:rounded-2xl sm:p-5 lg:p-6">
              <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">Active Products</p>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">{metrics.total_products}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:rounded-2xl sm:p-5 lg:p-6">
              <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">Archived Products</p>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">{metrics.archived_products}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:rounded-2xl sm:p-5 lg:p-6">
              <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">Available</p>
              <p className="text-2xl font-bold text-green-600 sm:text-3xl lg:text-4xl">{metrics.available_products}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:rounded-2xl sm:p-5 lg:p-6">
              <p className="mb-1 text-xs text-gray-500 sm:mb-2 sm:text-sm">Not Available</p>
              <p className="text-2xl font-bold text-red-600 sm:text-3xl lg:text-4xl">{metrics.not_available_products}</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="mb-6 rounded-xl bg-[#30442B] p-3 sm:mb-8 sm:rounded-2xl sm:p-4 lg:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="relative flex-1">
                <svg className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border-2 border-gray-200 bg-white py-2.5 pr-4 pl-10 text-xs focus:border-[#30442B] focus:outline-none sm:py-3 sm:pl-12 sm:text-sm"
                />
              </div>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-full border-2 border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:border-[#30442B] focus:outline-none sm:w-auto sm:px-6 sm:py-3 sm:pr-12"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 sm:right-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Stock Quick Filters */}
          {!showArchived && (
            <div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setStockFilter("all")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  stockFilter === "all" ? "bg-[#30442B] text-white shadow-md" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setStockFilter("sold_out")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  stockFilter === "sold_out" ? "bg-red-600 text-white shadow-md" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                🔴 Sold Out
              </button>
              <button
                onClick={() => setStockFilter("low_stock")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  stockFilter === "low_stock" ? "bg-yellow-500 text-white shadow-md" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                🟡 Low Stock
              </button>
              <button
                onClick={() => setStockFilter("in_stock")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  stockFilter === "in_stock" ? "bg-green-600 text-white shadow-md" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                🟢 In Stock
              </button>
            </div>
          )}

          {/* Products Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white sm:rounded-2xl">
            <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                {showArchived ? "Archived" : "Active"} Products ({products.length})
              </h2>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                  aria-label="Refresh products"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2.5"
                >
                  <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${refreshing ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                {!showArchived && (
                  <button
                    onClick={handleAddProduct}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#30442B] px-4 py-2 text-sm text-white transition-colors hover:bg-[#22301e] sm:px-6 sm:py-2.5"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="hidden sm:inline">Add Product</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <ProductTableSkeleton />
            ) : products.length === 0 ? (
              <div className="py-12 text-center sm:py-16">
                <svg className="mx-auto mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-gray-500">{showArchived ? "No archived products" : 'No products yet. Click "Add Product" to create your first item.'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Available</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products
                      .filter((product) => {
                        // Apply stock filter only for active products
                        if (showArchived || stockFilter === "all") return true;

                        if (!product.track_stock) return stockFilter === "all";

                        if (stockFilter === "sold_out") return product.is_sold_out;
                        if (stockFilter === "low_stock") return product.is_low_stock && !product.is_sold_out;
                        if (stockFilter === "in_stock") return !product.is_sold_out && !product.is_low_stock;

                        return true;
                      })
                      .map((product) => (
                        <tr key={product.id} className="transition-colors hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="max-w-xs truncate text-sm text-gray-500">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 capitalize">{product.category?.replace("-", " ")}</span>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">₱{Number(product.price).toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {!product.track_stock ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                  </svg>
                                  Not Tracked
                                </span>
                              ) : product.is_sold_out ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Sold Out
                                </span>
                              ) : product.is_low_stock ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Low ({product.stock_quantity})
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  In Stock ({product.stock_quantity})
                                </span>
                              )}
                              {product.track_stock && !showArchived && (
                                <button
                                  onClick={() => handleQuickEdit(product)}
                                  className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#30442B]"
                                  title="Quick Edit Stock"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`rounded-full px-3 py-1 text-sm ${product.archived_at ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-800"}`}>
                              {product.archived_at ? "Archived" : "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleAvailabilityClick(product)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-[#30442B] focus:ring-offset-2 focus:outline-none ${
                                product.is_available ? "bg-[#30442B]" : "bg-gray-300"
                              }`}
                              role="switch"
                              aria-checked={product.is_available}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.is_available ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleViewDetails(product.id)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100" title="View Details">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>
                              {!showArchived && (
                                <button onClick={() => handleEditProduct(product.id)} className="rounded-lg p-2 text-[#30442B] hover:bg-[#30442B]/10" title="Edit">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              )}
                              <button onClick={() => handleArchiveClick(product, showArchived)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100" title={showArchived ? "Restore" : "Archive"}>
                                {showArchived ? (
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                  </svg>
                                ) : (
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                  </svg>
                                )}
                              </button>
                              {showArchived && (
                                <button
                                  onClick={() => handleDeleteClick(product)}
                                  className={`rounded-lg p-2 ${product.has_orders ? "cursor-help text-gray-400 hover:bg-gray-100" : "text-red-600 hover:bg-red-50"}`}
                                  title={product.has_orders ? "Cannot delete - has order history (click for details)" : "Delete Permanently"}
                                >
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminAnimatedPage>

      {/* Modals */}
      {showDetailsModal && <ProductDetailsModal product={selectedProduct} onClose={closeDetailsModal} />}

      {showFormModal && <ProductFormModal product={selectedProduct} onSave={handleSaveProduct} onCancel={closeFormModal} isLoading={actionLoading} />}

      {showAvailabilityModal && <AvailabilityModal product={selectedProduct} onConfirm={handleAvailabilityConfirm} onCancel={closeAvailabilityModal} isLoading={actionLoading} />}

      {showArchiveModal && <ArchiveModal product={selectedProduct} isRestore={isRestoring} onConfirm={handleArchiveConfirm} onCancel={closeArchiveModal} isLoading={actionLoading} />}

      {showDeleteModal && <DeleteConfirmModal product={selectedProduct} onConfirm={handleDeleteConfirm} onCancel={closeDeleteModal} isLoading={actionLoading} />}

      {showStockUpdateModal && selectedProductForStock && <StockUpdateModal product={selectedProductForStock} onSave={handleStockUpdateSave} onCancel={handleStockUpdateClose} isLoading={false} />}
    </AdminLayout>
  );
}
