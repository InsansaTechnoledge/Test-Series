import { Brain, MessageSquare, Settings } from 'lucide-react';
import React from 'react'

const GenerationModeSelector = ({ mode, setMode }) => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Settings className="text-gray-600 w-4 h-4" />
          Generation Mode
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMode('traditional')}
            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'traditional' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-4 h-4 mx-auto mb-1" />
            Traditional
          </button>
          
          <button
            onClick={() => setMode('bloom')}
            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'bloom' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Brain className="w-4 h-4 mx-auto mb-1" />
            Bloom's
          </button>
          
          <button
            onClick={() => setMode('prompt')}
            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'prompt' 
                ? 'bg-green-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-4 h-4 mx-auto mb-1" />
            AI Prompt
          </button>
        </div>
      </div>
    );
  };

export default GenerationModeSelector
