import React from 'react';
import { ArrowLeft, ChevronRight, Grid3X3, Zap } from 'lucide-react';

const Sidebar = ({ categories, setSelectedQuestionType, selectedQuestionType }) => {
  return (
    <div className="h-screen w-72 bg-white text-gray-800 flex flex-col shadow-xl border-r border-gray-200">
      {/* Header */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 backdrop-blur-sm rounded-xl border border-indigo-200">
            <Grid3X3 className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Dashboard
          </h2>
        </div>
        <div className="h-px mt-4 bg-gray-200"></div>
        <button
          onClick={() => setSelectedQuestionType('none')}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-gray-200 hover:border-gray-300 hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 px-4 pb-6 overflow-y-auto">
        <div className="space-y-2">
          {categories.map((c, index) => (
            <button
              key={index}
              onClick={() => setSelectedQuestionType(c.type)}
              className={`
                group relative w-full px-4 py-3.5 rounded-xl text-left text-sm font-medium
                transition-all duration-300 backdrop-blur-sm
                ${selectedQuestionType === c.type
                  ? 'bg-indigo-600 text-white shadow-lg border border-indigo-600 transform scale-[1.02]'
                  : 'text-gray-700 bg-white hover:text-gray-800 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md hover:transform hover:scale-[1.01]'
                }
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white
              `}
              title={c.type}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${selectedQuestionType === c.type
                      ? 'bg-white shadow-sm'
                      : 'bg-gray-400 group-hover:bg-gray-500 group-hover:shadow-sm'
                    }
                  `} />
                  <span className="truncate capitalize font-medium">{c.type}</span>
                </div>
                
                <ChevronRight className={`
                  w-4 h-4 transition-all duration-300
                  ${selectedQuestionType === c.type
                    ? 'text-white transform rotate-90'
                    : 'text-gray-400 group-hover:text-gray-500 group-hover:transform group-hover:translate-x-0.5'
                  }
                `} />
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="p-1 bg-gray-200 rounded-full">
            <Zap className="w-3 h-3" />
          </div>
          <span className="font-medium">Product of Evalvo </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;