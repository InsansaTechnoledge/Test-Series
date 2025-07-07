import React, { useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';

const MCQ = ({ selectedQuestion, option, setOption }) => {
const {theme} = useTheme()
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
    <div className={`space-y-6 p-6 rounded-xl shadow-md transition-all duration-300
  ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}
`}>
  {/* Marking Scheme */}
  <div className="flex flex-wrap justify-end gap-4 text-sm sm:text-base font-semibold">
  <div
    className={`rounded-lg px-4 py-2 transition-all duration-200
      ${theme === 'light'
        ? 'bg-green-100 text-green-800'
        : 'bg-green-900 text-green-300 border border-green-700'}
    `}
  >
    Correct: +{selectedQuestion.positive_marks}
  </div>

  <div
    className={`rounded-lg px-4 py-2 transition-all duration-200
      ${theme === 'light'
        ? 'bg-red-100 text-red-800'
        : 'bg-red-900 text-red-300 border border-red-700'}
    `}
  >
     Wrong: -{selectedQuestion.negative_marks}
  </div>

  <div
    className={`rounded-lg px-4 py-2 transition-all duration-200
      ${theme === 'light'
        ? 'bg-gray-100 text-gray-800'
        : 'bg-gray-800 text-gray-300 border border-gray-600'}
    `}
  >
    Unattempted: 0
  </div>
</div>


  {/* Question */}
  <div>
    <h3 className="font-bold text-xl sm:text-2xl leading-relaxed border-b border-dashed pb-4 mb-6">
      Q{selectedQuestion.index}. {selectedQuestion.question_text || (
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
  <div className="mt-8 space-y-4">
    {Array.isArray(selectedQuestion.options) && selectedQuestion.options.length > 0 ? (
      selectedQuestion.options.map((opt, idx) => {
        const isSelected = option === idx;
        const optionLabels = ['A.', 'B.', 'C.', 'D.'];

        return (
          <label
            key={idx}
            htmlFor={`option-${idx}-${selectedQuestion.id}`}
            className={`flex items-center gap-4 px-5 py-4 rounded-md border-2 cursor-pointer transition-all duration-200
              ${
                isSelected
                  ? 'bg-green-800/20 border-green-600 text-green-600 font-medium font-se+'
                  : theme === 'light'
                  ? 'bg-gray-100 border-gray-500 hover:bg-gray-200'
                  : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
              }
            `}
          >
            <input
              type="radio"
              id={`option-${idx}-${selectedQuestion.id}`}
              checked={isSelected}
              onChange={() => handleChangeOption(idx)}
              name={`option-${selectedQuestion.id}`}
              value={opt}
              className="w-5 h-5 accent-green-600"
            />
            <span className="font-semibold w-6">{optionLabels[idx]}</span>
            <span>{opt}</span>
            {isSelected && (
              <svg
                className="ml-auto w-5 h-5 text-green-500"
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
      <div className="text-red-500 font-bold">
        No options available for this question.
      </div>
    )}
  </div>
</div>


  
  );
  
};

export default MCQ;
