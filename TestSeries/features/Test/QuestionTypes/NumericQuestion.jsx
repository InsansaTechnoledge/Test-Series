import React, { useEffect } from 'react';

const NumericalQuestion = ({ selectedQuestion, option, setOption }) => {
    
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
        <div>
            <h3 className='font-bold text-3xl'>
                Q{selectedQuestion.index}. {selectedQuestion.question_text}
            </h3>

            {selectedQuestion.image && (
                <img src={selectedQuestion.image} alt='img here' />
            )}

            <div className='mt-10'>
                <label htmlFor='numerical-answer' className='text-2xl mr-4'>
                    Enter your answer:
                </label>
                <input
                    type='number'
                    id='numerical-answer'
                    value={option || ''}
                    onChange={handleChange}
                    className='border-2 border-gray-300 rounded-md px-4 py-2 text-xl'
                />
            </div>
        </div>
    );
};

export default NumericalQuestion;
