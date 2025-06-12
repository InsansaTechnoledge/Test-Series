import React, { useEffect } from 'react';

const TrueFalseQuestion = ({ selectedQuestion, option, setOption }) => {

    useEffect(() => {
        if (selectedQuestion) {
            // Set the user's response if already answered
            setOption(selectedQuestion.response ?? null);
        }
    }, [selectedQuestion]);

    const handleChange = (value) => {
        setOption(value);
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
      
      
          {/* Question Statement */}
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Q{selectedQuestion.index}. {selectedQuestion.statement}
          </h3>
      
          {/* True/False Options */}
          <div className="mt-8 space-y-4 text-xl sm:text-2xl">
            <div className="flex items-center gap-4">
              <input
                type="radio"
                id={`true-${selectedQuestion.id}`}
                name={`tf-${selectedQuestion.id}`}
                checked={option === true}
                onChange={() => handleChange(true)}
                className="w-5 h-5 accent-blue-600"
              />
              <label
                htmlFor={`true-${selectedQuestion.id}`}
                className="cursor-pointer text-gray-800"
              >
                ✅ True
              </label>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="radio"
                id={`false-${selectedQuestion.id}`}
                name={`tf-${selectedQuestion.id}`}
                checked={option === false}
                onChange={() => handleChange(false)}
                className="w-5 h-5 accent-blue-600"
              />
              <label
                htmlFor={`false-${selectedQuestion.id}`}
                className="cursor-pointer text-gray-800"
              >
                ❌ False
              </label>
            </div>
          </div>
        </div>
      );
      
};

export default TrueFalseQuestion;
