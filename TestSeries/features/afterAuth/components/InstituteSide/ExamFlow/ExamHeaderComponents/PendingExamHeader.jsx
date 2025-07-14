import React from 'react'

const PendingExamHeader = ({theme , pendingExams}) => {
  return (
    <div className="mb-8 transform hover:scale-105 transition-all duration-300">
          {pendingExams.length === 0 ? (
            <div className={`backdrop-blur-md rounded-xl p-6 shadow-xl ${
              theme === 'light' 
                ? 'bg-white/50 border border-indigo-200' 
                : 'bg-gray-800/80 border border-gray-600'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/50'
                }`}>
                  <svg className={`w-6 h-6 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className={`font-semibold ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-300'}`}>
                  No pending exams found for this organization.
                </p>
              </div>
            </div>
          ) : (
            <div className={`backdrop-blur-md rounded-xl p-6 shadow-xl ${
              theme === 'light' 
                ? 'bg-white/50 border border-indigo-200' 
                : 'bg-gray-800/80 border border-gray-600'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/50'
                }`}>
                  <svg className={`w-6 h-6 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-indigo-900' : 'text-indigo-300'}`}>
                  You have these exams pending (complete or delete them)
                </h2>
              </div>
              <ul className="space-y-2">
                {pendingExams.map((exam, index) => (
                  <li key={exam?.id || index} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${theme === 'light' ? 'bg-indigo-500' : 'bg-indigo-400'}`}></div>
                    <span className={`font-medium ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-300'}`}>
                      {exam?.name || 'Unnamed Exam'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

  )
}

export default PendingExamHeader
