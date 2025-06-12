import React, { useEffect } from 'react';

const MCQ = ({ selectedQuestion, option, setOption }) => {

  useEffect(() => {
    if (selectedQuestion) {
      setOption(selectedQuestion.response ?? null);
    }
  }, [selectedQuestion, setOption]);

  if (!selectedQuestion) {
    return <div>No question selected.</div>;
  }

  const handleChangeOption = (newOption) => {
    setOption(newOption);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Marking Scheme */}
      <div className="flex flex-wrap justify-end gap-4">
        <div className="bg-green-100 text-green-800 font-semibold rounded-lg px-4 py-2">
          Correct: +{selectedQuestion.positive_marks}
        </div>
        <div className="bg-red-100 text-red-800 font-semibold rounded-lg px-4 py-2">
          Wrong: -{selectedQuestion.negative_marks}
        </div>
        <div className="bg-gray-100 text-gray-800 font-semibold rounded-lg px-4 py-2">
          Unattempted: 0
        </div>
      </div>
  
      {/* Question */}
      <div>
        <h3 className="font-bold text-2xl sm:text-3xl leading-relaxed">
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
              className="rounded-lg shadow-md max-w-full h-auto"
            />
          </div>
        )}
      </div>
  
      {/* Options */}
      <div className="mt-8 space-y-5">
        {Array.isArray(selectedQuestion.options) && selectedQuestion.options.length > 0 ? (
          selectedQuestion.options.map((opt, idx) => (
            <label
              key={idx}
              htmlFor={`option-${idx}-${selectedQuestion.id}`}
              className={`flex items-center gap-4 text-lg sm:text-xl p-4 rounded-md border cursor-pointer transition-all duration-200
                ${
                  option === idx
                    ? 'bg-blue-100 border-blue-500 text-blue-800 font-semibold'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
            >
              <input
                type="radio"
                id={`option-${idx}-${selectedQuestion.id}`}
                checked={option === idx}
                onChange={() => handleChangeOption(idx)}
                name={`option-${selectedQuestion.id}`}
                value={opt}
                className="accent-blue-600 w-5 h-5"
              />
              {opt}
            </label>
          ))
        ) : (
          <div className="text-red-500 font-bold">
            No options available for this question.
          </div>
        )}
      </div>
    </div>
  );
  
};

export default MCQ;
