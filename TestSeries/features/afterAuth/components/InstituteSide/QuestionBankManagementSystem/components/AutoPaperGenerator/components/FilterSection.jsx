import React from 'react';
import { Filter } from 'lucide-react';

const FilterSection = ({ formData, handleInputChange, analysisData }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Filter className="text-gray-600" />
        Global Filters
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level Filter
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
          >
            <option value="all">All Difficulties</option>
            {analysisData.difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Pre-filter questions by difficulty before applying distribution percentages
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bloom's Taxonomy Filter
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.bloomText}
            onChange={(e) => handleInputChange('bloomText', e.target.value)}
          >
            <option value="all">All Levels</option>
            {analysisData.bloomTexts.map(bloom => (
              <option key={bloom} value={bloom}>{bloom}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Pre-filter questions by Bloom level before applying distribution percentages
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;