import { useState } from 'react';

const useProductCustomization = (onAddToCartCallback) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openCustomizationModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeCustomizationModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleAddToCart = async (cartData) => {
    if (onAddToCartCallback) {
      await onAddToCartCallback(cartData);
    }
  };

  return {
    isModalOpen,
    selectedProduct,
    openCustomizationModal,
    closeCustomizationModal,
    handleAddToCart
  };
};

export { useProductCustomization };
export default useProductCustomization;
