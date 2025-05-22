import React, { useEffect, useState } from 'react';

const MatchingQuestion = ({ selectedQuestion, option, setOption }) => {
    const [isLoading, setIsLoading] = useState(true);

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
            <h3 className='font-bold text-3xl'>
                Q{selectedQuestion.index}. Match the following
            </h3>

            {selectedQuestion.image && (
                <img src={selectedQuestion.image} alt='img here' />
            )}

            <div className='mt-10 space-y-6'>
                {selectedQuestion.left_items.map((leftItem, idx) => (
                    <div key={idx} className='flex items-center space-x-4 text-xl'>
                        <span className='w-1/3 font-semibold'>{leftItem}</span>
                        <select
                            className='w-2/3 border border-gray-300 px-4 py-2 rounded'
                            value={option?.[leftItem] || ''}
                            onChange={(e) => handleSelectChange(leftItem, e.target.value)}
                        >
                            <option value='' disabled>Select match</option>
                            {selectedQuestion.right_items.map((rightItem, rIdx) => (
                                <option key={rIdx} value={rightItem}>
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
