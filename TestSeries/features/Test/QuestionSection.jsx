import React, { useEffect, useState } from 'react'
import MCQ from './QuestionTypes/MCQ'
import MSQ from './QuestionTypes/MSQ';
import FillInTheBlankQuestion from './QuestionTypes/FillInTheBlankQuestion';
import TrueFalseQuestion from './QuestionTypes/TrueFalseQuestion';
import MatchingQuestion from './QuestionTypes/MatchingQuestion';
import ComprehensionQuestion from './QuestionTypes/ComprehensionQuestion';
import NumericalQuestion from './QuestionTypes/NumericQuestion';

const QuestionSection = ({ setSelectedQuestion, selectedQuestion, selectedSubject, subjectSpecificQuestions, setSubjectSpecificQuestions }) => {

    const [option, setOption] = useState('');
    if (!selectedQuestion) {
        return (
            <div>Loading...</div>
        )
    }

    const isAnswered = (() => {
        const { question_type, sub_questions, left_items } = selectedQuestion;

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
                return typeof option === 'string' && !isNaN(option);

            case 'match': // option is object with keys matching left_items
                return (
                    typeof option === 'object' &&
                    option !== null &&
                    Object.keys(option).length === (left_items?.length || 0)
                );

            case 'comprehension': // option is object with subquestion answers
                return (
                    typeof option === 'object' &&
                    option !== null &&
                    Array.isArray(sub_questions) &&
                    sub_questions.every((subQ, i) => {
                        const subOption = option[subQ.id];
                        if (subQ.question_type === 'mcq') return typeof subOption === 'number';
                        if (subQ.question_type === 'msq') return Array.isArray(subOption) && subOption.length > 0;
                        if (subQ.question_type === 'fill') return typeof subOption === 'string' && subOption.trim() !== '';
                        if (subQ.question_type === 'tf') return typeof subOption === 'boolean';
                        if (subQ.question_type === 'numerical') return typeof subOption === 'number' && !isNaN(subOption);
                        return false;
                    })
                );

            default:
                return false;
        }
    })();





    const handlePrevious = () => {
        setSelectedQuestion(subjectSpecificQuestions[selectedSubject][selectedQuestion.index - 2])
    }

    const handleNext = () => {
        if (selectedQuestion.index != subjectSpecificQuestions[selectedSubject].length) {
            setSelectedQuestion(subjectSpecificQuestions[selectedSubject][selectedQuestion.index])
        }

        console.log(selectedQuestion);

        setSubjectSpecificQuestions(prev => ({
            ...prev,
            [selectedSubject]: prev[selectedSubject].map(q =>
                q.index === selectedQuestion.index
                    ? {
                        ...q,
                        response: option,
                        ...(isAnswered
                            ? q.status === 'markedForReview'
                                ? null
                                : { status: 'answered' }
                            : { status: 'unanswered' })
                    }
                    : q
            )
        }));
    }

    const handleMarkForReview = () => {
        setSubjectSpecificQuestions(prev => ({
            ...prev,
            [selectedSubject]: prev[selectedSubject].map(q =>
                q.index === selectedQuestion.index
                    ? {
                        ...q,
                        response: isAnswered ? option : null,
                        status: 'markedForReview'
                    }
                    : q
            )
        }));

        if (selectedQuestion.index != subjectSpecificQuestions[selectedSubject].length) {
            setSelectedQuestion(subjectSpecificQuestions[selectedSubject][selectedQuestion.index])
        }
    }

    const handleUnMarkForReview = () => {
        setSubjectSpecificQuestions(prev => ({
            ...prev,
            [selectedSubject]: prev[selectedSubject].map(q =>
                q.index === selectedQuestion.index
                    ? {
                        ...q,
                        ...(isAnswered ? { status: 'answered' } : { status: 'unanswered' })
                    }
                    : q
            )
        }));

        if (selectedQuestion.index != subjectSpecificQuestions[selectedSubject].length) {
            setSelectedQuestion(subjectSpecificQuestions[selectedSubject][selectedQuestion.index])
        }
    }

    const handleClearResponse = (selectedQuestion) => {
        const { question_type, sub_questions, left_items } = selectedQuestion;
        
        console.log(selectedQuestion);
        
        switch (question_type) {
            case 'mcq':
            case 'numerical':
                return null; // single index or number, reset to null

            case 'msq':
                return []; // empty array for multiple selections

            case 'fill':
                return ''; // reset string

            case 'tf':
                return null; // reset boolean to null (undefined also works)

            case 'match':
                return {}; // reset object

            case 'comprehension':
                return sub_questions.reduce((acc, _, index) => {
                    acc[_.id] = handleClearResponse(_); // recursive clear for each subquestion
                    return acc;
                }, {});

            default:
                return null;
        }
    };


    return (
        <>

            <div className='relative w-full flex flex-col justify-between space-y-5'>

                {/* Question display */}
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

                        default:
                            return null;
                    }
                })()}


                <div className=' w-full justify-between flex text-lg'>
                    {
                        selectedQuestion.index != 1
                            ?
                            <button
                                onClick={handlePrevious}
                                className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Previous</button>
                            :
                            <div>
                            </div>
                    }
                    <div className='space-x-5'>


                        <button
                            onClick={()=>setOption(handleClearResponse(selectedQuestion))}
                            className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Clear response</button>
                        {
                            subjectSpecificQuestions[selectedSubject][selectedQuestion.index - 1]?.status === 'markedForReview'
                                ?
                                <button
                                    onClick={handleUnMarkForReview}
                                    className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Unmark for review and next</button>
                                :
                                <button
                                    onClick={handleMarkForReview}
                                    className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Mark for review and next</button>

                        }
                        <button
                            onClick={handleNext}
                            className='px-4 py-2 bg-purple-600 text-white rounded-md font-semibold'>Next</button>


                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionSection