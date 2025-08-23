import React from 'react';

export const DescriptiveQuestionContent = ({ question, userAnswer, theme ,descriptiveResponses}) => (
  <div className="space-y-4">

    {/* User's Answer */}
    <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
      <h6 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-3`}>
        Your Answer:
      </h6>
      <div className={`${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} border rounded-lg p-4 min-h-[120px]`}>
        {userAnswer ? (
          <div className={`whitespace-pre-wrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {userAnswer}
          </div>
        ) : (
          <div className={`italic ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
            No answer provided
          </div>
        )}
      </div>
      {userAnswer && (
        <div className={`mt-2 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Word count: {userAnswer.split(/\s+/).filter(word => word.length > 0).length}
          {question.word_limit && userAnswer.split(/\s+/).filter(word => word.length > 0).length > question.word_limit && (
            <span className={`ml-2 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
              (Exceeds limit by {userAnswer.split(/\s+/).filter(word => word.length > 0).length - question.word_limit} words)
            </span>
          )}
        </div>
      )}
    </div>

    {/* Sample Answer (if available) */}
    {question.reference_answer && (
      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-green-900 bg-opacity-20 border border-green-800" : "bg-green-50 border border-green-200"}`}>
        <h6 className={`text-sm font-medium ${theme === "dark" ? "text-green-300" : "text-green-800"} mb-3 flex items-center`}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Sample Answer:
        </h6>
        <div className={`whitespace-pre-wrap ${theme === "dark" ? "text-green-200" : "text-green-800"}`}>
          {question.reference_answer}
        </div>
      </div>
    )}

    {/* Evaluation Notice */}
    <span className={`text-lg ${theme === "dark" ? "text-yellow-300" : "text-yellow-800"}`}>
      Marks Awarded:
      {descriptiveResponses[question.id]?.obtainedMarks || "No evaluation available"}
    </span>
    <div className={`p-3x text-sm`}>
      <div className="flex items-center">
    
        <span className={`text-sm ${theme === "dark" ? "text-yellow-300" : "text-yellow-800"}`}>
          This descriptive answer has been evaluated by instructors.
        </span>
      </div>
    </div>
  </div>
);