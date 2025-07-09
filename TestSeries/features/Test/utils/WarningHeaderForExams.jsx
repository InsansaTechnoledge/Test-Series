import React, { useState, useEffect } from 'react'

const WarningHeaderForExams = ({examViolations, theme , warningCount = 0}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      }
    } catch (error) {
      console.error('Error in fullscreen:', error)
    }
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 px-6 py-8 text-sm border-b shadow-sm ${
        theme === 'light' 
          ? 'bg-white border-red-200 text-red-700' 
          : 'bg-gray-900 border-red-800 text-red-300'
      }`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              theme === 'light' ? 'bg-red-500' : 'bg-red-400'
            }`}></div>
            <span className="font-medium">STANDARD EXAM SECURITY </span>
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
            <button
              onClick={toggleFullscreen}
              className={`flex items-center gap-2 px-3 py-1 ${isFullscreen && 'hidden'} rounded-md text-xs font-medium transition-colors hover:opacity-80 ${
                theme === 'light' 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              title={!isFullscreen && 'Enter Fullscreen'}
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {!isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                )}
              </svg>
              <span>{!isFullscreen && 'Fullscreen'}</span>
            </button>
          </div>
        </div>
      </div>
  )
}

export default WarningHeaderForExams