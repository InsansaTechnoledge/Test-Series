import React, { useEffect } from 'react';

const FillInTheBlankQuestion = ({ selectedQuestion, option, setOption }) => {

    useEffect(() => {
        if (selectedQuestion) {
            setOption(selectedQuestion.response || '');
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
                <input
                    type='text'
                    value={option || ''}
                    onChange={handleChange}
                    placeholder='Type your answer here'
                    className='border-2 border-gray-300 rounded-md px-4 py-2 text-xl w-full'
                />
            </div>
        </div>
    );
};

export default FillInTheBlankQuestion;
