import React, { useState } from 'react'
import { promptParser } from '../utils/promptParser';
import { Lightbulb, MessageSquare } from 'lucide-react';

const PromptBasedGeneration = ({ onGenerate, analysisData }) => {
    const [prompt, setPrompt] = useState('');
    const [selectedSample, setSelectedSample] = useState('');
    const samplePrompts = promptParser.getSamplePrompts();
  
    const handleGenerate = () => {
      if (prompt.trim()) {
        onGenerate(prompt);
      }
    };
  
    const handleSampleSelect = (samplePrompt) => {
      setPrompt(samplePrompt);
      setSelectedSample(samplePrompt);
    };
  
    return (
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MessageSquare className="text-green-600 w-5 h-5" />
          AI Prompt-Based Generation
        </h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your exam requirements:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Create a 50 marks programming exam focusing on easy to medium difficulty questions in 45 minutes with emphasis on understanding and application..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm h-24 resize-none"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sample Prompts (Click to use):
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {samplePrompts.map((sample, index) => (
              <button
                key={index}
                onClick={() => handleSampleSelect(sample)}
                className={`w-full text-left p-2 text-xs rounded border transition-colors ${
                  selectedSample === sample
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lightbulb className="w-3 h-3 inline mr-1" />
                {sample}
              </button>
            ))}
          </div>
        </div>
  
        <div className="bg-blue-50 p-3 rounded">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Available Data:</h4>
          <div className="text-xs text-gray-700 space-y-1">
            <div><strong>Subjects:</strong> {Object.keys(analysisData.subjects).join(', ')}</div>
            <div><strong>Difficulties:</strong> {analysisData.difficulties.join(', ')}</div>
            <div><strong>Bloom Levels:</strong> {analysisData.bloomLevels.length > 0 ? analysisData.bloomLevels.join(', ') : 'Limited data available'}</div>
          </div>
        </div>
  
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim()}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Generate from Prompt
        </button>
      </div>
    );
  };

export default PromptBasedGeneration


