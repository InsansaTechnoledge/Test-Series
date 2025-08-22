import React from 'react';

export const LoadingState = ({ theme }) => (
  <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
    <div className="text-center">
      <div className={`animate-spin rounded-full h-16 w-16 border-4 ${theme === "dark" ? "border-indigo-400 border-t-transparent" : "border-indigo-600 border-t-transparent"} mx-auto mb-4`}></div>
      <p className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
        Loading your results...
      </p>
    </div>
  </div>
);