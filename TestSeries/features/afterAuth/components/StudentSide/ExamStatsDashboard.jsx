import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, ListChecks, AlertTriangle, Award, X, FileText } from 'lucide-react';

// Main component that combines all statistics
export default function ExamStatsDashboard() {
  // Sample data - replace with your actual data
  const statsData = {
    overallRank: 42,
    highestRank: 12,
    lowestRank: 87,
    attemptedExams: 15,
    unattemptedExams: 3,
    disqualifiedExams: 1,
    totalExams: 19
  };

  const rankingHistory = [
    { name: 'Jan', rank: 65 },
    { name: 'Feb', rank: 50 },
    { name: 'Mar', rank: 43 },
    { name: 'Apr', rank: 47 },
    { name: 'May', rank: 42 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 rounded-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Exam Performance Dashboard</h1>
      
      {/* Main stats row */}
      <div className="flex flex-wrap gap-4">
        <StatCard 
          title="Overall Rank" 
          value={statsData.overallRank} 
          icon={<Award />} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Highest Rank" 
          value={statsData.highestRank} 
          icon={<TrendingUp />} 
          color="bg-green-500"
        />
        <StatCard 
          title="Lowest Rank" 
          value={statsData.lowestRank} 
          icon={<TrendingDown />} 
          color="bg-red-500"
        />
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Ranking History</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rankingHistory}>
              <XAxis dataKey="name" />
              <YAxis reversed domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="rank" fill="#3b82f6" name="Rank" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">Lower values indicate better ranks</div>
      </div>

      {/* Exam status row */}
      <div className="flex flex-wrap gap-4">
        <StatCard 
          title="Attempted Exams" 
          value={statsData.attemptedExams} 
          icon={<ListChecks />} 
          color="bg-indigo-500"
        />
        <StatCard 
          title="Unattempted Exams" 
          value={statsData.unattemptedExams} 
          icon={<FileText />} 
          color="bg-yellow-500"
        />
        <StatCard 
          title="Disqualified Exams" 
          value={statsData.disqualifiedExams} 
          icon={<X />} 
          color="bg-gray-500"
        />
        <StatCard 
          title="Total Exams" 
          value={statsData.totalExams} 
          icon={<AlertTriangle />} 
          color="bg-purple-500"
        />
      </div>

      {/* Breakdown by category - can be expanded with more details */}
      <ExamBreakdown data={statsData} />
    </div>
  );
}

// Individual statistic card component
function StatCard({ title, value, icon, color }) {
  return (
    <div className="flex-1 bg-white rounded-lg shadow p-4 min-w-32">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-full ${color} text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

// Component for showing exam breakdown
function ExamBreakdown({ data }) {
  const examData = [
    { name: 'Attempted', value: data.attemptedExams, color: '#818cf8' },
    { name: 'Unattempted', value: data.unattemptedExams, color: '#fbbf24' },
    { name: 'Disqualified', value: data.disqualifiedExams, color: '#9ca3af' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Exam Status Breakdown</h2>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-full bg-gray-200 rounded-full overflow-hidden h-2.5">
          {examData.map((item, index) => (
            <div 
              key={index}
              style={{ 
                width: `${(item.value / data.totalExams) * 100}%`,
                backgroundColor: item.color 
              }}
              className="h-2.5 float-left"
            ></div>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        {examData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Individual components below - can be used separately

// Just the rank component
export function RankDisplay({ overallRank, highestRank, lowestRank }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Ranking Information</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="p-2 rounded-full bg-blue-500 text-white mx-auto w-10 h-10 flex items-center justify-center mb-2">
            <Award size={20} />
          </div>
          <p className="text-sm text-gray-600">Overall Rank</p>
          <p className="text-2xl font-bold">{overallRank}</p>
        </div>
        <div className="text-center">
          <div className="p-2 rounded-full bg-green-500 text-white mx-auto w-10 h-10 flex items-center justify-center mb-2">
            <TrendingUp size={20} />
          </div>
          <p className="text-sm text-gray-600">Highest Rank</p>
          <p className="text-2xl font-bold">{highestRank}</p>
        </div>
        <div className="text-center">
          <div className="p-2 rounded-full bg-red-500 text-white mx-auto w-10 h-10 flex items-center justify-center mb-2">
            <TrendingDown size={20} />
          </div>
          <p className="text-sm text-gray-600">Lowest Rank</p>
          <p className="text-2xl font-bold">{lowestRank}</p>
        </div>
      </div>
    </div>
  );
}

// Just the exam counts component
export function ExamCountsDisplay({ attempted, unattempted, disqualified, total }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Exam Statistics</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="text-center">
          <div className="p-2 rounded-full bg-indigo-500 text-white mx-auto w-10 h-10 flex items-center justify-center mb-2">
            <ListChecks size={20} />
          </div>
          <p className="text-sm text-gray-600">Attempted</p>
          <p className="text-2xl font-bold">{attempted}</p>
        </div>
        <div className="text-center">
          <div className="p-2 rounded-full bg-yellow-500 text-white mx-auto w-10 h-10 flex items-center justify-center mb-2">
            <FileText size={20} />
          </div>
          <p className="text-sm text-gray-600">Unattempted</p>
          <p className="text-2xl font-bold">{unattempted}</p>
        </div>
        <div className="text-center">
          <div className="p-2 rounded-full bg-gray-500 text-white mx-auto w-10 h-10 flex items-center justify-center mb-2">
            <X size={20} />
          </div>
          <p className="text-sm text-gray-600">Disqualified</p>
          <p className="text-2xl font-bold">{disqualified}</p>
        </div>
        <div className="text-center">
          <div className="p-2 rounded-full bg-purple-500 text-white mx-auto w-10 h-10 flex items-center justify-center mb-2">
            <AlertTriangle size={20} />
          </div>
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
      </div>
    </div>
  );
}

// Mini card (even more lightweight)
export function MiniStatCard({ label, value, color = "bg-blue-500" }) {
  return (
    <div className="bg-white p-3 rounded shadow flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`px-2 py-1 rounded text-white font-medium ${color}`}>{value}</span>
    </div>
  );
}