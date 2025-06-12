import React, { useEffect, useState } from 'react'
import CorrectAnswerTag from './QuestionNumberTag.jsx/CorrectAnswerTag'
import UnattemptedTag from './QuestionNumberTag.jsx/UnattemptedTag'
import MarkedForReview from './QuestionNumberTag.jsx/MarkedForReview'
import AnsweredAndMarkedForReview from './QuestionNumberTag.jsx/AnsweredAndMarkedForReview'
import TestSubjectSelectionBar from './TestSubjectSelectionBar'

const QuestionListSection = ({
  eventDetails,
  selectedQuestion,
  setSelectedQuestion,
  subjectSpecificQuestions,
  setSubjectSpecificQuestions,
  selectedSubject,
  setSelectedSubject
}) => {
  const [subjectSelectionVisible, setSubjectSelectionVisible] = useState(false)

  if (!subjectSpecificQuestions || !selectedQuestion) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-4 px-2">
      
      {/* LEFT SIDE */}
      <div className="lg:w-1/3 flex flex-col space-y-4">
        {!subjectSelectionVisible ? (
          <>
            <div className="p-2 border-2 rounded-md text-center text-sm font-semibold">
              {eventDetails.subjects.find(subject => subject === selectedSubject)}
            </div>
            <button
              onClick={() => setSubjectSelectionVisible(true)}
              className="px-4 py-2 bg-blue-900 text-white text-sm rounded-md shadow w-fit"
            >
              Select Subject
            </button>
          </>
        ) : (
          <TestSubjectSelectionBar
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            eventDetails={eventDetails}
            setSubjectSelectionVisible={setSubjectSelectionVisible}
          />
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col space-y-4 overflow-y-auto max-h-[80vh] border rounded-md p-4 bg-white shadow">
        
        {/* Status Tags Row */}
        <div className="flex flex-wrap justify-start gap-4 text-xs sm:text-sm">
          <CorrectAnswerTag number={1} />
          <UnattemptedTag number={1} />
          <MarkedForReview number={1} />
          <AnsweredAndMarkedForReview number={1} />
        </div>

        {/* Question Grid */}
        <div className="grid grid-cols-5 ">
        {subjectSpecificQuestions[selectedSubject].map((ques, i) => (
            <button
            key={i + 1}
            onClick={() => setSelectedQuestion(ques)}
            className="w-full h-full flex items-center justify-center"
            >
            {ques.status === 'unanswered' ? (
                <UnattemptedTag number={i + 1} noText={true} current={ques.id === selectedQuestion.id} />
            ) : ques.status === 'answered' ? (
                <CorrectAnswerTag number={i + 1} noText={true} current={ques.id === selectedQuestion.id} />
            ) : ques.status === 'markedForReview' && !ques.response ? (
                <MarkedForReview number={i + 1} noText={true} current={ques.id === selectedQuestion.id} />
            ) : (
                <AnsweredAndMarkedForReview number={i + 1} noText={true} current={ques.id === selectedQuestion.id} />
            )}
            </button>
        ))}
        </div>

      </div>
    </div>
  )
}

export default QuestionListSection
