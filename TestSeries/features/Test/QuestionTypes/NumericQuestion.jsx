import React, { useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';

const NumericalQuestion = ({ selectedQuestion, option, setOption }) => {
    const {theme} = useTheme()
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
   

        <div className={`space-y-6 p-6 rounded-xl shadow-md transition-all duration-300
  ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}
`}>
  {/* Marks Info */}
  <div className="flex flex-wrap gap-4 justify-end text-sm sm:text-base font-semibold">
    <div className={`${theme === 'light'
      ? 'bg-green-100 text-green-800'
      : 'bg-green-900 text-green-300 border border-green-700'} rounded-lg px-4 py-2`}>
      Correct: +{selectedQuestion.positive_marks}
    </div>
    <div className={`${theme === 'light'
      ? 'bg-red-100 text-red-800'
      : 'bg-red-900 text-red-300 border border-red-700'} rounded-lg px-4 py-2`}>
      Wrong: -{selectedQuestion.negative_marks}
    </div>
    <div className={`${theme === 'light'
      ? 'bg-gray-100 text-gray-800'
      : 'bg-gray-800 text-gray-300 border border-gray-600'} rounded-lg px-4 py-2`}>
      Unattempted: 0
    </div>
  </div>
<div className='min-h-[350px]'>



  {/* Question Heading */}
  <h3 className="text-xl sm:text-2xl font-bold border-b border-dashed pb-4 leading-relaxed">
    Q{selectedQuestion.index}. {selectedQuestion.question_text}
  </h3>

  {/* Numerical Input */}
  <div className="mt-6 space-y-2">
    <label
      htmlFor={`numerical-answer-${selectedQuestion.id}`}
      className={`block text-lg font-medium
        ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
      `}
    >
      Enter your answer:
    </label>
    <input
      type="text"
      id={`numerical-answer-${selectedQuestion.id}`}
      value={option || ''}
      onChange={handleChange}
      className={`w-full sm:w-1/2 px-4 py-2 rounded-md border-2 text-xl transition-all duration-150 outline-none
        ${theme === 'light'
          ? 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400'
          : 'bg-gray-800 text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'}
      `}
      placeholder="e.g. 42"
    />
  </div>
  </div>
</div>

      );
      
};

export default NumericalQuestion;
