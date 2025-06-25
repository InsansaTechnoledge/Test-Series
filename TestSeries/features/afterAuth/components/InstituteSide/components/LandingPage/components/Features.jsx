import React from 'react'
import { features } from './Data/Data'

const Features = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-sm border`}>
      <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-indigo-100' : 'text-indigo-600'}`}>
        Platform Features
      </h2>
      <div className="space-y-4">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}
          >
            <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              {idx + 1}
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              {feature}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
