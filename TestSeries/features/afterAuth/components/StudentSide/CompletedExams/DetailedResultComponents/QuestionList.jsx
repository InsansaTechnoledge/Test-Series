import React, { useState } from 'react';
import { QuestionCard } from './QuestionCard';

export const QuestionsList = ({ questions, userAnswers, theme }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const toggleExpand = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  if (questions.length === 0) {
    return (
      <div className={`${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} rounded-2xl border p-12 text-center shadow-sm`}>
        <svg className={`mx-auto h-16 w-16 ${theme === "dark" ? "text-gray-600" : "text-gray-400"} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"} mb-2`}>
          No questions found
        </h3>
        <p className={`${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
          Try adjusting your search terms or filters to find more questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={index}
          userAnswers={userAnswers}
          isExpanded={expandedQuestion === question.id}
          onToggleExpand={() => toggleExpand(question.id)}
          theme={theme}
        />
      ))}
    </div>
  );
};
