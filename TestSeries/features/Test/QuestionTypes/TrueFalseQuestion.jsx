import React, { useEffect } from 'react';

const TrueFalseQuestion = ({ selectedQuestion, option, setOption }) => {

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
        <div>
            <div className='flex justify-end mb-2'>
                <div className='text-green-700 font-bold  rounded-lg px-4 py-2'>Correct: +{selectedQuestion.positive_marks}</div>
                <div className='text-red-700 font-bold  rounded-lg px-4 py-2'>Wrong: -{selectedQuestion.negative_marks}</div>
                <div className='text-gray-700 font-bold  rounded-lg px-4 py-2'>Unattempted: 0</div>

            </div>
            <h3 className='font-bold text-3xl'>
                Q{selectedQuestion.index}. {selectedQuestion.statement}
            </h3>

            {selectedQuestion.image && (
                <img src={selectedQuestion.image} alt='img here' />
            )}

            <div className='mt-10 space-y-6 text-2xl'>
                <div className='flex items-center space-x-2'>
                    <input
                        type='radio'
                        id='true'
                        name='tf'
                        checked={option === true}
                        onChange={() => handleChange(true)}
                    />
                    <label htmlFor='true'>True</label>
                </div>
                <div className='flex items-center space-x-2'>
                    <input
                        type='radio'
                        id='false'
                        name='tf'
                        checked={option === false}
                        onChange={() => handleChange(false)}
                    />
                    <label htmlFor='false'>False</label>
                </div>
            </div>
        </div>
    );
};

export default TrueFalseQuestion;
