import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Function to get system preference
  const getSystemPreference = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // fallback if no matchMedia
  };

  // Function to get initial theme
  const getInitialTheme = () => {
    // Check localStorage first
    // if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
    // }
    // Fall back to system preference
    return getSystemPreference();
  };

    const [theme, setTheme] = useState(getInitialTheme());

    useEffect(() => {
    // Initialize theme on mount
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
  }, []);

  // Save to localStorage whenever theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e) => {
        // Only update if no preference is saved in localStorage
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addListener(handleSystemThemeChange);
      return () => mediaQuery.removeListener(handleSystemThemeChange);
    }
  }, []);

  const handleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Optional: Reset to system preference
  const resetToSystemPreference = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('theme');
      setTheme(getSystemPreference());
    }
  };

  const value = {
    theme,
    handleTheme,
    resetToSystemPreference,
    isSystemDark: getSystemPreference() === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
