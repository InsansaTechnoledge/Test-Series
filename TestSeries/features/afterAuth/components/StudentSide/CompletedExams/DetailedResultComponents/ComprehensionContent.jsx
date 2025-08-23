import React from 'react';
import { getQuestionResult } from './resultCalculator';
import { getQuestionTypeLabel } from './questionsUtils';
import { QuestionContent } from './QuestionContent';

export const ComprehensionContent = ({ question, userAnswers, theme ,descriptiveResponses}) => (
  <div className="space-y-4">
    {question.sub_questions.map((subQuestion, subIndex) => {
      const subResult = getQuestionResult(subQuestion, userAnswers, theme, descriptiveResponses);
      const userAnswer = userAnswers[subQuestion.id];

      return (
        <div
          key={subQuestion.id}
          className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} border-l-4 ${
            subResult.status === "correct"
              ? "border-green-500"
              : subResult.status === "incorrect"
              ? "border-red-500"
              : subResult.status === "descriptive"
              ? "border-blue-500"
              : "border-gray-400"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${subResult.class}`}>
                <span className="mr-1">{subResult.icon}</span>
                {subResult.label}
              </span>
              <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Q{question.id}.{subIndex + 1}
              </span>
              <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                ({getQuestionTypeLabel(subQuestion.type)})
              </span>
            </div>
            <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              +{subQuestion.positive_marks} / -{subQuestion.negative_marks}
            </span>
          </div>

          <div className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-3`}>
            {subQuestion.question_text}
          </div>

          {/* Sub-question specific content */}
          <div className="pl-4">
            <QuestionContent
              question={subQuestion}
              userAnswers={userAnswers}
              result={subResult}
              theme={theme}
              descriptiveResponses={resultData.descriptiveResponses}
            />
          </div>
        </div>
      );
    })}
  </div>
);