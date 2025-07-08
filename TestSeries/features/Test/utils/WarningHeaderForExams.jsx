import React from 'react'

const WarningHeaderForExams = ({examViolations , theme , warningCount}) => {
  return (
    <div className={`fixed top-0 left-0 right-0 z-40 px-6 py-3 text-sm border-b shadow-sm ${
        theme === 'light' 
          ? 'bg-white border-red-200 text-red-700' 
          : 'bg-gray-950 border-red-800 text-red-300'
      }`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              theme === 'light' ? 'bg-red-500' : 'bg-red-400'
            }`}></div>
            <span className="font-medium">EXAM MODE ACTIVE</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              theme === 'light' 
                ? 'bg-red-50 text-red-600' 
                : 'bg-red-900/30 text-red-400'
            }`}>
              Evalvo Security Monitoring
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-75">Violations:</span>
              <span className={`font-mono font-semibold px-2 py-1 rounded text-xs ${
                examViolations.length > 0
                  ? theme === 'light' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-red-900/40 text-red-300'
                  : theme === 'light'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-gray-800 text-gray-400'
              }`}>
                {examViolations.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-75">Warnings:</span>
              <span className={`font-mono font-semibold px-2 py-1 rounded text-xs ${
                warningCount >= 3
                  ? theme === 'light' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-red-900/40 text-red-300'
                  : theme === 'light'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-gray-800 text-gray-400'
              }`}>
                {warningCount}/5
              </span>
            </div>
            {warningCount >= 3 && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold animate-pulse ${
                theme === 'light' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-red-600 text-white'
              }`}>
                <span className="text-xs">⚠️</span>
                <span>HIGH ALERT</span>
              </div>
            )}
          </div>
        </div>
      </div>
  )
}

export default WarningHeaderForExams
