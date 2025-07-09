import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../../../../../hooks/useTheme';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

export const ScoreDistributionChart = ({ data }) => {
  const {theme} = useTheme()
  return (
    <div className={`p-6 rounded-lg shadow-sm transition-all duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-gray-900'
    }`}>
      <h3 className={`text-xl font-semibold mb-4 ${
        theme === 'light' ? 'text-gray-800' : 'text-gray-100'
      }`}>
        Score Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ range, count, percent }) => `${range}: ${count} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
              border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
              borderRadius: '6px',
              color: theme === 'light' ? '#111827' : '#f9fafb'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};