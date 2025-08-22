import React from 'react';
import { QuestionHeader } from './QuestionsHeader';
import { QuestionContent } from './QuestionContent';
import { getQuestionResult } from './resultCalculator';

export const QuestionCard = ({ question, index, userAnswers, isExpanded, onToggleExpand, theme }) => {
  const result = getQuestionResult(question, userAnswers, theme);

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200`}>
      {/* Question Header */}
      <QuestionHeader
        question={question}
        index={index}
        result={result}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        theme={theme}
      />

      {/* Expanded Content */}
      {isExpanded && (
        <div className={`border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"} p-6`}>
          <QuestionContent
            question={question}
            userAnswers={userAnswers}
            result={result}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
};
