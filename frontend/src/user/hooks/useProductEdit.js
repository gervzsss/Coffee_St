import { useState } from 'react';
import api from '../services/apiClient';

export function useProductEdit(onUpdateComplete, setError) {
  const [editingItem, setEditingItem] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  const openEditModal = async (item) => {
    if (!item.selected_variants || item.selected_variants.length === 0) {
      return;
    }

    setEditingItemId(item.id);
    try {
      const response = await api.get(`/products/${item.product_id}`);
      setEditingProduct(response.data);
      setEditingItem(item);
    } catch (err) {
      console.error('Failed to fetch product details:', err);
      setError('Failed to load product details');
      setEditingItemId(null);
    }
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setEditingProduct(null);
    setEditingItemId(null);
  };

  const handleSave = async (cartData, updateCartItem, removeFromSelection) => {
    if (!editingItem) return;

    try {
      await updateCartItem(editingItem.id, cartData);
      removeFromSelection(editingItem.id);
      closeEditModal();
      if (onUpdateComplete) {
        onUpdateComplete();
      }
    } catch (err) {
      setEditingItemId(null);
    }
  };

  return {
    editingItem,
    editingProduct,
    editingItemId,
    openEditModal,
    closeEditModal,
    handleSave,
  };
}
