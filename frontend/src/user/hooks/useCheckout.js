import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './useToast';
import { useCart } from './useCart';
import { TOAST_DURATION } from '../constants/toastConfig';
import api from '../services/apiClient';

export function useCheckout(selectedCartItems = [], user = null, isBuyNow = false) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { fetchCartCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    delivery_address: '',
    delivery_contact: '',
    delivery_instructions: '',
    payment_method: 'cash',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        delivery_address: user.address || '',
        delivery_contact: user.phone || '',
      }));
    }
  }, [user]);

  const validateForm = () => {
    const errors = {};

    if (!formData.delivery_address.trim()) {
      errors.delivery_address = 'Delivery address is required';
    } else if (formData.delivery_address.trim().length < 10) {
      errors.delivery_address = 'Please provide a complete address';
    }

    if (!formData.delivery_contact.trim()) {
      errors.delivery_contact = 'Contact number is required';
    } else if (!/^[\d\s+()-]+$/.test(formData.delivery_contact)) {
      errors.delivery_contact = 'Please enter a valid phone number';
    }

    if (!formData.payment_method) {
      errors.payment_method = 'Please select a payment method';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotals = () => {
    const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.line_total || 0), 0);
    const deliveryFee = 50.00;
    const total = subtotal + deliveryFee;

    return { subtotal, deliveryFee, total };
  };

  const submitOrder = async () => {
    if (!validateForm()) {
      setError('Please fill in all required fields correctly');
      return null;
    }

    if (selectedCartItems.length === 0) {
      setError('No items selected for checkout');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const totals = calculateTotals();
      let response;

      if (isBuyNow) {
        // Buy Now flow - create order directly from product
        const item = selectedCartItems[0];

        // Transform selected_variants back to the format expected by the API
        const variants = (item.selected_variants || []).map(v => ({
          id: v.variant_id || v.id,
          group_name: v.name || v.group_name,
          name: v.option || v.variant_name,
          price_delta: v.price_delta || 0,
        }));

        response = await api.post('/orders/buy-now', {
          product_id: item.product_id,
          quantity: item.quantity,
          variants: variants,
          delivery_address: formData.delivery_address,
          delivery_contact: formData.delivery_contact,
          delivery_instructions: formData.delivery_instructions || null,
          payment_method: formData.payment_method,
          delivery_fee: totals.deliveryFee,
        });
      } else {
        // Regular cart checkout flow
        const selectedItemIds = selectedCartItems.map(item => item.id);

        response = await api.post('/orders', {
          selected_items: selectedItemIds,
          delivery_address: formData.delivery_address,
          delivery_contact: formData.delivery_contact,
          delivery_instructions: formData.delivery_instructions || null,
          payment_method: formData.payment_method,
          delivery_fee: totals.deliveryFee,
        });

        // Only update cart count for regular checkout
        await fetchCartCount();
        window.dispatchEvent(new Event('cartUpdated'));
      }

      const order = response.data.order;

      showToast('Order placed successfully!', {
        type: 'success',
        dismissible: true,
        duration: TOAST_DURATION.SUCCESS,
      });

      navigate(`/order-success/${order.order_number}`, {
        state: { order },
        replace: true,
      });

      return order;
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to place order. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, {
        type: 'error',
        dismissible: true,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (newData) => {
    setFormData(newData);
    const updatedErrors = { ...formErrors };
    Object.keys(newData).forEach(key => {
      if (newData[key] !== formData[key]) {
        delete updatedErrors[key];
      }
    });
    setFormErrors(updatedErrors);
  };

  return {
    formData,
    formErrors,
    loading,
    error,
    updateFormData,
    submitOrder,
    calculateTotals,
    setError,
  };
}
