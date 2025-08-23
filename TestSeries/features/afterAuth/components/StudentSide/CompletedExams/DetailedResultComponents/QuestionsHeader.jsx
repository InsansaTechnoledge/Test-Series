import React from 'react';
import { getQuestionTypeLabel, getDifficultyBadgeClass } from './questionsUtils';

export const QuestionHeader = ({ question, index, result, isExpanded, onToggleExpand, theme, viewMode = "detailed" }) => (
    <div className="p-6">
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
                <QuestionBadges question={question} result={result} theme={theme} />
                <QuestionMeta question={question} index={index} theme={theme} />
                <QuestionPreview question={question} viewMode={viewMode} isExpanded={isExpanded} theme={theme} />
            </div>

            <ExpandButton
                isExpanded={isExpanded}
                onToggleExpand={onToggleExpand}
                theme={theme}
            />
        </div>
    </div>
);

const QuestionBadges = ({ question, result, theme }) => (

    <div className="flex items-center flex-wrap gap-2 mb-3">
        {console.log("Rendering QuestionBadges with question:", question, "and result:", result)}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.class}`}>
            <span className="mr-1">{result.icon}</span>
            {result.label}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyBadgeClass(question.difficulty, theme)}`}>
            {question.difficulty?.charAt(0).toUpperCase() + question.difficulty?.slice(1)}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === "dark" ? "bg-indigo-900 text-indigo-300 border-indigo-700" : "bg-indigo-100 text-indigo-800 border-indigo-200"} border`}>
            {getQuestionTypeLabel(question.type)}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === "dark" ? "bg-gray-800 text-gray-300 border-gray-600" : "bg-gray-100 text-gray-700 border-gray-200"} border`}>
            +{question.positive_marks} / -{question.negative_marks}
        </span>
        {question.type === "descriptive" && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === "dark" ? "bg-blue-900 text-blue-300 border-blue-700" : "bg-blue-100 text-blue-800 border-blue-200"} border`}>
                Evaluated Marks:{result.marks}
            </span>
        )}
    </div>
);

const QuestionMeta = ({ question, index, theme }) => (
    <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="font-medium">Q{index + 1}.</span>
        {question.subject && (
            <>
                <span className="mx-2">•</span>
                <span>{question.subject}</span>
            </>
        )}
        {question.chapter && (
            <>
                <span className="mx-2">•</span>
                <span>{question.chapter}</span>
            </>
        )}
    </div>
);

const QuestionPreview = ({ question, isExpanded, theme }) => {

    return (
        <div className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-4`}>
            {question.type === "comprehension" && question.passage && (
                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} mb-4`}>
                    <h4 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>
                        Passage:
                    </h4>
                    <div className="prose prose-sm max-w-none">
                        {question.passage.length > 200 && !isExpanded
                            ? `${question.passage.substring(0, 200)}...`
                            : question.passage}
                    </div>
                </div>
            )}

            {question.question_text && (
                <div className="prose prose-sm max-w-none">
                    {question.question_text.length > 150 && !isExpanded
                        ? `${question.question_text.substring(0, 150)}...`
                        : question.question_text}
                </div>
            )}

        </div>
    );
};

const ExpandButton = ({ isExpanded, onToggleExpand, theme }) => (
    <button
        onClick={onToggleExpand}
        className={`ml-4 p-2 rounded-lg ${theme === "dark" ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300" : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"} transition-colors duration-200`}
    >
        <svg
            className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    </button>
);