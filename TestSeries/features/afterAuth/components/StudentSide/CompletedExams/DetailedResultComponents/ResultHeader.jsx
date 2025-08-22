import React from 'react';

export const ResultHeader = ({ examName, examId, resultData, theme }) => (
  <div className={`${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border-b sticky top-0 z-10 backdrop-blur-sm bg-opacity-95`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${theme === "dark" ? "bg-indigo-900" : "bg-indigo-100"} flex items-center justify-center mr-4`}>
              <svg className={`w-6 h-6 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {examName || "Exam Results"}
              </h1>
              <div className={`flex items-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}>
                <span>ID: {examId}</span>
                <span className="mx-2">•</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                  {resultData.status}
                </span>
                <span className="mx-2">•</span>
                <span>{new Date(resultData.resultDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);