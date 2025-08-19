import React, { useState, useEffect, useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import LoadingTest from './LoadingTest'

const QuestionListSection = ({
  selectedQuestion,
  setSelectedQuestion,
  subjectSpecificQuestions,
  selectedSubject,
  setSelectedSubject,
  eventDetails
}) => {
  if (!subjectSpecificQuestions || !selectedQuestion) {
    return <div>Loading...</div>
  }

  const { theme } = useTheme()
  const isDark = theme === 'dark';
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 15;

  // Memoize allQuestions to prevent recalculation on every render
  const allQuestions = useMemo(() => {
    const questions = [];
    let questionNumber = 1;

    // Sort subjects for consistent ordering
    const sortedSubjects = Object.keys(subjectSpecificQuestions).sort();
    
    sortedSubjects.forEach(subject => {
      if (subjectSpecificQuestions[subject]) {
        subjectSpecificQuestions[subject].forEach(ques => {
          questions.push({
            ...ques,
            displayNumber: questionNumber,
            subject: subject,
            originalSubject: subject
          });
          questionNumber++;
        });
      }
    });

    return questions;
  }, [subjectSpecificQuestions]);

  const totalPages = Math.ceil(allQuestions.length / questionsPerPage);

  // Find current question index
  const currentQuestionIndex = useMemo(() => {
    return allQuestions.findIndex(q => q.id === selectedQuestion.id);
  }, [allQuestions, selectedQuestion.id]);

  // Update page when question changes from outside (but not from internal navigation)
  useEffect(() => {
    if (currentQuestionIndex !== -1) {
      const correctPage = Math.ceil((currentQuestionIndex + 1) / questionsPerPage);
      
      // Only update if the question is not on the current page
      const currentStartIndex = (currentPage - 1) * questionsPerPage;
      const currentEndIndex = currentStartIndex + questionsPerPage;
      
      if (currentQuestionIndex < currentStartIndex || currentQuestionIndex >= currentEndIndex) {
        setCurrentPage(correctPage);
      }
    }
  }, [currentQuestionIndex, questionsPerPage]); // Removed currentPage from dependencies

  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const paginatedQuestions = allQuestions.slice(startIndex, endIndex);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    return {
      attempted: allQuestions.filter(q => q.status === 'answered').length,
      unattempted: allQuestions.filter(q => q.status === 'unanswered').length,
      markAsReview: allQuestions.filter(q => q.status === 'markedForReview' && !q.response).length,
      answeredAndMarkAsReview: allQuestions.filter(q => q.status === 'markedForReview' && q.response).length
    };
  }, [allQuestions]);

  // Handle question click
  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    // Update selected subject if question belongs to different subject
    if (question.subject !== selectedSubject) {
      setSelectedSubject(question.subject);
    }
  };

  // Handle page navigation
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Jump to specific page
  const jumpToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} max-w-4xl mx-auto`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Question Overview
        </h2>
        
        {/* Subject Filter (Optional) */}
        {eventDetails?.subjects && eventDetails.subjects.length > 1 && (
          <div className="mb-4">
            <select
              value={selectedSubject}
              onChange={(e) => {
                const newSubject = e.target.value;
                setSelectedSubject(newSubject);
                
                // Find first question of new subject and select it
                const firstQuestionOfSubject = allQuestions.find(q => q.subject === newSubject);
                if (firstQuestionOfSubject) {
                  setSelectedQuestion(firstQuestionOfSubject);
                }
              }}
              className={`px-3 py-2 rounded border text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value="">All Subjects</option>
              {eventDetails.subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">           
          <div className="flex items-center gap-2">             
            <div className="w-4 h-4 rounded-full bg-green-500"></div>             
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>               
              Attempted: {statusCounts.attempted}             
            </span>           
          </div>           
          <div className="flex items-center gap-2">             
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>             
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>               
              Unattempted: {statusCounts.unattempted}             
            </span>           
          </div>           
          <div className="flex items-center gap-2">             
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>             
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>               
              Mark As Review: {statusCounts.markAsReview}             
            </span>           
          </div>           
          <div className="flex items-center gap-2">             
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>             
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>               
              Answered & Marked: {statusCounts.answeredAndMarkAsReview}             
            </span>           
          </div>         
        </div>
      </div>        

      {/* Questions Grid Section */}       
      <div className='p-4'>
        <div className="grid grid-cols-5 gap-3 mb-4">
          {paginatedQuestions.map((ques, i) => {
            const isSelected = ques.id === selectedQuestion.id;
            
            return (
              <div key={`${ques.id}-${ques.displayNumber}`} className="flex justify-center">
                <button
                  onClick={() => handleQuestionClick(ques)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-semibold transition-all duration-200 hover:scale-105 relative ${
                    isSelected
                      ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-gray-700'
                      : ''
                  } ${
                    ques.status === 'unanswered'
                      ? 'bg-gray-600 text-gray-300 border border-gray-500 hover:bg-gray-500'
                      : ques.status === 'answered'
                      ? 'bg-green-600 text-white hover:bg-green-500'
                      : ques.status === 'markedForReview' && !ques.response
                      ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                      : 'bg-orange-600 text-white hover:bg-orange-500'
                  }`}
                  title={`Question ${ques.displayNumber} - ${ques.subject} - ${ques.status}`}
                >
                  {ques.displayNumber}
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Enhanced Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
              currentPage === 1
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => jumpToPage(pageNumber)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-all ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
              currentPage === totalPages
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            Next
          </button>
        </div>

        {/* Current page info */}
        <div className="text-center mt-2">
          <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
            Page {currentPage} of {totalPages} • Showing questions {startIndex + 1}-{Math.min(endIndex, allQuestions.length)} of {allQuestions.length}
          </span>
        </div>
      </div>
    </div>
  )
}

export default QuestionListSection