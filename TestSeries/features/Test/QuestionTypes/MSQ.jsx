import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../hooks/useTheme';

const MSQ = ({ selectedQuestion, option, setOption}) => {
   const {theme} = useTheme() 

    useEffect(() => {
            if (selectedQuestion) {
                setOption(selectedQuestion.response || []);
            }
        }, [selectedQuestion])

   

    const handleToggleOption = (optionIndex) => {
        if (option.includes(optionIndex)) {
            // Deselect if already selected
            setOption(option.filter(index => index !== optionIndex));
        } else {
            // Add if not already selected
            setOption([...option, optionIndex]);
        }
    };

    return (
        <div className={`space-y-6 p-6 rounded-xl shadow-md transition-all duration-300
  ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}
`}>
  {/* Top Marks Info */}
  <div className="flex flex-wrap gap-4 justify-end">
    <div className="text-green-700 font-bold bg-green-100 rounded-lg px-4 py-2">
      Correct: +{selectedQuestion.positive_marks}
    </div>
    <div className="text-red-700 font-bold bg-red-100 rounded-lg px-4 py-2">
      Wrong: -{selectedQuestion.negative_marks}
    </div>
    <div className={`font-bold rounded-lg px-4 py-2 
      ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'}`}>
      Unattempted: 0
    </div>
  </div>

  {/* Question Text */}
  <h3 className="font-bold text-xl sm:text-2xl border-b border-dashed pb-4">
    Q{selectedQuestion.index}.{' '}
    {selectedQuestion.question_text || (
      <span className="text-red-500">No question text</span>
    )}
  </h3>

  {/* Optional Image */}
  {selectedQuestion.image && (
    <div className="mt-4">
      <img
        src={selectedQuestion.image}
        alt={`Question ${selectedQuestion.index} illustration`}
        className="max-w-full h-auto rounded-md shadow-md"
      />
    </div>
  )}

  {/* Options */}
  <div className="mt-6 space-y-4">
    {Array.isArray(selectedQuestion.options) && selectedQuestion.options.length > 0 ? (
      selectedQuestion.options.map((opt, idx) => {
        const isChecked = Array.isArray(option) && option.includes(idx);
        const optionLabels = ['A.', 'B.', 'C.', 'D.'];

        return (
          <label
            key={idx}
            htmlFor={`option-${idx}-${selectedQuestion.id}`}
            className={`flex items-center gap-4 px-5 py-4 rounded-md border-2 cursor-pointer transition-all duration-200
              ${
                isChecked
                  ? 'bg-green-800/20 border-green-600 text-green-700 font-medium'
                  : theme === 'light'
                  ? 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                  : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
              }
            `}
          >
            <input
              type="checkbox"
              id={`option-${idx}-${selectedQuestion.id}`}
              checked={isChecked}
              onChange={() => handleToggleOption(idx)}
              className="w-5 h-5 accent-green-600"
            />
            <span className="font-semibold w-6">{optionLabels[idx]}</span>
            <span className="flex-1">{opt}</span>
            {isChecked && (
              <svg
                className="w-5 h-5 text-green-500 ml-auto"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </label>
        );
      })
    ) : (
      <div className="text-red-500 font-bold">No options available for this question.</div>
    )}
  </div>
</div>

      );
      
      
};

export default MSQ;
