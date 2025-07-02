import { Moon, Sun } from 'lucide-react';
import React from 'react'

const EpicThemeSlider = ({ theme, onToggle }) => {
    return (
      <div className="flex items-center space-x-3">
        <Sun className={`w-4 h-4 transition-colors ${theme === 'light' ? 'text-orange-500' : 'text-gray-400'}`} />
        <div 
          className="relative cursor-pointer"
          onClick={onToggle}
        >
          <div className={`w-14 h-7 rounded-full transition-all duration-300 ease-in-out shadow-inner ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg' 
              : 'bg-gradient-to-r from-orange-400 to-yellow-500 shadow-lg'
          }`}>
            <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-all duration-300 ease-in-out transform shadow-lg ${
              theme === 'dark' 
                ? 'translate-x-7 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-400' 
                : 'translate-x-0 bg-gradient-to-br from-white to-orange-50 border-2 border-orange-300'
            }`}>
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-purple-400/20 to-indigo-400/20 animate-pulse' 
                  : 'bg-gradient-to-br from-yellow-300/30 to-orange-300/30 animate-pulse'
              }`} />
              {theme === 'dark' ? (
                <Moon className="w-3 h-3 text-indigo-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              ) : (
                <Sun className="w-3 h-3 text-orange-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          </div>
          <div className={`absolute -inset-1 rounded-full opacity-30 transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 blur-sm' 
              : 'bg-gradient-to-r from-orange-400 to-yellow-400 blur-sm'
          }`} />
        </div>
        <Moon className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-indigo-400' : 'text-gray-400'}`} />
      </div>
    );
  };

export default EpicThemeSlider
