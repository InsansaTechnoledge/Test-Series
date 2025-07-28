import React, { createContext, useContext, useState } from 'react';

// Define the context
const DockContext = createContext(null);

// The DockProvider component that will wrap the app and provide the context values
export const DockProvider = ({ children }) => {
  const [isDockToggled, setDockIsToggled] = useState(false);

  // Function to toggle the dock state
  const toggleDock = () => {
    setDockIsToggled(prevState => !prevState);
  };

  return (
    <DockContext.Provider value={{ isDockToggled, toggleDock }}>
      {children}
    </DockContext.Provider>
  );
};

// Custom hook to use the DockContext
export const useDock = () => {
  const context = useContext(DockContext);
  
  if (!context) {
    throw new Error('useDock must be used within a DockProvider');
  }

  return context;
};
