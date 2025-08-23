import React from 'react';

export const MCQContent = ({ question, userAnswer, theme }) => (
  <div className="space-y-2">
    <h5 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
      Options:
    </h5>
    {question.options.map((option, optIndex) => {
      const optionLetter = String.fromCharCode(65 + optIndex);
      const isCorrect = question.type === "mcq" 
        ? question.correct_option === optionLetter
        : question.correct_options?.includes(optionLetter);
      const isSelected = question.type === "mcq"
        ? userAnswer === optionLetter
        : userAnswer?.includes(optionLetter);

      return (
        <div
          key={optIndex}
          className={`p-3 rounded-lg border ${
            isCorrect
              ? theme === "dark"
                ? "bg-green-900 border-green-700 text-green-200"
                : "bg-green-50 border-green-200 text-green-800"
              : isSelected
              ? theme === "dark"
                ? "bg-red-900 border-red-700 text-red-200"
                : "bg-red-50 border-red-200 text-red-800"
              : theme === "dark"
              ? "bg-gray-800 border-gray-700 text-gray-300"
              : "bg-gray-50 border-gray-200 text-gray-700"
          }`}
        >
          <div className="flex items-center">
            <span className="font-medium mr-2">{optionLetter}.</span>
            <span className="flex-1">{option}</span>
            {isCorrect && <span className="text-green-500 ml-2">✓</span>}
            {isSelected && !isCorrect && <span className="text-red-500 ml-2">✗</span>}
          </div>
        </div>
      );
    })}
  </div>
);