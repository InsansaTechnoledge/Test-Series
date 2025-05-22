import React, { useEffect, useState } from 'react'

const MCQ = ({ selectedQuestion, option, setOption}) => {
    

    useEffect(() => {
        if (selectedQuestion) {
            setOption(selectedQuestion.response);
        }
    }, [selectedQuestion])

    const handleChangeOption = (option) => {
        setOption(option);

    }
    

    return (
        <div>
            <h3 className='font-bold text-3xl '>Q{selectedQuestion.index}. {selectedQuestion.question_text}</h3>
            {
                selectedQuestion.image
                    ?
                    <img src='' alt='img here' />
                    :
                    null
            }
            <div className='mt-10 space-y-10'>
                <div className='flex text-2xl space-x-2'>
                    <input type='radio' id='A'
                        checked={option === 0}
                        onChange={(e) => handleChangeOption(0)}
                        name='option' value={selectedQuestion.options[0]} />
                    <label htmlFor='A'>{selectedQuestion.options[0]}</label>
                </div>
                <div className='flex text-2xl space-x-2'>
                    <input type='radio' id='B'
                        checked={option === 1}
                        onChange={(e) => handleChangeOption(1)}
                        name='option' value={selectedQuestion.options[1]} />
                    <label htmlFor='B'>{selectedQuestion.options[1]}</label>
                </div>
                <div className='flex text-2xl space-x-2'>
                    <input type='radio' id='C'
                        checked={option === 2}
                        onChange={(e) => handleChangeOption(2)}
                        name='option' value={selectedQuestion.options[2]} />
                    <label htmlFor='C'>{selectedQuestion.options[2]}</label>
                </div>
                <div className='flex text-2xl space-x-2'>
                    <input type='radio' id='D'
                        checked={option === 3}
                        onChange={(e) => handleChangeOption(3)}
                        name='option' value={selectedQuestion.options[3]} />
                    <label htmlFor='D'>{selectedQuestion.options[3]}</label>
                </div>
            </div>
        </div>
    )
}

export default MCQ