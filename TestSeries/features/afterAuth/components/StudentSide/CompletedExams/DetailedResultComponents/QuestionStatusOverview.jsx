import React from 'react';

export const QuestionStatusOverview = ({ correctCount, incorrectCount, unansweredCount, descriptiveCount, theme }) => (
  <div className={`${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} rounded-2xl border p-6 mb-8 shadow-sm`}>
    <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-4`}>
      Question Status Overview
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <StatusItem
        color="green"
        label="Correct"
        count={correctCount}
        theme={theme}
      />
      <StatusItem
        color="red"
        label="Incorrect"
        count={incorrectCount}
        theme={theme}
      />
      <StatusItem
        color="gray"
        label="Unanswered"
        count={unansweredCount}
        theme={theme}
      />
      <StatusItem
        color="blue"
        label="Descriptive"
        count={descriptiveCount}
        theme={theme}
      />
    </div>
  </div>
);

const StatusItem = ({ color, label, count, theme }) => (
  <div className="flex items-center">
    <div className={`w-4 h-4 rounded-full bg-${color}-500 mr-3`}></div>
    <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
      {label}: {count}
    </span>
  </div>
);