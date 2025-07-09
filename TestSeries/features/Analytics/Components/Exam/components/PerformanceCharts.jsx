import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../../../../hooks/useTheme';

export const PerformanceChart = ({ data }) => {
  const {theme} = useTheme()
  return (
    <div className={`p-6 rounded-lg shadow-sm transition-all duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-gray-900'
    }`}>
      <h3 className={`text-xl font-semibold mb-4 ${
        theme === 'light' ? 'text-gray-800' : 'text-gray-100'
      }`}>
        Performance Timeline
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'light' ? '#e5e7eb' : '#374151'}
          />
          <XAxis 
            dataKey="attempt" 
            tick={{ fill: theme === 'light' ? '#6b7280' : '#9ca3af' }}
            axisLine={{ stroke: theme === 'light' ? '#d1d5db' : '#4b5563' }}
          />
          <YAxis 
            tick={{ fill: theme === 'light' ? '#6b7280' : '#9ca3af' }}
            axisLine={{ stroke: theme === 'light' ? '#d1d5db' : '#4b5563' }}
          />
          <Tooltip 
            labelFormatter={(value) => `Attempt ${value}`}
            formatter={(value, name) => [value, 'Score']}
            contentStyle={{
              backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
              border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
              borderRadius: '6px',
              color: theme === 'light' ? '#111827' : '#f9fafb'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};