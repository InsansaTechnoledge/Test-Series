import React from 'react'
import { ChevronLeft, ChevronRight, Play, Code, Clock, Star, Users, TestTube, Send, Palette } from 'lucide-react'
import { useTheme } from '../../../../hooks/useTheme';
import { UploadCloud, Save } from "lucide-react";
import { TerminalSquare } from "lucide-react";
const HeaderComponent = ({
  problems,
  language,
  setCurrentProblem,
  setLanguage,
  currentProblem,
  languages,
  runCode,
  isRunning,
  runTests,
  editorTheme,
  setEditorTheme,
  submitContest
}) => {
  const currentProblemData = problems[currentProblem];

  // Get theme from hook (like in CreateBatch component)
  const { theme } = useTheme();


  const editorThemes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'vs-light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast Dark' },
    { value: 'hc-light', label: 'High Contrast Light' }
  ];

  const getDifficultyColor = (difficulty) => {
    const baseColors = {
      'easy': theme === 'light'
        ? 'bg-green-100 text-green-800 border-green-200'
        : 'bg-green-900/30 text-green-300 border-green-600',
      'medium': theme === 'light'
        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
        : 'bg-yellow-900/30 text-yellow-300 border-yellow-600',
      'hard': theme === 'light'
        ? 'bg-red-100 text-red-800 border-red-200'
        : 'bg-red-900/30 text-red-300 border-red-600',
      'default': theme === 'light'
        ? 'bg-gray-100 text-gray-800 border-gray-200'
        : 'bg-gray-700 text-gray-300 border-gray-600'
    };

    return baseColors[difficulty?.toLowerCase()] || baseColors['default'];
  };

  // Common input styles
  const selectStyles = `border rounded-lg px-4 py-2 focus:ring-2 focus:border-transparent outline-none transition-all duration-300 ${theme === 'light'
      ? 'border-blue-200 bg-white text-gray-900 focus:ring-blue-500 hover:border-blue-300'
      : 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-blue-400 hover:border-gray-500'
    }`;

  // Button styles
  const navButtonStyles = `p-2 rounded-lg transition-colors duration-300 ${theme === 'light'
      ? 'hover:bg-blue-100 disabled:opacity-50 disabled:hover:bg-transparent'
      : 'hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent'
    }`;
  const runButtonStyles = `w-10 h-10 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border shadow-sm ${theme === 'light'
      ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
    }`;

  const submitButtonStyles = `px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg font-medium ${theme === 'light'
      ? 'bg-green-600 text-white hover:bg-green-700'
      : 'bg-green-500 text-white hover:bg-green-600'
    }`;
  const secondaryButtonStyles = `px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium border ${theme === 'light'
      ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      : 'bg-gray-800 text-gray-100 border-gray-600 hover:bg-gray-700'
    }`;

  return (
    <div className={`border-b shadow-sm ${theme === 'light'
        ? 'bg-gradient-to-r from-blue-50 via-white to-blue-50 border-gray-200'
        : 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-gray-700'
      }`}>
      {/* Main Header */}
      <div className="p-4 flex justify-between items-center">
        {/* Left Section - Navigation */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentProblem(Math.max(0, currentProblem - 1))}
              disabled={currentProblem === 0}
              className={navButtonStyles}
            >
              <ChevronLeft className={`w-5 h-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                }`} />
            </button>

            <div className="flex items-center space-x-3">
              <span className={`font-semibold text-lg ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'
                }`}>
                Problem {currentProblem + 1} of {problems.length}
              </span>
              <div className={`h-6 w-px ${theme === 'light' ? 'bg-blue-200' : 'bg-gray-600'
                }`}></div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(currentProblemData?.difficulty)}`}>
                {currentProblemData?.difficulty || 'Unknown'}
              </span>
            </div>

            <button
              onClick={() => setCurrentProblem(Math.min(problems.length - 1, currentProblem + 1))}
              disabled={currentProblem === problems.length - 1}
              className={navButtonStyles}
            >
              <ChevronRight className={`w-5 h-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                }`} />
            </button>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            {/* <Code className={`w-4 h-4 ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`} /> */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={selectStyles}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Editor Theme Selector */}
          <div className="flex items-center space-x-2">
            {/* <Palette className={`w-4 h-4 ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`} /> */}
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              className={selectStyles}
              title="Editor Theme"
            >
              {editorThemes.map((themeOption) => (
                <option key={themeOption.value} value={themeOption.value}>
                  {themeOption.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className={runButtonStyles}
            >
              {isRunning ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>


            <button
              onClick={runTests}
              disabled={isRunning}
              className={secondaryButtonStyles}
            >
              <TerminalSquare className="w-4 h-4" />
              <span>{isRunning ? 'Running Test Cases' : 'Submit Test Cases'}</span>
            </button>

            <button
              onClick={submitContest}
              disabled={isRunning}
              className={submitButtonStyles}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit this Contest</span>
            </button>
          </div>




        </div>
      </div>
    </div>
  )
}

export default HeaderComponent