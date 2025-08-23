import React from 'react';
import { DescriptiveQuestionContent } from './DescriptiveQuestionsContent';
import { MCQContent } from './MCQContent';
import { MatchContent } from './MatchContent';
import { ComprehensionContent } from './ComprehensionContent';
import { AnswerSummary } from './AnswerSummary';

export const QuestionContent = ({ question, userAnswers, result, theme ,descriptiveResponses}) => (
  <div>
    {/* Passage for comprehension */}
    {question.type === "comprehension" && question.passage && (
      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} mb-6`}>
        <h4 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>
          Passage:
        </h4>
        <div className={`prose prose-sm max-w-none ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          {question.passage}
        </div>
      </div>
    )}



    {/* Question type specific content */}
    {question.type === "descriptive" && (
      <DescriptiveQuestionContent 
        question={question} 
        userAnswer={userAnswers[question.id]} 
        theme={theme} 
        descriptiveResponses={descriptiveResponses}
      />
    )}
    
    {question.type === "comprehension" && Array.isArray(question.sub_questions) && (
      <ComprehensionContent 
        question={question} 
        userAnswers={userAnswers} 
        theme={theme} 
        descriptiveResponses={descriptiveResponses}
      />
    )}
    
    {(question.type === "mcq" || question.type === "msq") && (
      <MCQContent 
        question={question} 
        userAnswer={userAnswers[question.id]} 
        theme={theme} 
      />
    )}
    
    {question.type === "match" && (
      <MatchContent 
        question={question} 
        userAnswer={userAnswers[question.id]} 
        theme={theme} 
      />
    )}
    
    {!["comprehension", "descriptive"].includes(question.type) && (
      <AnswerSummary 
        question={question} 
        userAnswer={userAnswers[question.id]} 
        theme={theme} 
      />
    )}

    {/* Explanation */}
    {question.explanation && (
      <div className={`mt-6 p-4 rounded-lg ${theme === "dark" ? "bg-blue-900 bg-opacity-20 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}>
        <h4 className={`text-sm font-medium ${theme === "dark" ? "text-blue-300" : "text-blue-800"} mb-2 flex items-center`}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Explanation
        </h4>
        <div className={`prose prose-sm max-w-none ${theme === "dark" ? "text-blue-200" : "text-blue-800"}`}>
          {question.explanation}
        </div>
      </div>
    )}
  </div>
);