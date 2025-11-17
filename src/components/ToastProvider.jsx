import { createContext, useContext } from 'react';
import useToast from '../hooks/useToast';
import Toast from './Toast';

const ToastContext = createContext();

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const toastMethods = useToast();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      
      {/* Rendu des toasts */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
        {toastMethods.toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            duration={0} // Géré par le hook
            onClose={() => toastMethods.removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;