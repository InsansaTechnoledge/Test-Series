import React from 'react';
import { useTheme } from '../../../../../hooks/useTheme';

export const PerformanceMetrics = ({ analytics }) => {
  const {theme} = useTheme()
  return (
   
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div className={`p-4 rounded-lg shadow-sm transition-all duration-300 ${
    theme === 'light' ? 'bg-white' : 'bg-gray-900'
  }`}>
    <h3 className={`text-lg font-semibold mb-2 ${
      theme === 'light' ? 'text-gray-800' : 'text-gray-100'
    }`}>
      Score Breakdown
    </h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-green-600">Positive Scores:</span>
        <span className={`font-semibold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {analytics.positiveScores}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-yellow-600">Zero Scores:</span>
        <span className={`font-semibold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {analytics.zeroScores}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-red-600">Negative Scores:</span>
        <span className={`font-semibold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {analytics.negativeScores}
        </span>
      </div>
    </div>
  </div>

  <div className={`p-4 rounded-lg shadow-sm transition-all duration-300 ${
    theme === 'light' ? 'bg-white' : 'bg-gray-900'
  }`}>
    <h3 className={`text-lg font-semibold mb-2 ${
      theme === 'light' ? 'text-gray-800' : 'text-gray-100'
    }`}>
      Score Range
    </h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className={`${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Highest:
        </span>
        <span className="font-semibold text-green-600">{analytics.maxMarks}</span>
      </div>
      <div className="flex justify-between">
        <span className={`${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Lowest:
        </span>
        <span className="font-semibold text-red-600">{analytics.minMarks}</span>
      </div>
      <div className="flex justify-between">
        <span className={`${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Range:
        </span>
        <span className={`font-semibold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {analytics.maxMarks - analytics.minMarks}
        </span>
      </div>
    </div>
  </div>

  <div className={`p-4 rounded-lg shadow-sm transition-all duration-300 ${
    theme === 'light' ? 'bg-white' : 'bg-gray-900'
  }`}>
    <h3 className={`text-lg font-semibold mb-2 ${
      theme === 'light' ? 'text-gray-800' : 'text-gray-100'
    }`}>
      Success Rate
    </h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className={`${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Positive Rate:
        </span>
        <span className="font-semibold text-green-600">
          {((analytics.positiveScores / analytics.totalExams) * 100).toFixed(1)}%
        </span>
      </div>
      <div className="flex justify-between">
        <span className={`${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Zero Rate:
        </span>
        <span className="font-semibold text-yellow-600">
          {((analytics.zeroScores / analytics.totalExams) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  </div>
</div>
  );
};
