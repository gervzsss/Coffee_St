import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiClient';

export function useCheckout(selectedCartItems = []) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    delivery_address: '',
    delivery_contact: '',
    delivery_instructions: '',
    payment_method: 'cash',
  });

  const [formErrors, setFormErrors] = useState({});

  // Validate form
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

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.line_total || 0), 0);
    const deliveryFee = 50.00;
    const taxRate = 0.12;
    const tax = subtotal * taxRate;
    const total = subtotal + tax + deliveryFee;

    return { subtotal, deliveryFee, taxRate, tax, total };
  };

  // Submit order
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
      const selectedItemIds = selectedCartItems.map(item => item.id);
      const totals = calculateTotals();

      const response = await api.post('/orders', {
        selected_items: selectedItemIds,
        delivery_address: formData.delivery_address,
        delivery_contact: formData.delivery_contact,
        delivery_instructions: formData.delivery_instructions || null,
        payment_method: formData.payment_method,
        delivery_fee: totals.deliveryFee,
        tax_rate: totals.taxRate,
      });

      const order = response.data.order;
      
      // Navigate to success page with order data
      navigate(`/order-success/${order.order_number}`, {
        state: { order },
        replace: true,
      });

      return order;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update form data
  const updateFormData = (newData) => {
    setFormData(newData);
    // Clear errors for updated fields
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
