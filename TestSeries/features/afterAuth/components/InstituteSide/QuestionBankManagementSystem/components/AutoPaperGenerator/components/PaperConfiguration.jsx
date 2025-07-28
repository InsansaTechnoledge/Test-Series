import React from 'react';
import { Settings } from 'lucide-react';

const PaperConfiguration = ({ 
  formData, 
  handleInputChange, 
  handleNestedChange, 
  filteredQuestions 
}) => {
  const totalDifficultyPercentage = Object.values(formData.difficultyDistribution)
    .reduce((sum, val) => sum + val, 0);
  
  const totalBloomPercentage = Object.values(formData.bloomDistribution)
    .reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Settings className="text-gray-600" />
        Paper Configuration
      </h2>
      
      {/* Basic Configuration */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paper Title
          </label>
          <input
            type="text"
            placeholder="Enter paper title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.paperTitle}
            onChange={(e) => handleInputChange('paperTitle', e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Marks
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.totalMarks}
              onChange={(e) => handleInputChange('totalMarks', parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time (min)
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.timeLimit}
              onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Marks per Question Type */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Marks per Question</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Easy Questions
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.marksPerQuestion.easy}
              onChange={(e) => handleNestedChange('marksPerQuestion', 'easy', parseInt(e.target.value) || 1)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medium Questions
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.marksPerQuestion.medium}
              onChange={(e) => handleNestedChange('marksPerQuestion', 'medium', parseInt(e.target.value) || 1)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hard Questions
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.marksPerQuestion.hard}
              onChange={(e) => handleNestedChange('marksPerQuestion', 'hard', parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Difficulty Distribution (%)</h3>
          <span className={`text-sm font-medium ${totalDifficultyPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
            Total: {totalDifficultyPercentage}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Easy (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.difficultyDistribution.easy}
              onChange={(e) => handleNestedChange('difficultyDistribution', 'easy', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medium (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.difficultyDistribution.medium}
              onChange={(e) => handleNestedChange('difficultyDistribution', 'medium', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hard (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.difficultyDistribution.hard}
              onChange={(e) => handleNestedChange('difficultyDistribution', 'hard', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Bloom Taxonomy Distribution */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Bloom's Taxonomy Distribution (%)</h3>
          <span className={`text-sm font-medium ${totalBloomPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
            Total: {totalBloomPercentage}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remember (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.bloomDistribution.remember}
              onChange={(e) => handleNestedChange('bloomDistribution', 'remember', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Understand (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.bloomDistribution.understand}
              onChange={(e) => handleNestedChange('bloomDistribution', 'understand', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apply (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.bloomDistribution.apply}
              onChange={(e) => handleNestedChange('bloomDistribution', 'apply', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Analyze (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.bloomDistribution.analyze}
              onChange={(e) => handleNestedChange('bloomDistribution', 'analyze', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evaluate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.bloomDistribution.evaluate}
              onChange={(e) => handleNestedChange('bloomDistribution', 'evaluate', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Create (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.bloomDistribution.create}
              onChange={(e) => handleNestedChange('bloomDistribution', 'create', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperConfiguration