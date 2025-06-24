import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

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


const Analytics = ({ examBatchAnalytics, batches }) => {
  const batchData = batches.map((batch, index) => {
    const totalExams = examBatchAnalytics
      .filter(item => item.batch_id === batch.id)
      .reduce((sum, item) => sum + item.exams, 0);
  
    return {
      name: batch.name,
      exams: totalExams,
      color: COLORS[index % COLORS.length],
    };
  });
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Exam Trends */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Exam & Student Trends</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={examBatchAnalytics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b"  allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="exams" stroke="#4f46e5" strokeWidth={3} />
            <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Student Distribution by Batch */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">  Exam Distribution by Batch</h3>
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
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 mt-4">
          {batchData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

