import React from 'react'
import { useTheme } from '../../hooks/useTheme.jsx'


const ThemeToggleButton = () => {
    const { theme, handleTheme } = useTheme();
  
    return (
      <button onClick={handleTheme}>
        Toggle to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    );
  };
  
  export default ThemeToggleButton;