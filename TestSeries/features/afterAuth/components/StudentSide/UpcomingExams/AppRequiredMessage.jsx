import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../../../hooks/useTheme';

const AppRequiredMessage = ({ isElectronEnv }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const {theme} = useTheme();
  
  if (isElectronEnv || !isVisible) return null;

  const isDark = theme === 'dark';

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: isDark ? '#030712' : '#ffffff', // gray-950 dark, white light
        color: isDark ? '#9ca3af' : '#374151', // gray-400 dark, gray-700 light
        padding: '20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 1000,
        boxShadow: isDark 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: isDark ? '1px solid #374151' : '1px solid #d1d5db', // gray-700 dark, gray-300 light
        minWidth: '320px',
        maxWidth: '400px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        animation: 'slideIn 0.2s ease-out',
      }}
    >
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      {/* Warning Icon */}
      <div
        style={{
          backgroundColor: isDark ? '#4338ca' : '#4f46e5', // indigo-600 both themes
          color: isDark ? '#030712' : '#ffffff', // gray-950 dark, white light
          padding: '8px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <AlertTriangle size={16} />
      </div>

      {/* Message Content */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: '600',
            marginBottom: '6px',
            color: isDark ? '#f3f4f6' : '#111827', // gray-100 dark, gray-900 light
            fontSize: '15px',
          }}
        >
          Desktop App Required
        </div>
        <div
          style={{
            fontSize: '13px',
            lineHeight: '1.5',
            color: isDark ? '#9ca3af' : '#6b7280', // gray-400 dark, gray-500 light
          }}
        >
          AI-proctored exams require the desktop application to function properly.
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: isDark ? '#6b7280' : '#9ca3af', // gray-500 dark, gray-400 light
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.color = isDark ? '#f3f4f6' : '#374151'; // gray-100 dark, gray-700 light
        }}
        onMouseLeave={(e) => {
          e.target.style.color = isDark ? '#6b7280' : '#9ca3af';
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default AppRequiredMessage;