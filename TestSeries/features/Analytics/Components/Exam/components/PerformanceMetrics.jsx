import React from 'react';

export const PerformanceMetrics = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Score Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-green-600">Positive Scores:</span>
            <span className="font-semibold">{analytics.positiveScores}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-600">Zero Scores:</span>
            <span className="font-semibold">{analytics.zeroScores}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600">Negative Scores:</span>
            <span className="font-semibold">{analytics.negativeScores}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Score Range</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Highest:</span>
            <span className="font-semibold text-green-600">{analytics.maxMarks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Lowest:</span>
            <span className="font-semibold text-red-600">{analytics.minMarks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Range:</span>
            <span className="font-semibold">{analytics.maxMarks - analytics.minMarks}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Success Rate</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Positive Rate:</span>
            <span className="font-semibold text-green-600">
              {((analytics.positiveScores / analytics.totalExams) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Zero Rate:</span>
            <span className="font-semibold text-yellow-600">
              {((analytics.zeroScores / analytics.totalExams) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
