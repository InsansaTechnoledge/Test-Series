import React from 'react'
import { ChevronLeft, ChevronRight, Play, Code, Clock, Star, Users, TestTube, Send } from 'lucide-react'

const HeaderComponent = ({problems, language, setCurrentProblem, setLanguage, currentProblem, languages, runCode, isRunning, runTests}) => {
  const currentProblemData = problems[currentProblem];
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="border-b bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-sm">
      {/* Main Header */}
      <div className="p-4 flex justify-between items-center">
        {/* Left Section - Navigation */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentProblem(Math.max(0, currentProblem - 1))}
              disabled={currentProblem === 0}
              className="p-2 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-blue-600" />
            </button>

            <div className="flex items-center space-x-3">
              <span className="font-semibold text-blue-800 text-lg">
                Problem {currentProblem + 1} of {problems.length}
              </span>
              <div className="h-6 w-px bg-blue-200"></div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(currentProblemData?.difficulty)}`}>
                {currentProblemData?.difficulty || 'Unknown'}
              </span>
            </div>

            <button
              onClick={() => setCurrentProblem(Math.min(problems.length - 1, currentProblem + 1))}
              disabled={currentProblem === problems.length - 1}
              className="p-2 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-blue-600" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-blue-200 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Play className="w-4 h-4" />
              <span className="font-medium">{isRunning ? 'checking your code' : 'Run'}</span>
            </button>

            <button
              onClick={runTests}
              disabled={isRunning}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span className="font-medium">{isRunning ? 'Running Test Cases' : 'Submit Test'}</span>
            </button>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default HeaderComponent