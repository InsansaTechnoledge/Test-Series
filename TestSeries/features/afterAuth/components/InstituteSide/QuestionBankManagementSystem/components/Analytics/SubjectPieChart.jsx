import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const ChartContainer = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-indigo-600 mb-4">{title}</h3>
    {children}
  </div>
);

const SubjectDistributionChart = ({ data = [] }) => {
  const [viewMode, setViewMode] = useState('pie');
  const [showTopN, setShowTopN] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const subjectData = useMemo(() => {
    if (!data || data.length === 0) return { all: [], filtered: [], top: [], others: 0 };
    
    const counts = {};
    data.forEach(q => {
      const subject = q.subject || 'Unknown';
      counts[subject] = (counts[subject] || 0) + 1;
    });
    
    const allSubjects = Object.entries(counts)
      .map(([subject, count]) => ({ 
        subject, 
        count, 
        percentage: ((count / data.length) * 100).toFixed(1) 
      }))
      .sort((a, b) => b.count - a.count);
    
    // Filter by search term
    const filtered = searchTerm 
      ? allSubjects.filter(item => 
          item.subject.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allSubjects;
    
    return {
      all: allSubjects,
      filtered: filtered,
      top: filtered.slice(0, showTopN),
      others: filtered.slice(showTopN).reduce((sum, item) => sum + item.count, 0)
    };
  }, [data, showTopN, searchTerm]);

  const chartData = useMemo(() => {
    const result = [...subjectData.top];
    if (subjectData.others > 0 && !searchTerm) {
      result.push({
        subject: `Others (${subjectData.filtered.length - showTopN} subjects)`,
        count: subjectData.others,
        percentage: ((subjectData.others / data.length) * 100).toFixed(1),
        isOthers: true
      });
    }
    return result;
  }, [subjectData, showTopN, searchTerm, data.length]);

  const COLORS = [
    '#4f46e5', '#7c3aed', '#059669', '#dc2626', '#ea580c',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f59e0b', '#ef4444',
    '#ec4899', '#10b981', '#f97316', '#3b82f6', '#eab308',
    '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.subject}</p>
          <p className="text-sm text-gray-600">Count: {data.count}</p>
          <p className="text-sm text-gray-600">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <ChartContainer title="Subject Distribution">
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title={`Subject Distribution (${data.length} total items)`}>
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">View:</label>
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="pie">Pie Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="table">Table View</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Show Top:</label>
          <select 
            value={showTopN} 
            onChange={(e) => setShowTopN(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter subjects..."
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Chart Display */}
      {viewMode === 'pie' && (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ subject, percentage }) => `${percentage}%`}
              outerRadius={120}
              fill="#4f46e5"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isOthers ? '#9ca3af' : COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      )}

      {viewMode === 'bar' && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="subject" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
              fontSize={12}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#4f46e5">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isOthers ? '#9ca3af' : COLORS[index % COLORS.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjectData.filtered.map((item, index) => (
                <tr key={item.subject} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="ml-2 text-xs">{item.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-indigo-600">Total Subjects</div>
          <div className="text-2xl font-bold text-indigo-900">{subjectData.all.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">Showing</div>
          <div className="text-2xl font-bold text-green-900">
            {searchTerm ? subjectData.filtered.length : Math.min(showTopN, subjectData.all.length)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-600">Total Items</div>
          <div className="text-2xl font-bold text-purple-900">{data.length}</div>
        </div>
      </div>
    </ChartContainer>
  );
};

export default SubjectDistributionChart;