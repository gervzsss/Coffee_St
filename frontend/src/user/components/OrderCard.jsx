import { Package, Calendar, Clock, ShoppingCart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useReorder } from '../hooks/useReorder';

export default function OrderCard({ order, onViewDetails }) {
  const navigate = useNavigate();
  const { reorderItems, reordering } = useReorder();
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getItemsSummary = () => {
    if (!order.items || order.items.length === 0) return 'No items';

    const totalItems = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const firstTwo = order.items.slice(0, 2);

    const summary = firstTwo
      .map((item) => `${item.quantity}x ${item.product_name}`)
      .join(', ');

    const remaining = order.items.length - 2;

    if (remaining > 0) {
      return `${summary} + ${remaining} more`;
    }

    return summary;
  };

  const getPaymentMethodLabel = (method) => {
    return method === 'cash' ? 'Cash on Delivery' : 'GCash';
  };

  const handleReorder = async (e) => {
    e.stopPropagation();

    if (!order.items || order.items.length === 0) {
      return;
    }

    const result = await reorderItems(order.items);

    if (result.success) {
      navigate('/cart');
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-[#30442B]" />
            <h3 className="font-outfit text-lg font-semibold text-gray-900">
              {order.order_number}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatOrderDate(order.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Clock className="w-4 h-4" />
            <span>{getRelativeTime(order.created_at)}</span>
          </div>
        </div>

        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Items Summary */}
      <div className="mb-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-1">Order Items</p>
        <p className="text-gray-900">{getItemsSummary()}</p>
        <p className="text-xs text-gray-500 mt-1">
          Payment: {getPaymentMethodLabel(order.payment_method)}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-[#30442B]">
            ₱{order.total.toFixed(2)}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReorder}
            disabled={reordering}
            className="px-4 py-2.5 border-2 border-[#30442B] text-[#30442B] rounded-lg font-semibold hover:bg-[#30442B]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Add items to cart"
          >
            {reordering ? (
              <div className="w-5 h-5 border-2 border-[#30442B] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => onViewDetails(order)}
            className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg font-semibold hover:bg-[#405939] transition-colors active:scale-95"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
