// import React, { useState, useEffect } from 'react';
// import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// const Toast = ({ message, variant = 'success', duration = 3000, onClose }) => {
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(false);
//       if (onClose) onClose();
//     }, duration);

//     return () => clearTimeout(timer);
//   }, [duration, onClose]);

//   const handleClose = () => {
//     setIsVisible(false);
//     if (onClose) onClose();
//   };

//   if (!isVisible) return null;

//   const variants = {
//     success: {
//       bgColor: 'bg-green-50 border-green-200',
//       textColor: 'text-green-800',
//       icon: <CheckCircle className="w-5 h-5 text-green-600" />,
//       iconBg: 'bg-green-100'
//     },
//     error: {
//       bgColor: 'bg-red-50 border-red-200',
//       textColor: 'text-red-800',
//       icon: <XCircle className="w-5 h-5 text-red-600" />,
//       iconBg: 'bg-red-100'
//     },
//     warning: {
//       bgColor: 'bg-yellow-50 border-yellow-200',
//       textColor: 'text-yellow-800',
//       icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
//       iconBg: 'bg-yellow-100'
//     },
//     info: {
//       bgColor: 'bg-blue-50 border-blue-200',
//       textColor: 'text-blue-800',
//       icon: <Info className="w-5 h-5 text-blue-600" />,
//       iconBg: 'bg-blue-100'
//     },
//     delete: {
//       bgColor: 'bg-red-50 border-red-200',
//       textColor: 'text-red-800',
//       icon: <CheckCircle className="w-5 h-5 text-red-600" />,
//       iconBg: 'bg-red-100'
//     }
//   };

//   const currentVariant = variants[variant] || variants.success;

//   return (
//     <div className={`fixed top-4 right-4 max-w-md w-full ${currentVariant.bgColor} border rounded-lg shadow-lg p-4 flex items-center gap-3 z-50 animate-in slide-in-from-top-2`}>
//       <div className={`${currentVariant.iconBg} rounded-full p-1 flex-shrink-0`}>
//         {currentVariant.icon}
//       </div>
//       <div className={`${currentVariant.textColor} flex-1 text-sm font-medium`}>
//         {message}
//       </div>
//       <button
//         onClick={handleClose}
//         className={`${currentVariant.textColor} hover:opacity-70 transition-opacity`}
//       >
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// // Toast Manager Hook
// const useToast = () => {
//   const [toasts, setToasts] = useState([]);

//   const showToast = (message, variant = 'success', duration = 3000) => {
//     const id = Date.now();
//     const newToast = { id, message, variant, duration };

//     setToasts(prev => [...prev, newToast]);

//     // Auto remove after duration
//     setTimeout(() => {
//       setToasts(prev => prev.filter(toast => toast.id !== id));
//     }, duration);
//   };

//   const removeToast = (id) => {
//     setToasts(prev => prev.filter(toast => toast.id !== id));
//   };

//   return { toasts, showToast, removeToast };
// };

// // Toast Container Component
// const ToastContainer = ({ toasts, onRemove }) => {
//   return (
//     <div className="fixed top-4 right-4 space-y-2 z-50">
//       {toasts.map((toast) => (
//         <Toast
//           key={toast.id}
//           message={toast.message}
//           variant={toast.variant}
//           duration={toast.duration}
//           onClose={() => onRemove(toast.id)}
//         />
//       ))}
//     </div>
//   );
// };

// // Named exports
// export { useToast, Toast, ToastContainer };

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const Toast = ({
  message,
  variant = "success",
  duration = 3000,
  onClose,
  onConfirm,
  onCancel,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Don't auto-close confirmation toasts
    if (variant === "confirm") return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, variant]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    setIsVisible(false);
    if (onConfirm) onConfirm();
    if (onClose) onClose();
  };

  const handleCancel = () => {
    setIsVisible(false);
    if (onCancel) onCancel();
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const variants = {
    success: {
      bgColor: "bg-green-50 border-green-200",
      textColor: "text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-100",
    },
    error: {
      bgColor: "bg-red-50 border-red-200",
      textColor: "text-red-800",
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      iconBg: "bg-red-100",
    },
    warning: {
      bgColor: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-800",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      iconBg: "bg-yellow-100",
    },
    info: {
      bgColor: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100",
    },
    delete: {
      bgColor: "bg-red-50 border-red-200",
      textColor: "text-red-800",
      icon: <CheckCircle className="w-5 h-5 text-red-600" />,
      iconBg: "bg-red-100",
    },
    confirm: {
      bgColor: "bg-orange-50 border-orange-200",
      textColor: "text-orange-800",
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      iconBg: "bg-orange-100",
    },
  };

  const currentVariant = variants[variant] || variants.success;

  return (
    <div
      className={`fixed top-4 right-4 max-w-md w-full ${currentVariant.bgColor} border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-top-2`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`${currentVariant.iconBg} rounded-full p-1 flex-shrink-0`}
        >
          {currentVariant.icon}
        </div>
        <div
          className={`${currentVariant.textColor} flex-1 text-sm font-medium`}
        >
          {message}
        </div>
        {variant !== "confirm" && (
          <button
            onClick={handleClose}
            className={`${currentVariant.textColor} hover:opacity-70 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {variant === "confirm" && (
        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// Enhanced Toast Manager Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, variant = "success", duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, variant, duration };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration (except for confirm variant)
    if (variant !== "confirm") {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }
  };

  const showConfirmToast = (message, onConfirm, onCancel) => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      variant: "confirm",
      onConfirm,
      onCancel,
    };

    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, showConfirmToast, removeToast };
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
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
        />
      ))}
    </div>
  );
};
export { useToast, Toast, ToastContainer };
