import React, { useEffect, useState } from 'react';

const MSQ = ({ selectedQuestion, option, setOption}) => {
    

    useEffect(() => {
            if (selectedQuestion) {
                setOption(selectedQuestion.response || []);
            }
        }, [selectedQuestion])

   

    const handleToggleOption = (optionIndex) => {
        if (option.includes(optionIndex)) {
            // Deselect if already selected
            setOption(option.filter(index => index !== optionIndex));
        } else {
            // Add if not already selected
            setOption([...option, optionIndex]);
        }
    };

    return (
        <div>
            <div className='flex justify-end mb-2'>
                <div className='text-green-700 font-bold  rounded-lg px-4 py-2'>Correct: +{selectedQuestion.positive_marks}</div>
                <div className='text-red-700 font-bold  rounded-lg px-4 py-2'>Wrong: -{selectedQuestion.negative_marks}</div>
                <div className='text-gray-700 font-bold  rounded-lg px-4 py-2'>Unattempted: 0</div>

            </div>
            <h3 className='font-bold text-3xl'>
                Q{selectedQuestion.index}. {selectedQuestion.question_text}
            </h3>

            {selectedQuestion.image && (
                <img src={selectedQuestion.image} alt='img here' />
            )}

            <div className='mt-10 space-y-10'>
                {selectedQuestion.options.map((optionText, index) => (
                    <div key={index} className='flex text-2xl space-x-2'>
                        <input
                            type='checkbox'
                            id={`option-${index}`}
                            checked={Array.isArray(option) && option.includes(index)}
                            onChange={() => handleToggleOption(index)}
                        />
                        <label htmlFor={`option-${index}`}>{optionText}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MSQ;
