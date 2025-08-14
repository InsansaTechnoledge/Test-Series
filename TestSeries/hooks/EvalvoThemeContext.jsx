import React, { createContext, useContext, useState } from 'react';

// Create Context
const EvalvoThemeContext = createContext();

// Provider Component
export const EvalvoThemeProvider = ({ children }) => {
  const [evalvoTheme, setEvalvoTheme] = useState('EvalvoGrid'); // default value

  const toggleEvalvoTheme = () => {
    setEvalvoTheme((prev) => (prev === 'EvalvoGrid' ? 'EvalvoPulse' : 'EvalvoGrid'));
  };

  return (
    <EvalvoThemeContext.Provider value={{ evalvoTheme, setEvalvoTheme, toggleEvalvoTheme }}>
      {children}
    </EvalvoThemeContext.Provider>
  );
};

// Custom Hook for easy use
export const useEvalvoTheme = () => useContext(EvalvoThemeContext);
