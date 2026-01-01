import { useContext } from 'react';
import { AdminToastContext } from '../context/AdminToastContext';

export const useAdminToast = () => {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error('useAdminToast must be used within an AdminToastProvider');
  }
  return context;
};
