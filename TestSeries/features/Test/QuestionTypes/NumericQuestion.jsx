import React, { useEffect } from 'react';

const NumericalQuestion = ({ selectedQuestion, option, setOption }) => {
    
    useEffect(() => {
        if (selectedQuestion) {
            // Set existing response if available, else empty string
            setOption(selectedQuestion.response?.toString() || '');
        }
    }, [selectedQuestion]);

    const handleChange = (e) => {
        setOption(e.target.value);
    };

    return (
        <div className="space-y-6  p-6  ">
          {/* Marks Info */}
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
      
          {/* Question Heading */}
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Q{selectedQuestion.index}. {selectedQuestion.question_text}
          </h3>
      
        
      
          {/* Numerical Input */}
          <div className="mt-6 space-y-2">
            <label
              htmlFor={`numerical-answer-${selectedQuestion.id}`}
              className="block text-lg font-medium text-gray-700"
            >
              Enter your answer:
            </label>
            <input
              type="text"
              id={`numerical-answer-${selectedQuestion.id}`}
              value={option || ''}
              onChange={handleChange}
              className="w-full sm:w-1/2 border-2 border-gray-300 px-4 py-2 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              placeholder="e.g. 42"
            />
          </div>
        </div>
      );
      
};

export default NumericalQuestion;
