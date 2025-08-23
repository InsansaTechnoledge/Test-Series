import HeadingUtil from '../../../utility/HeadingUtil';
import ExamBadge from './ExamBadge';

const LiveExamCard = ({ liveExams, proctorStatus , currentExamId , theme , handleStartTest , canStartExam , getStartButtonConfig , isAiProctored , isElectronEnv}) => {

    return (
        <section className="mb-20 border-gray-200 border-2 py-4 px-4 rounded-4xl">
        <div className="mb-12">
          <HeadingUtil 
            heading="Live Exams" 
            subHeading="Active exams available for immediate participation"
          />
        </div>
        
        <div className="space-y-8">
          {liveExams && liveExams.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {liveExams.map((exam, idx) => (
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
                    theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'
                  }`}></div>
                  
                  {/* Live Badge */}
                  {
                    exam.hasAttempted !== true && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          theme === 'light' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-indigo-400 text-gray-950'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                            theme === 'light' ? 'bg-white' : 'bg-gray-950'
                          }`}></span>
                          Live
                        </div>
                      </div>
                    )
                  }

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

                      {/* Divider */}
                      <div className={`border-t ${
                        theme === 'light' ? 'border-gray-100' : 'border-gray-800'
                      }`}></div>
                    </div>

                    <button
                      onClick={() => handleStartTest(exam.id || exam._id, exam.ai_proctored)}
                      disabled={!canStartExam(exam) || (exam.hasAttempted === true && exam.reapplicable === false)}
                      className={`
                        w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${!canStartExam(exam) || (exam.hasAttempted === true && exam.reapplicable === false)
                          ? `cursor-not-allowed opacity-50 ${
                              theme === 'light' 
                                ? 'bg-gray-100 text-gray-400 border border-gray-200' 
                                : 'bg-gray-800 text-gray-500 border border-gray-700'
                            }`
                          : `${
                              theme === 'light' 
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500' 
                                : 'bg-indigo-400 hover:bg-indigo-300 text-gray-950 focus:ring-indigo-400'
                            }`
                        }
                      `}
                    >
                      {getStartButtonConfig(exam).text}
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
                  theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-950'
                }`}>
                  <svg className={`w-8 h-8 ${
                    theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                No Live Exams Available
              </h3>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                There are currently no active exams. Check back later or view upcoming exams below.
              </p>
            </div>
          )}
        </div>
      </section>

    )
        };
   

export default LiveExamCard