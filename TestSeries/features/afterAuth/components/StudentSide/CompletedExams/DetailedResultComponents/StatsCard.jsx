import React from 'react';

export const StatsCards = ({ scoredMarks, totalMarks, percentage, rank, totalQuestions, theme }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard
      title="Score"
      value={`${scoredMarks}/${totalMarks}`}
      icon="bar-chart"
      color={scoredMarks >= 0 ? "indigo" : "red"}
      theme={theme}
    />
    <StatCard
      title="Percentage"
      value={`${percentage}%`}
      icon="chart"
      color={percentage >= 33 ? "blue" : "red"}
      theme={theme}
    />
    <StatCard
      title="Rank"
      value={`#${rank}`}
      icon="trending-up"
      color="purple"
      theme={theme}
    />
    <StatCard
      title="Questions"
      value={totalQuestions}
      icon="document"
      color="orange"
      theme={theme}
    />
  </div>
);

const StatCard = ({ title, value, icon, color, theme }) => {
  const getIconSvg = (iconName) => {
    const icons = {
      'bar-chart': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
      'chart': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      'trending-up': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
      'document': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    };
    return icons[iconName];
  };

  const getColorClasses = (color, theme) => {
    const colors = {
      indigo: theme === "dark" ? "bg-indigo-900 text-indigo-400" : "bg-indigo-100 text-indigo-600",
      blue: theme === "dark" ? "bg-blue-900 text-blue-400" : "bg-blue-100 text-blue-600",
      purple: theme === "dark" ? "bg-purple-900 text-purple-400" : "bg-purple-100 text-purple-600",
      orange: theme === "dark" ? "bg-orange-900 text-orange-400" : "bg-orange-100 text-orange-600",
      red: theme === "dark" ? "bg-red-900 text-red-400" : "bg-red-100 text-red-600"
    };
    return colors[color];
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getColorClasses(color, theme)} flex items-center justify-center`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {getIconSvg(icon)}
          </svg>
        </div>
        <div className="ml-4">
          <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};