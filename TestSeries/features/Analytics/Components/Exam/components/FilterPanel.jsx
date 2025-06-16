import React from 'react';
import { Filter } from 'lucide-react';

export const FilterPanel = ({
  dateRange,
  setDateRange,
  scoreFilter,
  setScoreFilter,
  examFilter,
  setExamFilter,
  uniqueExams
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm"
        >
          <option value="all">All Time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>

        <select 
          value={scoreFilter} 
          onChange={(e) => setScoreFilter(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm"
        >
          <option value="all">All Scores</option>
          <option value="positive">Positive Scores</option>
          <option value="zero">Zero Scores</option>
          <option value="negative">Negative Scores</option>
        </select>

        <select 
          value={examFilter} 
          onChange={(e) => setExamFilter(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm"
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