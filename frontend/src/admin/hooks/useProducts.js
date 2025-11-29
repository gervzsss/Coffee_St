import { useState, useEffect } from 'react';
import {
  getAllProducts,
  getProductMetrics,
  getProduct,
  createProduct,
  updateProduct,
  updateProductAvailability,
  archiveProduct,
  restoreProduct,
  deleteProduct,
} from '../services/productService';

/**
 * Custom hook for managing products state and operations
 */
export function useProducts() {
  // Data state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total_products: 0,
    archived_products: 0,
    available_products: 0,
    not_available_products: 0,
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [debouncedSearch, filterCategory, showArchived]);

  const fetchData = async () => {
    setLoading(true);

    const metricsResult = await getProductMetrics();
    if (metricsResult.success) {
      setMetrics(metricsResult.data);
    }

    const filters = { archived: showArchived ? 'true' : 'false' };
    if (debouncedSearch) filters.search = debouncedSearch;
    if (filterCategory) filters.category = filterCategory;

    const productsResult = await getAllProducts(filters);
    if (productsResult.success) {
      setProducts(productsResult.data);
    }

    setLoading(false);
  };

  // View Details
  const handleViewDetails = async (productId) => {
    const result = await getProduct(productId);
    if (result.success) {
      setSelectedProduct(result.data);
      setShowDetailsModal(true);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProduct(null);
  };

  // Add/Edit Product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowFormModal(true);
  };

  const handleEditProduct = async (productId) => {
    const result = await getProduct(productId);
    if (result.success) {
      setSelectedProduct(result.data);
      setShowFormModal(true);
    }
  };

  const handleSaveProduct = async (productData) => {
    setActionLoading(true);
    let result;
    if (selectedProduct) {
      result = await updateProduct(selectedProduct.id, productData);
    } else {
      result = await createProduct(productData);
    }
    if (result.success) {
      await fetchData();
      setShowFormModal(false);
      setSelectedProduct(null);
    }
    setActionLoading(false);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setSelectedProduct(null);
  };

  // Availability
  const handleAvailabilityClick = (product) => {
    setSelectedProduct(product);
    setShowAvailabilityModal(true);
  };

  const handleAvailabilityConfirm = async (isAvailable, reason) => {
    if (!selectedProduct) return;
    setActionLoading(true);
    const result = await updateProductAvailability(
      selectedProduct.id,
      isAvailable,
      reason
    );
    if (result.success) {
      await fetchData();
    }
    setActionLoading(false);
    setShowAvailabilityModal(false);
    setSelectedProduct(null);
  };

  const closeAvailabilityModal = () => {
    setShowAvailabilityModal(false);
    setSelectedProduct(null);
  };

  // Archive/Restore
  const handleArchiveClick = (product, restore = false) => {
    setSelectedProduct(product);
    setIsRestoring(restore);
    setShowArchiveModal(true);
  };

  const handleArchiveConfirm = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    const result = isRestoring
      ? await restoreProduct(selectedProduct.id)
      : await archiveProduct(selectedProduct.id);
    if (result.success) {
      await fetchData();
    }
    setActionLoading(false);
    setShowArchiveModal(false);
    setSelectedProduct(null);
  };

  const closeArchiveModal = () => {
    setShowArchiveModal(false);
    setSelectedProduct(null);
  };

  // Delete
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    const result = await deleteProduct(selectedProduct.id);
    if (result.success) {
      await fetchData();
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } else {
      alert(result.error || 'Failed to delete product');
    }
    setActionLoading(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  // Toggle archived view
  const toggleArchivedView = () => {
    setShowArchived(!showArchived);
  };

  return {
    // Data
    products,
    loading,
    metrics,

    // Filters
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    showArchived,
    toggleArchivedView,

    // Modal state
    selectedProduct,
    showDetailsModal,
    showFormModal,
    showAvailabilityModal,
    showArchiveModal,
    showDeleteModal,
    isRestoring,
    actionLoading,

    // Actions
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
  };
}
