import React from 'react'

const QuestionsAndImage = ({selectedQuestion}) => {
  return (
    <div>
    <h3 className="font-bold text-xl sm:text-xl leading-relaxed ">
      Q{selectedQuestion.index}. {selectedQuestion.question_text || selectedQuestion.statement || (
        <span className="text-red-500">No question text</span>
      )}
    </h3>

    {/* Optional Image */}
    {selectedQuestion.image && (
      <div className="mt-4">
        <img
          src={selectedQuestion.image}
          alt={`Question ${selectedQuestion.index} illustration`}
          className="rounded-lg shadow-md max-w-full h-auto"
        />
      </div>
    )}
  </div>
  )
}

export default QuestionsAndImage
