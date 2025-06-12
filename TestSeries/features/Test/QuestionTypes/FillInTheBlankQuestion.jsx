import React, { useEffect } from 'react';

const FillInTheBlankQuestion = ({ selectedQuestion, option, setOption }) => {

    useEffect(() => {
        if (selectedQuestion) {
            setOption(selectedQuestion.response || '');
        }
    }, [selectedQuestion]);

    const handleChange = (e) => {
        setOption(e.target.value);
    };

    return (
        <div className="space-y-6  p-6 ">
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
      
          {/* Question Text */}
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-relaxed">
              Q{selectedQuestion.index}.
              <span className="ml-2">{selectedQuestion.question_text || 'No question text provided.'}</span>
            </h3>
          </div>
      
        
          {/* Answer Input Field */}
          <div className="mt-6">
            <label
              htmlFor={`fill-${selectedQuestion.id}`}
              className="block text-lg font-medium text-gray-700 mb-2"
            >
            Your Answer
            </label>
            <input
              type="text"
              id={`fill-${selectedQuestion.id}`}
              value={option || ''}
              onChange={handleChange}
              placeholder="Type your answer here..."
              className="w-full px-5 py-3 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none rounded-lg shadow-sm text-xl transition-all duration-200"
            />
          </div>
        </div>
      );
      
      
};

export default FillInTheBlankQuestion;
