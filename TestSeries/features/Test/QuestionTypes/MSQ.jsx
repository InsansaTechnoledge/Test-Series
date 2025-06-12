import React, { useEffect, useState } from 'react';

const MSQ = ({ selectedQuestion, option, setOption}) => {
    

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
        <div className="space-y-6 p-6">
          {/* Top Marks Info */}
          <div className="flex flex-wrap gap-4 justify-end">
            <div className="text-green-700 font-bold bg-green-100 rounded-lg px-4 py-2">
              Correct: +{selectedQuestion.positive_marks}
            </div>
            <div className="text-red-700 font-bold bg-red-100 rounded-lg px-4 py-2">
              Wrong: -{selectedQuestion.negative_marks}
            </div>
            <div className="text-gray-700 font-bold bg-gray-100 rounded-lg px-4 py-2">
              Unattempted: 0
            </div>
          </div>
      
          {/* Question Text */}
          <h3 className="font-bold text-2xl sm:text-3xl">
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
          <div className="mt-6 space-y-5">
            {Array.isArray(selectedQuestion.options) && selectedQuestion.options.length > 0 ? (
              selectedQuestion.options.map((opt, idx) => {
                const isChecked = Array.isArray(option) && option.includes(idx);
                return (
                  <label
                    key={idx}
                    htmlFor={`option-${idx}-${selectedQuestion.id}`}
                    className={`flex items-center gap-4 text-lg sm:text-xl p-4 rounded-md border cursor-pointer transition-all duration-200
                      ${
                        isChecked
                          ? 'bg-blue-100 border-blue-500 text-blue-800 font-semibold'
                          : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <input
                      type="checkbox"
                      id={`option-${idx}-${selectedQuestion.id}`}
                      checked={isChecked}
                      onChange={() => handleToggleOption(idx)}
                      className="accent-blue-600 w-5 h-5"
                    />
                    {opt}
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
