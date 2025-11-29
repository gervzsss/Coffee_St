import { AdminLayout } from '../components/layout';
import { LoadingSpinner } from '../components/common';
import {
  ProductDetailsModal,
  ProductFormModal,
  AvailabilityModal,
  ArchiveModal,
  DeleteConfirmModal,
} from '../components/products';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../constants/categories';

export default function Products() {
  const {
    products,
    loading,
    metrics,
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

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Catalog Management
              </h1>
              <p className="text-gray-600">
                Manage your products and categories
              </p>
            </div>
            <button
              onClick={toggleArchivedView}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#30442B] text-white rounded-full font-medium hover:bg-[#22301e] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              {showArchived ? 'Active Products' : 'Archived Products'}
            </button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Active Products</p>
              <p className="text-4xl font-bold text-gray-900">
                {metrics.total_products}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Archived Products</p>
              <p className="text-4xl font-bold text-gray-900">
                {metrics.archived_products}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Available</p>
              <p className="text-4xl font-bold text-green-600">
                {metrics.available_products}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Not Available</p>
              <p className="text-4xl font-bold text-red-600">
                {metrics.not_available_products}
              </p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-[#30442B] rounded-2xl p-5 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 bg-white focus:outline-none focus:border-[#30442B] text-sm"
                />
              </div>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none bg-white px-6 py-3 pr-12 rounded-full border-2 border-gray-200 font-medium text-gray-700 cursor-pointer focus:outline-none focus:border-[#30442B]"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {showArchived ? 'Archived' : 'Active'} Products (
                {products.length})
              </h2>
              {!showArchived && (
                <button
                  onClick={handleAddProduct}
                  className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg hover:bg-[#22301e] transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Product
                </button>
              )}
            </div>

            {loading ? (
              <LoadingSpinner className="py-16" />
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p className="text-gray-500">
                  {showArchived
                    ? 'No archived products'
                    : 'No products yet. Click "Add Product" to create your first item.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase">
                        Available
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
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
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 capitalize">
                            {product.category?.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-900">
                          ₱{Number(product.price).toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              product.archived_at
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {product.archived_at ? 'Archived' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleAvailabilityClick(product)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#30442B] focus:ring-offset-2 ${
                              product.is_available
                                ? 'bg-[#30442B]'
                                : 'bg-gray-300'
                            }`}
                            role="switch"
                            aria-checked={product.is_available}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                product.is_available
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(product.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="View Details"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            {!showArchived && (
                              <button
                                onClick={() => handleEditProduct(product.id)}
                                className="p-2 text-[#30442B] hover:bg-[#30442B]/10 rounded-lg"
                                title="Edit"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleArchiveClick(product, showArchived)
                              }
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              title={showArchived ? 'Restore' : 'Archive'}
                            >
                              {showArchived ? (
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                  />
                                </svg>
                              )}
                            </button>
                            {showArchived && (
                              <button
                                onClick={() => handleDeleteClick(product)}
                                className={`p-2 rounded-lg ${
                                  product.has_orders
                                    ? 'text-gray-400 hover:bg-gray-100 cursor-help'
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                                title={
                                  product.has_orders
                                    ? 'Cannot delete - has order history (click for details)'
                                    : 'Delete Permanently'
                                }
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
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
      </div>

      {/* Modals */}
      {showDetailsModal && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={closeDetailsModal}
        />
      )}

      {showFormModal && (
        <ProductFormModal
          product={selectedProduct}
          onSave={handleSaveProduct}
          onCancel={closeFormModal}
          isLoading={actionLoading}
        />
      )}

      {showAvailabilityModal && (
        <AvailabilityModal
          product={selectedProduct}
          onConfirm={handleAvailabilityConfirm}
          onCancel={closeAvailabilityModal}
          isLoading={actionLoading}
        />
      )}

      {showArchiveModal && (
        <ArchiveModal
          product={selectedProduct}
          isRestore={isRestoring}
          onConfirm={handleArchiveConfirm}
          onCancel={closeArchiveModal}
          isLoading={actionLoading}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          product={selectedProduct}
          onConfirm={handleDeleteConfirm}
          onCancel={closeDeleteModal}
          isLoading={actionLoading}
        />
      )}
    </AdminLayout>
  );
}
