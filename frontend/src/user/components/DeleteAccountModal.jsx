import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiClient';

export default function DeleteAccountModal({ isOpen, onClose }) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleClose = () => {
    if (!loading) {
      setUnderstood(false);
      setConfirmText('');
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!understood || confirmText !== 'DELETE') {
      return;
    }

    setLoading(true);

    try {
      await api.post('/user/soft-delete', {
        confirmation: confirmText,
      });

      showToast('Account deleted successfully', {
        type: 'success',
        dismissible: true,
      });

      setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Account deletion error:', error);
      showToast(error.response?.data?.message || 'Failed to delete account', {
        type: 'error',
        dismissible: true,
      });
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Delete Account
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6">
                {/* Warning Message */}
                <div className="space-y-3">
                  <p className="text-gray-800 font-medium">
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800 font-medium mb-2">
                      The following data will be deleted:
                    </p>
                    <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                      <li>Profile information and settings</li>
                      <li>Order history and purchase records</li>
                      <li>Shopping cart and saved items</li>
                      <li>Messages and inquiry threads</li>
                      <li>All personal data associated with your account</li>
                    </ul>
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="understand-deletion"
                      checked={understood}
                      onChange={(e) => setUnderstood(e.target.checked)}
                      disabled={loading}
                      className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label
                      htmlFor="understand-deletion"
                      className="text-sm text-gray-700 cursor-pointer select-none"
                    >
                      I understand that this action is permanent and my data
                      cannot be recovered
                    </label>
                  </div>

                  {/* Confirmation Text Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type{' '}
                      <span className="font-bold text-red-600">DELETE</span> to
                      confirm
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      disabled={loading || !understood}
                      placeholder="DELETE"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading || !understood || confirmText !== 'DELETE'}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
