import React, { useEffect, useState } from 'react';

const MatchingQuestion = ({ selectedQuestion, option, setOption }) => {
    const [isLoading, setIsLoading] = useState(true);
    const shuffledRightItems = [...selectedQuestion.right_items].sort(()=> Math.random() - 0.5);

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
        <div className="space-y-6 p-6 ">
          {/* Marks Info */}
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
      
          {/* Question Heading */}
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Q{selectedQuestion.index}. Match the Following
          </h3>
      
        
          {/* Matching Pairs */}
          <div className="mt-6 space-y-4">
            {selectedQuestion.left_items.map((leftItem, idx) => (
              <div
                key={idx + selectedQuestion.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-lg sm:text-xl"
              >
                <span className="w-full sm:w-1/3 font-medium text-gray-700">{leftItem}</span>
                <select
                  id={`match-${idx}-${selectedQuestion.id}`}
                  className="w-full sm:w-2/3 border-2 border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
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
      );
      
};

export default MatchingQuestion;
