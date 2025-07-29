import { Filter } from 'lucide-react';
import React from 'react'

const FilterSection = ({ formData, handleInputChange, analysisData }) => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Filter className="text-gray-600 w-4 h-4" />
          Global Filters
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level Filter</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={formData.filters?.difficulty || 'all'}
              onChange={(e) => handleInputChange('filters', { ...formData.filters, difficulty: e.target.value })}
            >
              <option value="all">All Difficulties</option>
              {analysisData.difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Filter</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={formData.filters?.subjectFilter || 'all'}
              onChange={(e) => handleInputChange('filters', { ...formData.filters, subjectFilter: e.target.value })}
            >
              <option value="all">All Subjects</option>
              {Object.keys(analysisData.subjects).map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bloom Level Filter</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={formData.filters?.bloomFilter || 'all'}
              onChange={(e) => handleInputChange('filters', { ...formData.filters, bloomFilter: e.target.value })}
            >
              <option value="all">All Bloom Levels</option>
              {analysisData?.bloomLevels?.map(bloom => (
                <option key={bloom} value={bloom}>{bloom}</option>
              ))}
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Filter</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={formData.filters?.chapterFilter || 'all'}
              onChange={(e) => handleInputChange('filters', { ...formData.filters, chapterFilter: e.target.value })}
            >
              <option value="all">All Chapters</option>
              {analysisData?.chapters?.map(chapter => (
                <option key={chapter} value={chapter}>{chapter}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };
export default FilterSection
