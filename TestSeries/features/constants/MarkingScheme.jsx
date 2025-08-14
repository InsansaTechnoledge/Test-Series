import React from 'react'


const MarkingScheme = ({ selectedQuestion, theme }) => {
    return (
        <div className={`flex items-center gap-5 px-5 py-3 mb-2 rounded-xl  transition-all duration-200 ${
          theme === 'light' 
            ? 'bg-gradient-to-r from-white to-white ' 
            : 'bg-gradient-to-r from-gray-800 to-gray-700 '
        }`}>
          <div className="flex items-center gap-3">
           
            <span className={`font-semibold ${
              theme === 'light' ? 'text-gray-800' : 'text-gray-200'
            }`}>
              Question's Marking Scheme
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900/50 text-green-300'
              }`}>
                ✓
              </div>
              <span className="text-green-600 font-bold text-lg">
                +{selectedQuestion?.positive_marks || 0}
              </span>
              <span className={`text-xs ${
                theme === 'light' ? 'text-green-600' : 'text-green-400'
              }`}>
                Marks
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-900/50 text-red-300'
              }`}>
                ✗
              </div>
              <span className="text-red-600 font-bold text-lg">
                -{selectedQuestion?.negative_marks || 0}
              </span>
              <span className={`text-xs ${
                theme === 'light' ? 'text-red-600' : 'text-red-400'
              }`}>
                Marks
              </span>
            </div>
            
          
          </div>
        </div>
      )
  }

export default MarkingScheme
