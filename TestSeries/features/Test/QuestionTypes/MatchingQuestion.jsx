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
        <div>
            <div className='flex justify-end mb-2'>
                <div className='text-green-700 font-bold  rounded-lg px-4 py-2'>Correct: +{selectedQuestion.positive_marks}</div>
                <div className='text-red-700 font-bold  rounded-lg px-4 py-2'>Wrong: -{selectedQuestion.negative_marks}</div>
                <div className='text-gray-700 font-bold  rounded-lg px-4 py-2'>Unattempted: 0</div>

            </div>
            <h3 className='font-bold text-3xl'>
                Q{selectedQuestion.index}. Match the following
            </h3>

            {selectedQuestion.image && (
                <img src={selectedQuestion.image} alt='img here' />
            )}

            <div className='mt-10 space-y-6'>
                {selectedQuestion.left_items.map((leftItem, idx) => (
                    <div key={idx+selectedQuestion.id} className='flex items-center space-x-4 text-xl'>
                        <span className='w-1/3 font-semibold'>{leftItem}</span>
                        <select
                            id={`match-${idx}-${selectedQuestion.id}`}
                            className='w-2/3 border border-gray-300 px-4 py-2 rounded'
                            value={option?.[leftItem] || ''}
                            onChange={(e) => handleSelectChange(leftItem, e.target.value)}
                        >
                            <option value='' disabled>Select match</option>
                            {shuffledRightItems.map((rightItem, rIdx) => (
                                <option key={rIdx+selectedQuestion.id} value={rightItem}>
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
