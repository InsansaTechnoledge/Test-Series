import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ message, variant = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible) return null;
  
  const variants = {
    success: {
      bgColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      iconBg: 'bg-green-100'
    },
    error: {
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      iconBg: 'bg-red-100'
    },
    warning: {
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-800',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      iconBg: 'bg-yellow-100'
    },
    info: {
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      iconBg: 'bg-blue-100'
    },
    delete: {
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-800',
      icon: <CheckCircle className="w-5 h-5 text-red-600" />,
      iconBg: 'bg-red-100'
    }
  };
  
  const currentVariant = variants[variant] || variants.success;
  
  return (
    <div className={`fixed top-4 right-4 max-w-md w-full ${currentVariant.bgColor} border rounded-lg shadow-lg p-4 flex items-center gap-3 z-50 animate-in slide-in-from-top-2`}>
      <div className={`${currentVariant.iconBg} rounded-full p-1 flex-shrink-0`}>
        {currentVariant.icon}
      </div>
      <div className={`${currentVariant.textColor} flex-1 text-sm font-medium`}>
        {message}
      </div>
      <button 
        onClick={handleClose}
        className={`${currentVariant.textColor} hover:opacity-70 transition-opacity`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Manager Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  
  const showToast = (message, variant = 'success', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, variant, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return { toasts, showToast, removeToast };
};

// Toast Container Component
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

// Named exports
export { useToast, Toast, ToastContainer };