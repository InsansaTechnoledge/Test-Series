import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ChartContainer = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-indigo-600 mb-4">{title}</h3>
    {children}
  </div>
);

const ExamAnalysis = ({ data = [] }) => {
  const [viewMode, setViewMode] = useState('bar');
  const [showTopN, setShowTopN] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('count');

  const examData = useMemo(() => {
    if (!data || data.length === 0) return { all: [], filtered: [], top: [] };
    
    const counts = {};
    data.forEach(q => {
      const examId = q.exam_id || 'No Exam';
      const cleanExamId = examId === 'null' || examId === null ? 'No Exam' : examId;
      counts[cleanExamId] = (counts[cleanExamId] || 0) + 1;
    });
    
    const allExams = Object.entries(counts)
      .map(([exam_id, count]) => ({ 
        exam_id,
        display_name: exam_id === 'No Exam' ? 'No Exam' : 
                     exam_id.length > 12 ? `${exam_id.slice(0, 12)}...` : exam_id,
        full_name: exam_id,
        count,
        percentage: ((count / data.length) * 100).toFixed(1)
      }))
      .sort((a, b) => {
        if (sortBy === 'count') return b.count - a.count;
        if (sortBy === 'name') return a.exam_id.localeCompare(b.exam_id);
        return 0;
      });
    
    // Filter by search term
    const filtered = searchTerm 
      ? allExams.filter(item => 
          item.exam_id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allExams;
    
    return {
      all: allExams,
      filtered: filtered,
      top: filtered.slice(0, showTopN)
    };
  }, [data, showTopN, searchTerm, sortBy]);

  const COLORS = [
    '#7c3aed', '#4f46e5', '#059669', '#dc2626', '#ea580c',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f59e0b', '#ef4444',
    '#ec4899', '#10b981', '#f97316', '#3b82f6', '#eab308'
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-800 break-words">{data.full_name}</p>
          <p className="text-sm text-gray-600">Questions: {data.count}</p>
          <p className="text-sm text-gray-600">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <ChartContainer title="Questions per Exam">
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title={`Questions per Exam (${data.length} total questions)`}>
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">View:</label>
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
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
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="count">Question Count</option>
            <option value="name">Exam Name</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter exams..."
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Chart Display */}
      {viewMode === 'bar' && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={examData.top} 
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="display_name" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={10}
              interval={0}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]}>
              {examData.top.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {viewMode === 'pie' && (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={examData.top}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percentage }) => `${percentage}%`}
              outerRadius={120}
              fill="#7c3aed"
              dataKey="count"
            >
              {examData.top.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      )}

      {viewMode === 'table' && (
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {examData.filtered.map((item, index) => (
                <tr key={item.exam_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                    <div className="truncate" title={item.full_name}>
                      {item.full_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs">{item.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-600">Total Exams</div>
          <div className="text-2xl font-bold text-purple-900">{examData.all.length}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-600">Showing</div>
          <div className="text-2xl font-bold text-blue-900">
            {searchTerm ? examData.filtered.length : Math.min(showTopN, examData.all.length)}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">Total Questions</div>
          <div className="text-2xl font-bold text-green-900">{data.length}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-orange-600">Avg per Exam</div>
          <div className="text-2xl font-bold text-orange-900">
            {examData.all.length > 0 ? Math.round(data.length / examData.all.length) : 0}
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

export default ExamAnalysis;