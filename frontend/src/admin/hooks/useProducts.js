import { useState, useEffect, useCallback } from 'react';
import { useAdminToast } from './useAdminToast';
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

export function useProducts() {
  const { showToast } = useAdminToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total_products: 0,
    archived_products: 0,
    available_products: 0,
    not_available_products: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
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
  }, [debouncedSearch, filterCategory, showArchived]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      if (result.success) {
        showToast('Product updated successfully', { type: 'success', dismissible: true });
        await fetchData();
        setShowFormModal(false);
        setSelectedProduct(null);
      } else {
        showToast(result.error || 'Failed to update product', { type: 'error', dismissible: true, duration: 4000 });
      }
    } else {
      result = await createProduct(productData);
      if (result.success) {
        showToast('Product created successfully', { type: 'success', dismissible: true });
        await fetchData();
        setShowFormModal(false);
        setSelectedProduct(null);
      } else {
        showToast(result.error || 'Failed to create product', { type: 'error', dismissible: true, duration: 4000 });
      }
    }
    setActionLoading(false);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setSelectedProduct(null);
  };

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
      const status = isAvailable ? 'enabled' : 'disabled';
      showToast(`Product ${status} successfully`, { type: 'success', dismissible: true });
      await fetchData();
    } else {
      showToast(result.error || 'Failed to update availability', { type: 'error', dismissible: true, duration: 4000 });
    }
    setActionLoading(false);
    setShowAvailabilityModal(false);
    setSelectedProduct(null);
  };

  const closeAvailabilityModal = () => {
    setShowAvailabilityModal(false);
    setSelectedProduct(null);
  };

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
      const action = isRestoring ? 'restored' : 'archived';
      showToast(`Product ${action} successfully`, { type: 'success', dismissible: true });
      await fetchData();
    } else {
      const action = isRestoring ? 'restore' : 'archive';
      showToast(result.error || `Failed to ${action} product`, { type: 'error', dismissible: true, duration: 4000 });
    }
    setActionLoading(false);
    setShowArchiveModal(false);
    setSelectedProduct(null);
  };

  const closeArchiveModal = () => {
    setShowArchiveModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    const result = await deleteProduct(selectedProduct.id);
    if (result.success) {
      showToast('Product deleted permanently', { type: 'success', dismissible: true });
      await fetchData();
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } else {
      showToast(result.error || 'Failed to delete product', { type: 'error', dismissible: true, duration: 4000 });
    }
    setActionLoading(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const toggleArchivedView = () => {
    setShowArchived(!showArchived);
  };

  return {
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
  };
}
