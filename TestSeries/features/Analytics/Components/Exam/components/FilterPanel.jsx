import React from 'react';
import { Filter } from 'lucide-react';
import { useTheme } from '../../../../../hooks/useTheme';

export const FilterPanel = ({
  dateRange,
  setDateRange,
  scoreFilter,
  setScoreFilter,
  examFilter,
  setExamFilter,
  uniqueExams
}) => {
  
const {theme} = useTheme()
  return (
    <div className={`p-4 rounded-lg shadow-sm mb-6 transition-all duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-gray-900'
    }`}>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <span className={`text-sm font-medium ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Filters:
          </span>
        </div>
                 
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className={`px-3 py-1 border rounded-md text-sm transition-all duration-300 ${
            theme === 'light' 
              ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500' 
              : 'bg-gray-800 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400'
          }`}
        >
          <option value="all">All Time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
    
        <select
          value={scoreFilter}
          onChange={(e) => setScoreFilter(e.target.value)}
          className={`px-3 py-1 border rounded-md text-sm transition-all duration-300 ${
            theme === 'light' 
              ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500' 
              : 'bg-gray-800 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400'
          }`}
        >
          <option value="all">All Scores</option>
          <option value="positive">Positive Scores</option>
          <option value="zero">Zero Scores</option>
          <option value="negative">Negative Scores</option>
        </select>
    
        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          className={`px-3 py-1 border rounded-md text-sm transition-all duration-300 ${
            theme === 'light' 
              ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500' 
              : 'bg-gray-800 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400'
          }`}
        >
          <option value="all">All Exams</option>
          {uniqueExams.map(exam => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>
      </div>
    </div>
  );
};