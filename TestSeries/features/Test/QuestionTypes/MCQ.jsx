import React, { useEffect } from 'react';

const MCQ = ({ selectedQuestion, option, setOption }) => {

  useEffect(() => {
    if (selectedQuestion) {
      setOption(selectedQuestion.response ?? null);
    }
  }, [selectedQuestion, setOption]);

  if (!selectedQuestion) {
    return <div>No question selected.</div>;
  }

  const handleChangeOption = (newOption) => {
    setOption(newOption);
  };

  return (
    <div>
      <div className='flex justify-end mb-2 gap-4'>
        <div className='text-green-700 font-bold rounded-lg px-4 py-2'>
          Correct: +{selectedQuestion.positive_marks}
        </div>
        <div className='text-red-700 font-bold rounded-lg px-4 py-2'>
          Wrong: -{selectedQuestion.negative_marks}
        </div>
        <div className='text-gray-700 font-bold rounded-lg px-4 py-2'>
          Unattempted: 0
        </div>
      </div>

      <h3 className='font-bold text-3xl'>
        Q{selectedQuestion.index}. {selectedQuestion.question_text || 'No question text'}
      </h3>

      {selectedQuestion.image && (
        <img
          src={selectedQuestion.image}
          alt={`Question ${selectedQuestion.index} illustration`}
          className='mt-4 max-w-full rounded shadow'
        />
      )}

      <div className='mt-10 space-y-4'>
        {Array.isArray(selectedQuestion.options) && selectedQuestion.options.length > 0 ? (
          selectedQuestion.options.map((opt, idx) => (
            <div key={idx} className='flex text-2xl space-x-2 items-center'>
              <input
                type='radio'
                id={`option-${idx}-${selectedQuestion.id}`}
                checked={option === idx}
                onChange={() => handleChangeOption(idx)}
                name={`option-${selectedQuestion.id}`}
                value={opt}
                className='accent-blue-500'
              />
              <label htmlFor={`option-${idx}-${selectedQuestion.id}`} className='cursor-pointer'>
                {opt}
              </label>
            </div>
          ))
        ) : (
          <div className='text-red-500 font-bold'>
            No options available for this question.
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQ;
