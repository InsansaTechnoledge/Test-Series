import React from 'react'

const ErrorDisplay = ({ error }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <p className="text-red-600">{error}</p>
      </div>
    </div>
  );

export default ErrorDisplay
