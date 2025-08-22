import React from 'react'
import HeadingUtil from '../../../../utility/HeadingUtil'

const ExamSideBar = ({theme}) => {
  return (
    <div className={`
        w-[320px] min-w-[320px] border-r p-6 overflow-y-auto sticky top-0 h-screen
        transition-all duration-300
        ${theme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-950 border-gray-800'
        }
      `}>
        <div className="mb-8">
          <HeadingUtil 
            heading="Exam Security" 
            subHeading="Understand the measures enforced during your test"
          />
        </div>

        <div className="space-y-6 text-sm">
          {/* Non-Proctored Security */}
          <div className={`
            p-5 rounded-lg border transition-all duration-200
            ${theme === 'light'
              ? 'border-gray-200 bg-gray-50 hover:border-gray-300'
              : 'border-gray-800 bg-gray-900 hover:border-gray-700'
            }
          `}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-950'}
              `}>
                <svg className={`w-4 h-4 ${
                  theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className={`text-base font-semibold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Standard Security
              </h3>
            </div>
            <ul className={`space-y-2 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              <li className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'
                }`}></div>
                <span>Tab switching activity is monitored</span>
              </li>
              <li className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'
                }`}></div>
                <span>Print, save, and view source operations are blocked</span>
              </li>
              <li className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'
                }`}></div>
                <span>Developer tools and keyboard shortcuts disabled</span>
              </li>
              <li className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'
                }`}></div>
                <span>Page refresh and URL tampering monitored</span>
              </li>
              <li className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'
                }`}></div>
                <span>Focus loss and window minimizing tracked</span>
              </li>
            </ul>
          </div>

          {/* Proctored Security */}
          <div className={`
            p-5 rounded-lg border transition-all duration-200
            ${theme === 'light'
              ? 'border-red-200 bg-red-50 hover:border-red-300'
              : 'border-red-800 bg-red-950 hover:border-red-700'
            }
          `}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${theme === 'light' ? 'bg-red-100' : 'bg-red-900'}
              `}>
                <svg className={`w-4 h-4 ${
                  theme === 'light' ? 'text-red-600' : 'text-red-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className={`text-base font-semibold ${
                theme === 'light' ? 'text-red-900' : 'text-red-200'
              }`}>
                AI-Proctored Security
              </h3>
            </div>
            <ul className={`space-y-2 ${
              theme === 'light' ? 'text-red-800' : 'text-red-200'
            }`}>
              <li className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'light' ? 'bg-red-600' : 'bg-red-400'
                }`}></div>
                <span>All standard security rules apply</span>
              </li>
              <li className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'light' ? 'bg-red-600' : 'bg-red-400'
                }`}></div>
                <span>Continuous facial recognition monitoring</span>
              </li>
              <li className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'light' ? 'bg-red-600' : 'bg-red-400'
                }`}></div>
                <span>Multiple face detection prevents cheating</span>
              </li>
              <li className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'light' ? 'bg-red-600' : 'bg-red-400'
                }`}></div>
                <span>Proper lighting and isolation required</span>
              </li>
            </ul>
          </div>

          {/* Additional Info */}
          <div className={`
            p-4 rounded-lg border-l-4 ${
              theme === 'light'
                ? 'border-l-blue-500 bg-blue-50 border border-blue-200'
                : 'border-l-blue-400 bg-blue-950 border border-blue-800'
            }
          `}>
            <div className="flex items-start gap-3">
              <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                theme === 'light' ? 'text-blue-600' : 'text-blue-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className={`text-sm font-semibold mb-1 ${
                  theme === 'light' ? 'text-blue-900' : 'text-blue-200'
                }`}>
                  Important Notice
                </h4>
                <p className={`text-xs leading-relaxed ${
                  theme === 'light' ? 'text-blue-800' : 'text-blue-300'
                }`}>
                  AI-proctored exams require the desktop application and proper camera/microphone setup. 
                  Ensure you have adequate lighting and a quiet environment before starting.
                </p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className={`
            p-4 rounded-lg ${
              theme === 'light'
                ? 'bg-gray-50 border border-gray-200'
                : 'bg-gray-900 border border-gray-800'
            }
          `}>
            <h4 className={`text-sm font-semibold mb-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              System Requirements
            </h4>
            <ul className={`space-y-1 text-xs ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <li>• Stable internet connection</li>
              <li>• Updated web browser</li>
              <li>• Camera and microphone access (for proctored exams)</li>
              <li>• Desktop app installation (for AI proctoring)</li>
            </ul>
          </div>
        </div>
      </div>
  )
}

export default ExamSideBar