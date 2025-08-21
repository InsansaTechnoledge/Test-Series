import { ChevronRight } from "lucide-react";
import React from "react";

const NavigationBreadcrumb = ({ path, onNavigate }) => (
  <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
    {path.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && <ChevronRight className="w-4 h-4" />}
        <button
          onClick={() => onNavigate(index)}
          className={`hover:text-gray-900 ${
            index === path.length - 1 ? 'text-gray-900 font-medium' : ''
          }`}
        >
          {item}
        </button>
      </React.Fragment>
    ))}
  </nav>
);

export default NavigationBreadcrumb;
 