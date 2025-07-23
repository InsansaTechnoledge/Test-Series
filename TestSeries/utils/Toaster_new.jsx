import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// Toast Component
const Toast = ({ id, message, variant = "success", duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (variant === "confirm") return;
        const timer = setTimeout(() => {
            setVisible(false);
            onClose?.(id);
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, variant, id, onClose]);

    if (!visible) return null;

    const styles = {
        success: {
            bg: "bg-green-50 border-green-200",
            color: "text-green-800",
            icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        },
        error: {
            bg: "bg-red-50 border-red-200",
            color: "text-red-800",
            icon: <XCircle className="w-5 h-5 text-red-600" />,
        },
        warning: {
            bg: "bg-yellow-50 border-yellow-200",
            color: "text-yellow-800",
            icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
        },
        info: {
            bg: "bg-blue-50 border-blue-200",
            color: "text-blue-800",
            icon: <Info className="w-5 h-5 text-blue-600" />,
        },
    }[variant] || styles.success;

    return (
        <div className={`fixed top-4 right-4 z-[9999] shadow-lg border rounded-lg p-4 max-w-sm w-full ${styles.bg}`}>
            <div className="flex items-center gap-2">
                <div className="p-1 bg-opacity-10 rounded-full">{styles.icon}</div>
                <div className={`flex-1 text-sm font-medium ${styles.color}`}>{message}</div>
                <button onClick={() => onClose?.(id)}>
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Toast Context
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast_new = (message, variant = "success", duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, variant, duration }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast_new }}>
            {children}
            <div className="fixed top-4 right-4 space-y-2 z-[9999]">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast_new = () => useContext(ToastContext);
