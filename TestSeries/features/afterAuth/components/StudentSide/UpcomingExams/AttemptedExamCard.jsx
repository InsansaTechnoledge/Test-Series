import React from 'react'
import ExamBadge from './ExamBadge'
import HeadingUtil from '../../../utility/HeadingUtil'

const AttemptedExamCard = ({attemptedExams , currentExamId , proctorStatus , isAiProctored , isElectronEnv , theme , handleNavigateToResult , canStartExam , getStartButtonConfig}) => {
  return (
    <section className="mb-20 mt-12 border-gray-200 border-2 py-4 px-4 rounded-4xl">
      <div className="mb-12">
        <HeadingUtil 
          heading="Attempted Exams" 
          subHeading="View results and performance for completed exams"
        />
      </div>
      
      <div className="space-y-8">
        {attemptedExams && attemptedExams.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {attemptedExams.map((exam, idx) => (
              <div
                key={idx}
                className={`
                  relative overflow-hidden rounded-xl border transition-all duration-300
                  hover:shadow-lg hover:-translate-y-1 group cursor-pointer
                  ${theme === 'light' 
                    ? 'bg-white border-gray-200 hover:border-indigo-600 hover:shadow-indigo-600/10' 
                    : 'bg-gray-950 border-gray-800 hover:border-indigo-400 hover:shadow-indigo-400/10'
                  }
                  ${(proctorStatus === 'starting' && currentExamId !== exam.id) ? 'opacity-50' : 'opacity-100'}
                `}
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                {/* Top Border Accent */}
                <div className={`h-1 w-full ${
                  theme === 'light' ? 'bg-green-600' : 'bg-green-400'
                }`}></div>
                
                {/* Completed Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                    theme === 'light' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-400 text-gray-950'
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Completed
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <ExamBadge exam={exam} theme={theme} isAiProctored={isAiProctored} isElectronEnv={isElectronEnv} />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className={`text-xl font-semibold mb-2 line-clamp-2 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {exam.name || 'Untitled Exam'}
                    </h3>
                  </div>

                  {/* Exam Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-950'
                        }`}>
                          <svg className={`w-3 h-3 ${
                            theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className={`text-sm font-medium ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                        }`}>
                          Duration
                        </span>
                      </div>
                      <span className={`text-sm font-semibold ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {exam.duration || 'N/A'} min
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-950'
                        }`}>
                          <svg className={`w-3 h-3 ${
                            theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className={`text-sm font-medium ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                        }`}>
                          Total Marks
                        </span>
                      </div>
                      <span className={`text-sm font-semibold ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {exam.total_marks || 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          theme === 'light' ? 'bg-green-50' : 'bg-green-950'
                        }`}>
                          <svg className={`w-3 h-3 ${
                            theme === 'light' ? 'text-green-600' : 'text-green-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <span className={`text-sm font-medium ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                        }`}>
                          Status
                        </span>
                      </div>
                      <span className={`text-sm font-semibold ${
                        theme === 'light' ? 'text-green-600' : 'text-green-400'
                      }`}>
                        Attempted
                      </span>
                    </div>

                    {/* Divider */}
                    <div className={`border-t ${
                      theme === 'light' ? 'border-gray-100' : 'border-gray-800'
                    }`}></div>
                  </div>

                  <button
                    onClick={() => handleNavigateToResult(exam.id)}
                    disabled={!canStartExam(exam) || (exam.hasAttempted === true && exam.reapplicable === false)}
                    className={`
                      w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${!canStartExam(exam) || exam.hasAttempted
                        ? `cursor-default ${
                            theme === 'light' 
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500' 
                              : 'bg-indigo-400 hover:bg-indigo-300 text-gray-950 focus:ring-indigo-400'
                          }`
                        : `${
                            theme === 'light' 
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500' 
                              : 'bg-indigo-400 hover:bg-indigo-300 text-gray-950 focus:ring-indigo-400'
                          }`
                      }
                    `}
                  >
                    View Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`
            text-center py-16 px-8 rounded-xl border-2 border-dashed
            ${theme === 'light' 
              ? 'border-gray-200 bg-gray-50' 
              : 'border-gray-700 bg-gray-900'
            }
          `}>
            <div className="mb-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-green-50' : 'bg-green-950'
              }`}>
                <svg className={`w-8 h-8 ${
                  theme === 'light' ? 'text-green-600' : 'text-green-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              No Attempted Exams
            </h3>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              You haven't attempted any exams yet. Complete exams to view your results here.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default AttemptedExamCard