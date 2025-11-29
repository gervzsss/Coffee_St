import { useState } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import api from '../services/apiClient';

export const useProductCard = (product) => {
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);

  const hasVariants =
    product.active_variants && product.active_variants.length > 0;

  const hasVariantGroups =
    product.active_variant_groups && product.active_variant_groups.length > 0;

  const calculatePrice = (variant = null) => {
    const basePrice = parseFloat(product.price);
    const delta = variant ? parseFloat(variant.price_delta) : 0;
    return basePrice + delta;
  };

  const handleAddToCartWithVariants = async (cartData) => {
    if (!user) {
      showToast('Please log in to add items to cart', {
        type: 'warning',
        dismissible: true,
      });
      openAuthModal('login');
      return;
    }

    setIsAdding(true);
    try {
      await api.post('/cart', cartData);

      setAddedToCart(true);
      setShowCustomizationModal(false);

      window.dispatchEvent(new Event('cartUpdated'));

      showToast(`${product.name} added to cart!`, {
        type: 'success',
        dismissible: true,
      });

      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to add to cart';
      showToast(errorMessage, {
        type: 'error',
        dismissible: true,
        duration: 4000,
      });
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToCart = async (variantId = null) => {
    if (!user) {
      showToast('Please log in to add items to cart', {
        type: 'warning',
        dismissible: true,
      });
      openAuthModal('login');
      return;
    }

    setIsAdding(true);
    try {
      const payload = {
        product_id: product.id,
        quantity: 1,
      };

      if (variantId) {
        payload.variant_id = variantId;
      }

      await api.post('/cart', payload);

      setAddedToCart(true);
      setShowVariantModal(false);
      setSelectedVariant(null);

      window.dispatchEvent(new Event('cartUpdated'));

      showToast(`${product.name} added to cart!`, {
        type: 'success',
        dismissible: true,
      });

      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to add to cart';
      showToast(errorMessage, {
        type: 'error',
        dismissible: true,
        duration: 4000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToCartClick = () => {
    setShowCustomizationModal(true);
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleConfirmVariant = () => {
    if (selectedVariant) {
      handleAddToCart(selectedVariant.id);
    }
  };

  const closeVariantModal = () => {
    setShowVariantModal(false);
    setSelectedVariant(null);
  };

  const closeCustomizationModal = () => {
    setShowCustomizationModal(false);
  };

  return {
    isAdding,
    addedToCart,
    selectedVariant,
    showVariantModal,
    showCustomizationModal,
    hasVariants,
    hasVariantGroups,
    calculatePrice,
    handleAddToCart,
    handleAddToCartClick,
    handleVariantSelect,
    handleConfirmVariant,
    closeVariantModal,
    closeCustomizationModal,
    handleAddToCartWithVariants,
  };
};
