import React, { useEffect, useState } from 'react';
import MCQ from './QuestionTypes/MCQ';
import MSQ from './QuestionTypes/MSQ';
import FillInTheBlankQuestion from './QuestionTypes/FillInTheBlankQuestion';
import TrueFalseQuestion from './QuestionTypes/TrueFalseQuestion';
import MatchingQuestion from './QuestionTypes/MatchingQuestion';
import ComprehensionQuestion from './QuestionTypes/ComprehensionQuestion';
import NumericalQuestion from './QuestionTypes/NumericQuestion';
import CodeQuestion from './QuestionTypes/CodeQuestion';

const QuestionSection = ({ 
    setSelectedQuestion, 
    selectedQuestion, 
    selectedSubject, 
    subjectSpecificQuestions, 
    setSubjectSpecificQuestions 
}) => {
    const [option, setOption] = useState('');

    // If no question is selected, show a loading message
    if (!selectedQuestion) {
        return <div>Loading...</div>;
    }

    // Determine if the question has been answered
    const isAnswered = (() => {
        const { question_type, sub_questions } = selectedQuestion;

        switch (question_type) {
            case 'mcq': // option is index (number)
                return typeof option === 'number';
            case 'msq': // option is array of indices
                return Array.isArray(option) && option.length > 0;
            case 'fill': // option is string
                return typeof option === 'string' && option.trim() !== '';
            case 'tf': // option is boolean
                return typeof option === 'boolean';
            case 'numerical': // option is number
                return typeof option === 'string' && option.trim() !== '' && !isNaN(option);
            case 'match': // option is object with keys matching left_items
                return typeof option === 'object' && option !== null && Object.keys(option).length > 0;
            case 'comprehension': // option is object with subquestion answers
                return typeof option === 'object' && option !== null && sub_questions.every((subQ) => {
                    const subOption = option?.[subQ.id];
                    if (subQ.question_type === 'mcq') return typeof subOption === 'number';
                    if (subQ.question_type === 'msq') return Array.isArray(subOption) && subOption.length > 0;
                    if (subQ.question_type === 'fill') return typeof subOption === 'string' && subOption.trim() !== '';
                    if (subQ.question_type === 'tf') return typeof subOption === 'boolean';
                    if (subQ.question_type === 'numerical') return typeof subOption === 'string' && subOption.trim() !== '' && !isNaN(subOption);
                    return false;
                });
            case 'code': // option is string (code)
                return typeof option === 'string' && option.trim() !== '';
            default:
                return false;
        }
    })();

    // Navigation Handlers
    const handlePrevious = () => {
        setSelectedQuestion(subjectSpecificQuestions[selectedSubject][selectedQuestion.index - 2]);
    };

    const handleNext = () => {
        if (selectedQuestion.index !== subjectSpecificQuestions[selectedSubject].length) {
            setSelectedQuestion(subjectSpecificQuestions[selectedSubject][selectedQuestion.index]);
        }

        setSubjectSpecificQuestions((prev) => ({
            ...prev,
            [selectedSubject]: prev[selectedSubject].map((q) =>
                q.index === selectedQuestion.index
                    ? {
                          ...q,
                          response: option,
                          ...(isAnswered
                              ? q.status === 'markedForReview'
                                  ? null
                                  : { status: 'answered' }
                              : { status: 'unanswered' }),
                      }
                    : q
            ),
        }));
    };

    const handleMarkForReview = () => {
        setSubjectSpecificQuestions((prev) => ({
            ...prev,
            [selectedSubject]: prev[selectedSubject].map((q) =>
                q.index === selectedQuestion.index
                    ? {
                          ...q,
                          response: isAnswered ? option : null,
                          status: 'markedForReview',
                      }
                    : q
            ),
        }));

        if (selectedQuestion.index !== subjectSpecificQuestions[selectedSubject].length) {
            setSelectedQuestion(subjectSpecificQuestions[selectedSubject][selectedQuestion.index]);
        }
    };

    const handleUnMarkForReview = () => {
        setSubjectSpecificQuestions((prev) => ({
            ...prev,
            [selectedSubject]: prev[selectedSubject].map((q) =>
                q.index === selectedQuestion.index
                    ? {
                          ...q,
                          ...(isAnswered ? { status: 'answered' } : { status: 'unanswered' }),
                      }
                    : q
            ),
        }));

        if (selectedQuestion.index !== subjectSpecificQuestions[selectedSubject].length) {
            setSelectedQuestion(subjectSpecificQuestions[selectedSubject][selectedQuestion.index]);
        }
    };

    const handleClearResponse = (selectedQuestion) => {
        const { question_type, sub_questions } = selectedQuestion;

        switch (question_type) {
            case 'mcq':
            case 'numerical':
                return null;
            case 'msq':
                return [];
            case 'fill':
                return '';
            case 'tf':
                return null;
            case 'match':
                return {};
            case 'comprehension':
                return sub_questions.reduce((acc, subQ) => {
                    acc[subQ.id] = handleClearResponse(subQ);
                    return acc;
                }, {});
            case 'code':
                return '';
            default:
                return null;
        }
    };

    // Render the appropriate question component
    return (
        <div className="relative w-full flex flex-col justify-between gap-6">
            {/* Display the selected question */}
            {(() => {
                switch (selectedQuestion.question_type) {
                    case 'mcq':
                        return <MCQ selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
                    case 'msq':
                        return <MSQ selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
                    case 'fill':
                        return <FillInTheBlankQuestion selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
                    case 'tf':
                        return <TrueFalseQuestion selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
                    case 'match':
                        return <MatchingQuestion selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
                    case 'comprehension':
                        return <ComprehensionQuestion selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
                    case 'numerical':
                        return <NumericalQuestion selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
                    case 'code':
                        return <CodeQuestion selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
                    default:
                        return null;
                }
            })()}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 mt-6 text-base sm:text-lg">
                {/* Previous Button */}
                {selectedQuestion.index !== 1 ? (
                    <button
                        onClick={handlePrevious}
                        className="px-4 py-2 bg-blue-900 text-white rounded-md font-semibold shadow"
                    >
                        Previous
                    </button>
                ) : (
                    <div className="h-0 w-0 sm:w-24" /> // Keeps spacing on small screens
                )}

                {/* Action Buttons Group */}
                <div className="flex flex-wrap justify-center sm:justify-end gap-3">
                    <button
                        onClick={() => setOption(handleClearResponse(selectedQuestion))}
                        className="px-4 py-2 bg-gray-100 text-blue-900 border border-blue-900 rounded-md font-semibold hover:bg-gray-200"
                    >
                        Clear Response
                    </button>

                    {subjectSpecificQuestions[selectedSubject][selectedQuestion.index - 1]?.status === 'markedForReview' ? (
                        <button
                            onClick={handleUnMarkForReview}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md font-semibold hover:bg-yellow-600"
                        >
                            Unmark for Review & Next
                        </button>
                    ) : (
                        <button
                            onClick={handleMarkForReview}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md font-semibold hover:bg-yellow-600"
                        >
                            Mark for Review & Next
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionSection;
