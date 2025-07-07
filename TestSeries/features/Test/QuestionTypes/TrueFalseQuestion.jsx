import React, { use, useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';

const TrueFalseQuestion = ({ selectedQuestion, option, setOption }) => {
const {theme} = useTheme()
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

  {/* Question Statement */}

  <div className='min-h-[350px]'>
  <h3 className="text-xl sm:text-2xl font-bold border-b border-dashed pb-4 leading-relaxed">
    Q{selectedQuestion.index}. {selectedQuestion.statement}
  </h3>

  {/* True/False Options */}
  <div className="mt-8 space-y-4 text-lg sm:text-xl">
    {/* TRUE */}
    <label
      htmlFor={`true-${selectedQuestion.id}`}
      className={`flex items-center gap-4 px-5 py-4 rounded-md border-2 cursor-pointer transition-all duration-200
        ${option === true
          ? 'bg-blue-100 border-blue-500 text-blue-800 font-semibold'
          : theme === 'light'
          ? 'bg-gray-100 border-gray-300 hover:bg-gray-200'
          : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}
      `}
    >
      <input
        type="radio"
        id={`true-${selectedQuestion.id}`}
        name={`tf-${selectedQuestion.id}`}
        checked={option === true}
        onChange={() => handleChange(true)}
        className="w-5 h-5 accent-blue-600"
      />
      True
    </label>

    {/* FALSE */}
    <label
      htmlFor={`false-${selectedQuestion.id}`}
      className={`flex items-center gap-4 px-5 py-4 rounded-md border-2 cursor-pointer transition-all duration-200
        ${option === false
          ? 'bg-blue-100 border-blue-500 text-blue-800 font-semibold'
          : theme === 'light'
          ? 'bg-gray-100 border-gray-300 hover:bg-gray-200'
          : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}
      `}
    >
      <input
        type="radio"
        id={`false-${selectedQuestion.id}`}
        name={`tf-${selectedQuestion.id}`}
        checked={option === false}
        onChange={() => handleChange(false)}
        className="w-5 h-5 accent-blue-600"
      />
      False
    </label>
  </div>
  </div>
</div>

      );
      
};

export default TrueFalseQuestion;
