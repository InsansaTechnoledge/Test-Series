import React from 'react'

const ChartContainer = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-indigo-600 mb-4">{title}</h3>
      {children}
    </div>
  );

export default ChartContainer
