import React, { useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';

const FillInTheBlankQuestion = ({ selectedQuestion, option, setOption }) => {
const {theme} = useTheme()
    useEffect(() => {
        if (selectedQuestion) {
            setOption(selectedQuestion.response || '');
        }
    }, [selectedQuestion]);

    const handleChange = (e) => {
        setOption(e.target.value);
    };

    return (
      
        <div className={`space-y-6 p-6 rounded-xl shadow-md transition-all duration-300
  ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}
`}>
  {/* Marks Info */}
  <div className="flex flex-wrap gap-4 justify-end text-sm sm:text-base font-semibold">
    <div
      className={`rounded-lg px-4 py-2 transition-all duration-200
        ${theme === 'light'
          ? 'bg-green-100 text-green-800'
          : 'bg-green-900 text-green-300 border border-green-700'}
      `}
    >Correct: +{selectedQuestion.positive_marks}
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

{/* Question Text */}
<div className='min-h-[350px]'>

<div className="mt-4  flex flex-col">
  <h3 className="text-xl sm:text-2xl font-bold border-b border-dashed pb-4 leading-relaxed ">
    Q{selectedQuestion.index}.
    <span className="ml-2">

      {selectedQuestion.question_text || (
        <span className="text-red-500">No question text provided.</span>
      )}
    </span>
  </h3>
  <div className="flex-1"></div>
</div>

  {/* Answer Input Field */}
  <div className="mt-6">
    <label
      htmlFor={`fill-${selectedQuestion.id}`}
      className={`block text-lg font-semibold mb-2
        ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
      `}
    >
      Your Answer
    </label>

    <input
      type="text"
      id={`fill-${selectedQuestion.id}`}
      value={option || ''}
      onChange={handleChange}
      placeholder="Type your answer here..."
      className={`w-full px-5 py-3 rounded-lg border-2 shadow-sm text-xl transition-all duration-200 outline-none
        ${theme === 'light'
          ? 'bg-white text-gray-900 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-400'
          : 'bg-gray-800 text-white border-blue-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'}
      `}
    />
  </div>
  </div>
</div>

      );
      
      
};

export default FillInTheBlankQuestion;
