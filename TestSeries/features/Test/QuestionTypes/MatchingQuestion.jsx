import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../hooks/useTheme';

const MatchingQuestion = ({ selectedQuestion, option, setOption }) => {
    const [isLoading, setIsLoading] = useState(true);
    const shuffledRightItems = [...selectedQuestion.right_items].sort(()=> Math.random() - 0.5);
    const {theme} = useTheme()

    useEffect(() => {
        if (selectedQuestion) {
            // Pre-fill from response or initialize empty match map
            setOption(selectedQuestion.response || {});
            setIsLoading(false);
        }
    }, [selectedQuestion]);

    const handleSelectChange = (leftItem, rightItem) => {
        setOption(prev => ({
            ...prev,
            [leftItem]: rightItem
        }));
    };

    if(isLoading){
        return <div>Loading...</div>
    }

    return (
  
      <div className={`space-y-6 p-6 rounded-xl shadow-md transition-all duration-300
  ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}
`}>
  {/* Marks Info */}
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
  <div className='min-h-[350px]'>
  {/* Question Heading */}
  <h3 className="text-xl sm:text-2xl font-bold border-b border-dashed pb-4 leading-relaxed">
    Q{selectedQuestion.index}. Match the Following
  </h3>

  {/* Matching Pairs */}
  <div className="mt-6 space-y-4">
    {selectedQuestion.left_items.map((leftItem, idx) => (
      <div
        key={idx + selectedQuestion.id}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-lg sm:text-xl"
      >
        {/* Left Item */}
        <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium w-full sm:w-1/3`}>
          {leftItem}
        </span>

        {/* Select Dropdown */}
        <select
          id={`match-${idx}-${selectedQuestion.id}`}
          className={`w-full sm:w-2/3 px-4 py-2 rounded-lg border-2 transition-all duration-200 outline-none
            ${theme === 'light'
              ? 'bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400'
              : 'bg-gray-800 text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'}
          `}
          value={option?.[leftItem] || ''}
          onChange={(e) => handleSelectChange(leftItem, e.target.value)}
        >
          <option value="" disabled>Select match</option>
          {shuffledRightItems.map((rightItem, rIdx) => (
            <option key={rIdx + selectedQuestion.id} value={rightItem}>
              {rightItem}
            </option>
          ))}
        </select>
      </div>
    ))}
  </div>
  </div>
</div>

      );
      
};

export default MatchingQuestion;
