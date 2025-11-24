import { useState } from 'react';

export function useCartSelection(cartItems) {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    }
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const removeFromSelection = (itemId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  return {
    selectedItems,
    toggleSelectAll,
    toggleSelectItem,
    clearSelection,
    removeFromSelection,
  };
}
