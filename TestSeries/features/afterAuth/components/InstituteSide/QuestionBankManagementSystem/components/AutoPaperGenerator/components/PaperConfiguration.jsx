import { Settings } from 'lucide-react';
import React from 'react'

const PaperConfiguration = ({ formData, handleInputChange, handleNestedChange, filteredQuestions }) => {
    const totalDifficultyPercentage = Object.values(formData.difficultyDistribution)
      .reduce((sum, val) => sum + val, 0);
  
    return (
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Settings className="text-gray-600 w-5 h-5" />
          Traditional Paper Configuration
        </h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paper Title</label>
            <input
              type="text"
              placeholder="Enter paper title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={formData.paperTitle}
              onChange={(e) => handleInputChange('paperTitle', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.totalMarks}
                onChange={(e) => handleInputChange('totalMarks', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time (min)</label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.timeLimit}
                onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
  
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Marks per Question</h3>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'medium', 'hard'].map(level => (
                <div key={level}>
                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{level}</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.marksPerQuestion[level]}
                    onChange={(e) => handleNestedChange('marksPerQuestion', level, parseInt(e.target.value) || 1)}
                  />
                </div>
              ))}
            </div>
          </div>
  
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-800">Difficulty Distribution (%)</h3>
              <span className={`text-xs font-medium ${totalDifficultyPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                Total: {totalDifficultyPercentage}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'medium', 'hard'].map(level => (
                <div key={level}>
                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{level} (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.difficultyDistribution[level]}
                    onChange={(e) => handleNestedChange('difficultyDistribution', level, parseInt(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default PaperConfiguration
