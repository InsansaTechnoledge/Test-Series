import { ChevronRight } from "lucide-react";
import React from "react";

const NavigationBreadcrumb = ({ path, onNavigate, theme = "light" }) => (
  <nav className={`flex items-center space-x-2 text-sm mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
    {path.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && (
          <ChevronRight className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
        )}
        <button
          onClick={() => onNavigate(index)}
          className={`transition-colors duration-200 ${
            index === path.length - 1 
              ? theme === 'dark' 
                ? 'text-white font-medium' 
                : 'text-gray-900 font-medium'
              : theme === 'dark'
                ? 'hover:text-gray-100'
                : 'hover:text-gray-900'
          }`}
        >
          {item}
        </button>
      </React.Fragment>
    ))}
  </nav>
);

export default NavigationBreadcrumb;