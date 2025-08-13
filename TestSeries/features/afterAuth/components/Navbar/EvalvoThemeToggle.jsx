import React from 'react';
import { LayoutGrid, Activity } from 'lucide-react';
import { useEvalvoTheme } from '../../../../hooks/EvalvoThemeContext';
import { useTheme } from '../../../../hooks/useTheme.jsx';

const EvalvoThemeToggle = () => {
  const { evalvoTheme, toggleEvalvoTheme } = useEvalvoTheme();
  const { theme } = useTheme();
  
  const isGridView = evalvoTheme === 'EvalvoGrid';
  
  return (
    <div className="flex items-center gap-2">
      {/* Icon and Label */}
      <div className="flex items-center gap-2">
        {isGridView ? (
          <Activity className={`w-3 h-3 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
        ) : (
          <LayoutGrid className={`w-3 h-3 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
        )}
        <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          {isGridView ? 'EvalvoPulse' : 'EvalvoGrid'}
        </span>
      </div>
      
      {/* Toggle Switch */}
      <button
        onClick={toggleEvalvoTheme}
        className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
          isGridView 
            ? theme === 'light' ? 'bg-blue-600' : 'bg-blue-400'
            : theme === 'light' ? 'bg-purple-600' : 'bg-purple-400'
        }`}
        title={`Switch to ${isGridView ? 'EvalvoPulse' : 'EvalvoGrid'} View`}
      >
        <div
          className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            isGridView ? 'translate-x-5' : 'translate-x-0'
          } ${theme === 'light' ? 'bg-white' : 'bg-gray-950'}`}
        />
      </button>
    </div>
  );
};

export default EvalvoThemeToggle;