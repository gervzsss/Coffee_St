import { useState, useEffect } from "react";
import { ButtonSpinner } from "../common";
import StockHistoryModal from "./StockHistoryModal";

const ADJUSTMENT_TYPES = [
  { value: "add", label: "Add Stock (Restock)" },
  { value: "remove", label: "Remove Stock (Damage/Expired)" },
  { value: "set", label: "Set Exact Quantity" },
];

const REASONS = [
  { value: "restock", label: "Received Shipment" },
  { value: "adjustment", label: "Inventory Adjustment" },
  { value: "damaged", label: "Damaged Items" },
  { value: "expired", label: "Expired Items" },
  { value: "returned", label: "Customer Return" },
];

export default function StockUpdateModal({ product, onSave, onCancel, isLoading }) {
  const [showStockHistory, setShowStockHistory] = useState(false);
  const [formData, setFormData] = useState({
    adjustment_type: "add",
    quantity: "",
    reason: "restock",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [newStock, setNewStock] = useState(null);

  // Calculate new stock whenever inputs change
  useEffect(() => {
    if (!formData.quantity || !product) {
      setNewStock(null);
      return;
    }

    const qty = parseInt(formData.quantity);
    const currentStock = product.stock_quantity || 0;

    let calculated;
    switch (formData.adjustment_type) {
      case "add":
        calculated = currentStock + qty;
        break;
      case "remove":
        calculated = Math.max(0, currentStock - qty);
        break;
      case "set":
        calculated = qty;
        break;
      default:
        calculated = currentStock;
    }

    setNewStock(calculated);
  }, [formData.adjustment_type, formData.quantity, product]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (formData.adjustment_type === "remove") {
      const qty = parseInt(formData.quantity);
      if (qty > (product.stock_quantity || 0)) {
        newErrors.quantity = `Cannot remove more than current stock (${product.stock_quantity || 0})`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave({
      ...formData,
      quantity: parseInt(formData.quantity),
    });
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Update Stock</h2>
              <p className="mt-1 text-sm text-gray-600">{product.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setShowStockHistory(true)} className="rounded-lg p-2 text-[#30442B] hover:bg-gray-100" title="View Stock History">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button onClick={onCancel} disabled={isLoading} className="p-1 text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {/* Current Stock Display */}
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className="text-3xl font-bold text-gray-900">
                {product.stock_quantity || 0} <span className="text-lg text-gray-500">items</span>
              </p>
            </div>

            {/* Adjustment Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Adjustment Type</label>
              <div className="space-y-2">
                {ADJUSTMENT_TYPES.map((type) => (
                  <label key={type.value} className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="adjustment_type"
                      value={type.value}
                      checked={formData.adjustment_type === type.value}
                      onChange={(e) => handleChange("adjustment_type", e.target.value)}
                      className="h-4 w-4 border-gray-300 text-[#30442B] focus:ring-[#30442B]"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 ${
                  errors.quantity ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-[#30442B] focus:ring-[#30442B]/20"
                }`}
                placeholder="Enter quantity"
                disabled={isLoading}
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
            </div>

            {/* Reason Dropdown */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Reason</label>
              <select
                value={formData.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20"
                disabled={isLoading}
              >
                {REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20"
                placeholder="Add any additional notes..."
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">{formData.notes.length}/500 characters</p>
            </div>

            {/* New Stock Preview */}
            {newStock !== null && (
              <div className="rounded-lg border-2 border-[#30442B] bg-[#30442B]/5 p-4">
                <p className="text-sm font-medium text-gray-700">New Stock Level</p>
                <p className="text-3xl font-bold text-[#30442B]">
                  {newStock} <span className="text-lg text-gray-600">items</span>
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {formData.adjustment_type === "add" && `+${formData.quantity} items added`}
                  {formData.adjustment_type === "remove" && `-${formData.quantity} items removed`}
                  {formData.adjustment_type === "set" && `Set to ${formData.quantity} items`}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button onClick={onCancel} disabled={isLoading} className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#30442B] px-4 py-2.5 font-medium text-white hover:bg-[#22301e] disabled:opacity-50"
            >
              {isLoading && <ButtonSpinner />}
              Update Stock
            </button>
          </div>
        </div>
      </div>

      {/* Stock History Modal */}
      {showStockHistory && <StockHistoryModal isOpen={showStockHistory} onClose={() => setShowStockHistory(false)} product={product} />}
    </div>
  );
}
