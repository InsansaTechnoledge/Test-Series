import React from 'react';
import { transformResultCorrectAnswer } from './transformers';

export const AnswerSummary = ({ question, userAnswer, theme }) => {
   
  const renderAnswer = (answer, question = null) => {
 console.log("Rendering Answer Summary for question:🥳🥳🥳🥳🥳🥳🥳🥳", question.id,answer);
    if (answer === null || answer === undefined || answer === "") {
      return <span className="italic">Not answered</span>;
    }

    // For MCQ - show the option text instead of index
    if (question?.type === "mcq") {
      if (question.options && question.options[answer]) {
        return question.options[answer];
      }
      return answer; // fallback to index if options not available
    }

    // For MSQ - show multiple option texts instead of indices
    if (question?.type === "msq") {
      if (Array.isArray(answer) && question.options) {
        return answer.map((index, i) => (
          <span key={i}>
            {question.options[index] || index}
            {i < answer.length - 1 && ", "}
          </span>
        ));
      }
      return Array.isArray(answer) ? answer.join(", ") : answer;
    }

    // For True/False
    if (question?.type === "tf") {
      return answer === true ? "True" : answer === false ? "False" : answer;
    }

    // For Match type - show the pairs in a readable format
    if (question?.type === "match") {
      if (typeof answer === "object" && answer !== null) {
        return Object.entries(answer)
          .map(([left, right]) => `${left} → ${right}`)
          .join(", ");
      }
    }

    // For other types (fill, numerical, etc.)
    return answer.toString();
  };

  return (
    <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h6 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-1`}>
            Your Answer:
          </h6>
          <div className={`text-sm ${userAnswer ? theme === "dark" ? "text-gray-300" : "text-gray-700" : theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>

            {renderAnswer(userAnswer, question)}
          </div>
        </div>
        <div>
          <h6 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-1`}>
            Correct Answer:
          </h6>
          <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {console.log("Rendering Correct Answer:", transformResultCorrectAnswer(question))}
            {renderAnswer(transformResultCorrectAnswer(question), question)}
          </div>
        </div>
        <div>
          <h6 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-1`}>
            Explanation:
          </h6>
          <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {question.explanation}
          </div>
        </div>
      </div>
    </div>
  );
};
