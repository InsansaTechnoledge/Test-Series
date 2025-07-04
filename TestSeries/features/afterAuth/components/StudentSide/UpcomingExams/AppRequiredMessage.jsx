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
        color: isDark ? '#a1a1aa' : '#374151', // zinc-400 dark, gray-700 light
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 1000,
        boxShadow: isDark 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: isDark ? '1px solid #27272a' : '1px solid #e5e7eb', // zinc-800 dark, gray-200 light
        minWidth: '300px',
        maxWidth: '400px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        animation: 'slideIn 0.3s ease-out',
        transition: 'all 0.2s ease-in-out',
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
          backgroundColor: isDark ? '#422006' : '#fef3c7', // amber-900/20 dark, amber-100 light
          color: isDark ? '#fbbf24' : '#d97706', // amber-400 dark, amber-600 light
          padding: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        <AlertTriangle size={16} />
      </div>

      {/* Message Content */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: '600',
            marginBottom: '4px',
            color: isDark ? '#e4e4e7' : '#111827', // zinc-200 dark, gray-900 light
          }}
        >
          Desktop App Required
        </div>
        <div
          style={{
            fontSize: '13px',
            lineHeight: '1.4',
            color: isDark ? '#a1a1aa' : '#6b7280', // zinc-400 dark, gray-500 light
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
          color: isDark ? '#71717a' : '#9ca3af', // zinc-500 dark, gray-400 light
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = isDark ? '#18181b' : '#f3f4f6'; // zinc-900 dark, gray-100 light
          e.target.style.color = isDark ? '#e4e4e7' : '#374151'; // zinc-200 dark, gray-700 light
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = isDark ? '#71717a' : '#9ca3af';
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default AppRequiredMessage;