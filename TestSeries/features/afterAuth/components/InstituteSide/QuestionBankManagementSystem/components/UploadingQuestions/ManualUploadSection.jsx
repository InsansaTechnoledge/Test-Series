import React, { useState } from 'react'
import ManualQuestionForm from '../../../ExamFlow/components/ManualQuestionsForm'
import QuestionPreview from '../../../ExamFlow/components/QuestionPreview'
import { handleSubmitExam } from './handleSubmit'

const ManualUploadSection = ({organizationId , questions , setQuestions}) => {
  const [isSubmitting , setIsSubmitting] = useState(false);

    
  return (
    <div>
      <ManualQuestionForm 
        setQuestions={setQuestions} 
        organizationId={organizationId}
      />

      <QuestionPreview
          questions={questions}
          setQuestions={setQuestions}
          examDetails={''}
      />  

       <button
              onClick={() => handleSubmitExam(questions, organizationId, setIsSubmitting)}
              disabled={isSubmitting || questions.length === 0}
              className={` mt-12 mx-auto w-full md:w-auto px-6 py-2 rounded-lg text-white font-semibold transition ${
                isSubmitting || questions.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Questions'}
        </button>
    </div>
  )
}

export default ManualUploadSection
