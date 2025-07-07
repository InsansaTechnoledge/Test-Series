import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useNavigate} from "react-router-dom";
import MCQ from "./QuestionTypes/MCQ";
import MatchingQuestion from "./QuestionTypes/MatchingQuestion";
import MSQ from "./QuestionTypes/MSQ";
import TrueFalseQuestion from "./QuestionTypes/TrueFalseQuestion";
import CodeQuestion from "./QuestionTypes/CodeQuestion";
import NumericalQuestion from "./QuestionTypes/NumericQuestion";
import FillInTheBlankQuestion from "./QuestionTypes/FillInTheBlankQuestion";
import SubmitModal from './utils/SubmitResultComponent';

const QuestionSection = ({ 
    setSelectedQuestion, 
    selectedQuestion, 
    selectedSubject, 
    subjectSpecificQuestions, 
    setSubjectSpecificQuestions,
    handleSubmitTest
}) => {
    const [option, setOption] = useState('');
    const { theme } = useTheme();
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();


   
    useEffect(() => {
        const savedData = sessionStorage.getItem('subjectSpecificQuestions');
        const savedQuestionId = localStorage.getItem('selectedQuestionId');
    
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setSubjectSpecificQuestions(parsed);
    
            if (savedQuestionId) {
                const allQs = [];
                Object.keys(parsed).forEach(subject => {
                    parsed[subject].forEach(ques => {
                        allQs.push({ ...ques, subject });
                    });
                });
                const restored = allQs.find(q => q.id === savedQuestionId);
                if (restored) {
                    setSelectedQuestion(restored);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (subjectSpecificQuestions) {
            sessionStorage.setItem('subjectSpecificQuestions', JSON.stringify(subjectSpecificQuestions));
        }
    }, [subjectSpecificQuestions]);

    useEffect(() => {
        if (selectedQuestion) {
            localStorage.setItem('selectedQuestionId', selectedQuestion.id);
        }
    }, [selectedQuestion]);

    useEffect(() => {
        if (submitted) {
            const timeout = setTimeout(() => {
                sessionStorage.removeItem('subjectSpecificQuestions')
                localStorage.removeItem('selectedQuestionId')
                navigate("/student/completed-exams");
            }, 2500);
            return () => clearTimeout(timeout);
        }
    }, [submitted, navigate]);


    if (!selectedQuestion) {
        return <div>Loading...</div>;
    }

    // Flatten all questions with continuous numbering
    const allQuestions = [];
    let questionCounter = 1;

    Object.keys(subjectSpecificQuestions).forEach(subject => {
        subjectSpecificQuestions[subject].forEach(ques => {
            allQuestions.push({
                ...ques,
                displayNumber: questionCounter,
                subject: subject,
                originalSubject: subject,
                originalIndex: ques.index
            });
            questionCounter++;
        });
    });

    const currentQuestionIndex = allQuestions.findIndex(q => q.id === selectedQuestion.id);

    const isAnswered = (() => {
        const { question_type, sub_questions } = selectedQuestion;

        switch (question_type) {
            case 'mcq':
                return typeof option === 'number';
            case 'msq':
                return Array.isArray(option) && option.length > 0;
            case 'fill':
                return typeof option === 'string' && option.trim() !== '';
            case 'tf':
                return typeof option === 'boolean';
            case 'numerical':
                return typeof option === 'string' && option.trim() !== '' && !isNaN(option);
            case 'match':
                return typeof option === 'object' && option !== null && Object.keys(option).length > 0;
            case 'comprehension':
                return typeof option === 'object' && option !== null && sub_questions.every((subQ) => {
                    const subOption = option?.[subQ.id];
                    if (subQ.question_type === 'mcq') return typeof subOption === 'number';
                    if (subQ.question_type === 'msq') return Array.isArray(subOption) && subOption.length > 0;
                    if (subQ.question_type === 'fill') return typeof subOption === 'string' && subOption.trim() !== '';
                    if (subQ.question_type === 'tf') return typeof subOption === 'boolean';
                    if (subQ.question_type === 'numerical') return typeof subOption === 'string' && subOption.trim() !== '' && !isNaN(subOption);
                    return false;
                });
            case 'code':
                return typeof option === 'string' && option.trim() !== '';
            default:
                return false;
        }
    })();

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setSelectedQuestion(allQuestions[currentQuestionIndex - 1]);
        }
    };

    const handleNext = () => {
        const currentQuestion = allQuestions[currentQuestionIndex];
        const originalSubject = currentQuestion.originalSubject;

        setSubjectSpecificQuestions((prev) => ({
            ...prev,
            [originalSubject]: prev[originalSubject].map((q) =>
                q.id === selectedQuestion.id
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

        if (currentQuestionIndex < allQuestions.length - 1) {
            setSelectedQuestion(allQuestions[currentQuestionIndex + 1]);
        }
    };

    const handleMarkForReview = () => {
        const currentQuestion = allQuestions[currentQuestionIndex];
        const originalSubject = currentQuestion.originalSubject;

        setSubjectSpecificQuestions((prev) => ({
            ...prev,
            [originalSubject]: prev[originalSubject].map((q) =>
                q.id === selectedQuestion.id
                    ? {
                        ...q,
                        response: isAnswered ? option : null,
                        status: 'markedForReview',
                    }
                    : q
            ),
        }));

        if (currentQuestionIndex < allQuestions.length - 1) {
            setSelectedQuestion(allQuestions[currentQuestionIndex + 1]);
        }
    };

    const handleUnMarkForReview = () => {
        const currentQuestion = allQuestions[currentQuestionIndex];
        const originalSubject = currentQuestion.originalSubject;

        setSubjectSpecificQuestions((prev) => ({
            ...prev,
            [originalSubject]: prev[originalSubject].map((q) =>
                q.id === selectedQuestion.id
                    ? {
                        ...q,
                        ...(isAnswered ? { status: 'answered' } : { status: 'unanswered' }),
                    }
                    : q
            ),
        }));

        if (currentQuestionIndex < allQuestions.length - 1) {
            setSelectedQuestion(allQuestions[currentQuestionIndex + 1]);
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

    const currentQuestion = allQuestions[currentQuestionIndex];
    const questionNumber = currentQuestion?.displayNumber || 1;
    const questionSubject = currentQuestion?.subject || 'Unknown';

    return (
        <div className={`relative w-full flex flex-col justify-between gap-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 py-1">
                <div className="flex items-center gap-4">
                    <div className={`px-5 py-1 rounded-full text-sm font-medium m-1 ${
                        theme === 'dark' 
                            ? 'bg-blue-900 text-blue-200 border border-blue-700' 
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                        {questionSubject}
                    </div>
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {questionNumber} of {allQuestions.length}
                </div>
            </div>

            <div className={`flex-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
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
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 text-base sm:text-lg p-8">
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 items-center order-2 sm:order-1">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex <= 0}
                        className={`px-4 py-2 rounded-md font-semibold border transition-all duration-200
                            ${theme === 'light'
                                ? currentQuestionIndex <= 0
                                    ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                                : currentQuestionIndex <= 0
                                    ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'
                                    : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'}
                        `}
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => setOption(handleClearResponse(selectedQuestion))}
                        className={`px-4 py-2 rounded-md font-semibold border transition-all duration-200
                            ${theme === 'light'
                                ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
                                : 'bg-blue-950 text-blue-200 border-blue-800 hover:bg-blue-900'}
                        `}
                    >
                        Clear Response
                    </button>

                    {selectedQuestion.status === 'markedForReview' ? (
                        <button
                            onClick={handleUnMarkForReview}
                            className={`px-4 py-2 rounded-md font-semibold transition-all duration-200
                                ${theme === 'light'
                                    ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                                    : 'bg-yellow-600 text-white hover:bg-yellow-700'}
                            `}
                        >
                            Unmark for Review & Next
                        </button>
                    ) : (
                        <button
                            onClick={handleMarkForReview}
                            className={`px-4 py-2 rounded-md font-semibold transition-all duration-200
                                ${theme === 'light'
                                    ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                                    : 'bg-yellow-600 text-white hover:bg-yellow-700'}
                            `}
                        >
                            Mark for Review & Next
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={currentQuestionIndex >= allQuestions.length - 1}
                        className={`px-4 py-2 rounded-md font-semibold border transition-all duration-200
                            ${theme === 'light'
                                ? currentQuestionIndex >= allQuestions.length - 1
                                    ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                                : currentQuestionIndex >= allQuestions.length - 1
                                    ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'
                                    : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'}
                        `}
                    >
                        Next
                    </button>
                </div>

                <div className="order-1 sm:order-2">
                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className={`px-6 py-2 rounded-md text-lg font-semibold shadow transition-all duration-200
                          ${theme === 'light'
                            ? 'bg-blue-900 text-white hover:bg-blue-800'
                            : 'bg-blue-700 text-white hover:bg-blue-600'}
                        `}
                    >
                        Submit Test
                    </button>
                </div>
            </div>

            {showSubmitModal && (
                <SubmitModal
                    setShowSubmitModal={setShowSubmitModal}
                    setSubmitted={setSubmitted}
                />
            )}

            {submitted && (
                <div className="fixed top-6 right-6 z-50 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out transition-all">
                    Your test has been submitted successfully!
                </div>
            )}
        </div>
    );
};

export default QuestionSection;
