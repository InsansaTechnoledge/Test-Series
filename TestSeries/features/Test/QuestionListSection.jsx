import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

const QuestionListSection = ({
  selectedQuestion,
  setSelectedQuestion,
  subjectSpecificQuestions,
 
}) => {
  if (!subjectSpecificQuestions || !selectedQuestion) {
    return <div>Loading...</div>
  }

  const { theme } = useTheme()
  const isDark = theme === 'dark';
  const [showAllQuestions, setShowAllQuestions] = useState(false);
 

  // Get all questions from all subjects in a flat array
  const allQuestions = [];
  let questionNumber = 1;

 
  
  Object.keys(subjectSpecificQuestions).forEach(subject => {
    subjectSpecificQuestions[subject].forEach(ques => {
      allQuestions.push({
        ...ques,
        displayNumber: questionNumber,
        subject: subject
      });
      questionNumber++;
    });
  });

  const [currentPage , setCurrentPage] = useState(1);
  const questionsPerPage = 15;
  const totalPages = Math.ceil(allQuestions.length/questionsPerPage);

  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const paginatedQuestions = allQuestions.slice(startIndex, endIndex);


  // Calculate status counts
  const statusCounts = {
    attempted: allQuestions.filter(q => q.status === 'answered').length,
    unattempted: allQuestions.filter(q => q.status === 'unanswered').length,
    markAsReview: allQuestions.filter(q => q.status === 'markedForReview' && !q.response).length,
    answeredAndMarkAsReview: allQuestions.filter(q => q.status === 'markedForReview' && q.response).length
  };

  return (
   


  // Your existing component with updated styling to match the image

<div className={`${isDark ? 'bg-gray-800' : 'bg-white'} max-w-4xl mx-auto m-8`}>
  {/* Header */}
  <div className="p-6 border-b border-gray-200">
    <h2 className={`text-xl font-semibold  mb-4  ${isDark ? 'text-gray-300' : 'text-gray-600'} `}>Question Overview</h2>
    
    {/* Legend */}
    <div className="flex flex-wrap gap-6 text-sm">           
      <div className="flex items-center gap-2">             
        <div className="w-4 h-4 rounded-full bg-green-500"></div>             
        <span className={` ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>               
          Attempted : {statusCounts.attempted}             
        </span>           
      </div>           
      <div className="flex items-center gap-2">             
        <div className="w-4 h-4 rounded-full bg-gray-400"></div>             
        <span className={` ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>               
          Unattempted : {statusCounts.unattempted}             
        </span>           
      </div>           
      <div className="flex items-center gap-2">             
        <div className="w-4 h-4 rounded-full bg-yellow-400"></div>             
        <span className={` ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>               
          Mark As Review : {statusCounts.markAsReview}             
        </span>           
      </div>           
      <div className="flex items-center gap-2">             
        <div className="w-4 h-4 rounded-full bg-orange-500"></div>             
        <span className={` ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>               
          Answered & Mark As Review : {statusCounts.answeredAndMarkAsReview}             
        </span>           
      </div>         
    </div>
  </div>        

  {/* Questions Grid Section */}       

  <div className='p-6'>


     <div className="grid grid-cols-5 gap-3 mb-4">
        {/* {(showAllQuestions ? allQuestions : allQuestions.slice(0, 15)).map((ques, i) => (
            <div key={i} className="flex justify-center">
                <button
                    onClick={() => setSelectedQuestion(ques)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                        ques.id === selectedQuestion.id
                            ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-700'
                            : ''
                    } ${
                        ques.status === 'unanswered'
                            ? 'bg-gray-600 text-gray-300 border border-gray-500'
                            : ques.status === 'answered'
                            ? 'bg-green-600 text-white'
                            : ques.status === 'markedForReview' && !ques.response
                            ? 'bg-yellow-500 text-gray-900'
                            : 'bg-orange-600 text-white'
                    }`}
                >
                    {ques.displayNumber}
                </button>
            </div>
        ))} */}

        {paginatedQuestions.map((ques, i) => (
          <div key={i} className="flex justify-center">
            <button
              onClick={() => setSelectedQuestion(ques)}
              className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                ques.id === selectedQuestion.id
                  ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-700'
                  : ''
              } ${
                ques.status === 'unanswered'
                  ? 'bg-gray-600 text-gray-300 border border-gray-500'
                  : ques.status === 'answered'
                  ? 'bg-green-600 text-white'
                  : ques.status === 'markedForReview' && !ques.response
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-orange-600 text-white'
              }`}
            >
              {ques.displayNumber}
            </button>
          </div>
        ))}

    </div>
    
        <div className="flex justify-center items-center gap-4 mt-4">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentPage === 1
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-500'
        }`}
      >
        Previous
      </button>

      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentPage === totalPages
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-500'
        }`}
      >
        Next
      </button>
    </div>

   </div>
</div>
  )
}

export default QuestionListSection