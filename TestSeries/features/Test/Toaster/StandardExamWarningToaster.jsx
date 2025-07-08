import React from 'react'

const ExamToaster = ({ toasts, onDismiss, theme }) => {
    if (!toasts || toasts.length === 0) return null;
  
    return (
      <div className="fixed top-20 right-4 z-50 space-y-3 max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg border transition-all duration-300 transform backdrop-blur-sm ${
              toast.type === 'warning' 
                ? theme === 'light'
                  ? 'bg-white/95 border-amber-200 text-amber-800 shadow-amber-100'
                  : 'bg-gray-950/95 border-amber-800 text-amber-300 shadow-amber-900/20'
                : toast.type === 'error'
                ? theme === 'light'
                  ? 'bg-white/95 border-red-200 text-red-800 shadow-red-100'
                  : 'bg-gray-950/95 border-red-800 text-red-300 shadow-red-900/20'
                : theme === 'light'
                  ? 'bg-white/95 border-indigo-200 text-indigo-800 shadow-indigo-100'
                  : 'bg-gray-950/95 border-indigo-800 text-indigo-300 shadow-indigo-900/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-3 ${
                    toast.type === 'warning' 
                      ? theme === 'light' ? 'bg-amber-500' : 'bg-amber-400'
                      : toast.type === 'error'
                      ? theme === 'light' ? 'bg-red-500' : 'bg-red-400'
                      : theme === 'light' ? 'bg-indigo-500' : 'bg-indigo-400'
                  }`}></span>
                  <h4 className="font-semibold text-sm">
                    {toast.type === 'warning' ? 'Security Warning' : 
                     toast.type === 'error' ? 'Security Violation' : 'Security Notice'}
                  </h4>
                </div>
                <p className="text-sm mt-2 leading-relaxed">{toast.message}</p>
                {toast.details && (
                  <p className={`text-xs mt-2 px-3 py-1 rounded-full inline-block ${
                    theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {toast.details}
                  </p>
                )}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className={`ml-4 p-1 rounded-full transition-colors ${
                  theme === 'light' 
                    ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

export default ExamToaster