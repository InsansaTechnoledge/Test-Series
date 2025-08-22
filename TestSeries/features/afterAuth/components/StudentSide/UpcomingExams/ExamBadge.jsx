import React from 'react'

const ExamBadge = ({ exam, theme , isAiProctored , isElectronEnv }) => {
    const isProctored = isAiProctored(exam);
         
    return (
      <div className="inline-flex items-center gap-2 mb-4">
        <span className={`
          inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wide
          transition-colors duration-200
          ${isProctored 
            ? theme === 'light'
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-red-950/50 text-red-400 border border-red-800/30'
            : theme === 'light'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-green-950/50 text-green-400 border border-green-800/30'
          }
        `}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            isProctored 
              ? theme === 'light' ? 'bg-red-500' : 'bg-red-400'
              : theme === 'light' ? 'bg-green-500' : 'bg-green-400'
          }`}></span>
          {isProctored ? 'AI-Proctored' : 'Standard'}
        </span>
                 
        {isProctored && !isElectronEnv && (
          <span className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wide
            transition-colors duration-200
            ${theme === 'light'
              ? 'bg-indigo-600 text-white border border-indigo-600'
              : 'bg-indigo-400 text-gray-950 border border-indigo-400'
            }
          `}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            App Required
          </span>
        )}
      </div>
    );
  };

export default ExamBadge