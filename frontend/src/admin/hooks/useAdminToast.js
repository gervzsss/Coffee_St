import { useContext } from 'react';
import { AdminToastContext } from '../context/ToastContext';

export const useAdminToast = () => {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error('useAdminToast must be used within an AdminToastProvider');
  }
  return context;
};
