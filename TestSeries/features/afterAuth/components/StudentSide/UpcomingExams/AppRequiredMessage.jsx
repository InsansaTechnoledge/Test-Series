import React from 'react';
import { useTheme } from '../../../../../hooks/useTheme';

const AppRequiredMessage = ({ isElectronEnv }) => {
  if (isElectronEnv) return null;

  const { theme } = useTheme();
  
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '16px',
        backgroundColor: isDark ? '#1f2937' : '#4f46e5', // gray-800 dark, indigo-600 light
        color: isDark ? '#e5e7eb' : '#ffffff', // gray-200 dark, white light
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        zIndex: 999,
        boxShadow: isDark 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: isDark ? '1px solid #374151' : 'none', // gray-700 border in dark mode
        minWidth: '220px',
        maxWidth: '280px',
        textAlign: 'center',
        lineHeight: '1.4',
        cursor: 'default',
        userSelect: 'none',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      Desktop app required for AI-proctored exams
    </div>
  );
};

export default AppRequiredMessage;