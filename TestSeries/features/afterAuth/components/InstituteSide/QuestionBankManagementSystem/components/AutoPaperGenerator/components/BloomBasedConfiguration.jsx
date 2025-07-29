import { Brain } from 'lucide-react';
import React from 'react'

const BloomBasedConfiguration = ({ formData, handleInputChange, handleNestedChange, analysisData }) => {
    const totalBloomPercentage = Object.values(formData.bloomDistribution || {})
      .reduce((sum, val) => sum + val, 0);
  
    return (
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Brain className="text-purple-600 w-5 h-5" />
          Bloom's Taxonomy Configuration
        </h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paper Title</label>
            <input
              type="text"
              placeholder="Enter paper title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                value={formData.totalMarks}
                onChange={(e) => handleInputChange('totalMarks', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time (min)</label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                value={formData.timeLimit}
                onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
  
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-800">Bloom's Level Distribution (%)</h3>
              <span className={`text-xs font-medium ${totalBloomPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                Total: {totalBloomPercentage}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'].map(level => {
                const available = analysisData.bloomLevels.includes(level);
                return (
                  <div key={level} className={!available ? 'opacity-50' : ''}>
                    <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                      {level} {!available && '(No data)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      disabled={!available}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:bg-gray-100"
                      value={formData.bloomDistribution?.[level] || 0}
                      onChange={(e) => handleNestedChange('bloomDistribution', level, parseInt(e.target.value) || 0)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
  
          {analysisData.bloomLevels.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
              <strong>Limited Bloom's taxonomy data available.</strong><br />
              Most questions will be categorized as "understand" level by default.
            </div>
          )}
        </div>
      </div>
    );
  };

export default BloomBasedConfiguration
