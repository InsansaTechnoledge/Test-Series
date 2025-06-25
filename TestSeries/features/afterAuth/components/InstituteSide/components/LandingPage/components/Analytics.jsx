import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const COLORS = [
    '#4f46e5',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#7c3aed',
    '#6d28d9',
    '#3b82f6',
    '#818cf8',
  ];

const Analytics = ({ theme , batches , examBatchAnalytics}) => {
const batchData = batches?.map((batch,index) => {
    const totalExams = examBatchAnalytics.filter(item => item.batch_id === batch.id).reduce((Sum,item) => Sum + item.exams , 0);

    return {
        name: batch.name,
        exams: totalExams,
        color: COLORS[index % COLORS.length]
    }
})
  const isDark = theme === 'dark';

  const chartTextColor = isDark ? '#e2e8f0' : '#64748b';     // slate-200 or slate-500
  const chartGridColor = isDark ? '#334155' : '#f1f5f9';     // dark slate or light slate
  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',         // dark slate or white
    border: `1px solid ${isDark ? '#475569' : '#e5e7eb'}`,   // slate-600 or gray-200
    color: isDark ? '#f8fafc' : '#1e293b'                    // light text or dark text
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Exam Trends */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-indigo-100' : 'text-gray-800'} mb-4`}>
          Exam & Student Trends
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={examBatchAnalytics}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
            <XAxis dataKey="month" stroke={chartTextColor} />
            <YAxis stroke={chartTextColor} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="exams" stroke="#4f46e5" strokeWidth={3} />
            <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Batch Distribution */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'} mb-4`}>
          Exam Distribution by Batch
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={batchData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              dataKey="exams"
            >
              {batchData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 mt-4">
          {batchData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
