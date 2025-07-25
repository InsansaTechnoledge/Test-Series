import React from 'react'

const StatsCard = ({ title, value, color = "indigo" }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-600`}>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-indigo-600">{value}</p>
    </div>
);

export default StatsCard
