import React, { use, useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import MarkingScheme from '../../constants/MarkingScheme';
import QuestionsAndImage from '../../constants/QuestionsAndImage';

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
     
        <div className={`space-y-6 px-6 transition-all duration-300
  ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}
`}>
  {/* Marks Info */}
  <MarkingScheme selectedQuestion={selectedQuestion} theme={theme}/>

  <div >
  
  {/* Question Statement */}
  <QuestionsAndImage selectedQuestion={selectedQuestion}/>

  {/* True/False Options */}
  <div className=" mt-2 text-md sm:text-xl">
    {/* TRUE */}
    <label
      htmlFor={`true-${selectedQuestion.id}`}
      className={`flex items-center gap-4 px-5 py-2  cursor-pointer transition-all duration-200
        ${option === true
          ? ' border-blue-500 text-gray-200 font-semibold'
          : theme === 'light'
          ? ' border-gray-300'
          : 'border-gray-600 '}
      `}
    >
      <input
        type="radio"
        id={`true-${selectedQuestion.id}`}
        name={`tf-${selectedQuestion.id}`}
        checked={option === true}
        onChange={() => handleChange(true)}
        className="w-5 h-5 accent-indigo-600 "
      />
      True
    </label>

    {/* FALSE */}
    <label
      htmlFor={`false-${selectedQuestion.id}`}
      className={`flex items-center gap-4 px-5 py-2  cursor-pointer transition-all duration-200
        ${option === false
          ? ' border-indigo-500 text-gray-200 font-semibold'
          : theme === 'light'
          ? ' border-gray-300'
          : ' border-gray-600 '}
      `}
    >
      <input
        type="radio"
        id={`false-${selectedQuestion.id}`}
        name={`tf-${selectedQuestion.id}`}
        checked={option === false}
        onChange={() => handleChange(false)}
        className="w-5 h-5 accent-indigo-600"
      />
      False
    </label>
  </div>
  </div>
</div>

      );
      
};

export default TrueFalseQuestion;
