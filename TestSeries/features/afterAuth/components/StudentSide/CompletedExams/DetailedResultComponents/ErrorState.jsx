import React from 'react';

export const ErrorState = ({ error, theme }) => (
  <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
    <div className={`max-w-md w-full mx-4 p-6 rounded-2xl shadow-xl ${theme === "dark" ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"}`}>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>
          Error Loading Results
        </h3>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {error}
        </p>
      </div>
    </div>
  </div>
);