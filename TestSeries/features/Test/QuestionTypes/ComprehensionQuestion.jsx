import React, { useEffect, useState } from 'react';
import MCQ from './MCQ';
import MSQ from './MSQ';
import NumericalQuestion from './NumericQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import MatchingQuestion from './MatchingQuestion';
import FillInTheBlankQuestion from './FillInTheBlankQuestion';

const ComprehensionQuestion = ({ selectedQuestion, option, setOption }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initialize each sub-question response if not already set
        if (selectedQuestion && selectedQuestion.sub_questions) {
            const initialOptions = {};
            selectedQuestion.sub_questions.forEach((q) => {
                initialOptions[q.id] = q.response ?? (q.question_type === 'msq' ? [] : '');
            });
            setOption(initialOptions);
            setIsLoading(false);
        }
    }, [selectedQuestion]);

    const handleSubQuestionChange = (id, value) => {
        setOption((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    if(isLoading){
        return <div>Loading...</div>
    }

    const renderSubQuestion = (subQ) => {
        const commonProps = {
            selectedQuestion: subQ,
            option: option[subQ.id],
            setOption: (value) => handleSubQuestionChange(subQ.id, value),
        };

        switch (subQ.question_type) {
            case 'mcq':
                return <MCQ key={subQ.id} {...commonProps} />;
            case 'msq':
                return <MSQ key={subQ.id} {...commonProps} />;
            case 'numerical':
                return <NumericalQuestion key={subQ.id} {...commonProps} />;
            case 'tf':
                return <TrueFalseQuestion key={subQ.id} {...commonProps} />;
            case 'fill':
                return <FillInTheBlankQuestion key={subQ.id} {...commonProps} />;
            case 'match':
                return <MatchingQuestion key={subQ.id} {...commonProps} />;
            default:
                return <div key={subQ.id}>Unsupported question type</div>;
        }
    };

    return (
        <div className="space-y-10 p-6">
          {/* Comprehension Passage */}
          <div className="bg-yellow-50 p-6 rounded-xl shadow ring-1 ring-yellow-100">
            <h3 className="font-bold text-2xl sm:text-3xl text-yellow-800 mb-3 flex items-center gap-2">
               Comprehension
            </h3>
            <p className="text-lg sm:text-xl leading-relaxed text-gray-800 whitespace-pre-line">
              {selectedQuestion.passage}
            </p>
          </div>
      
          {/* Sub-Questions */}
          <div className="space-y-8">
            {selectedQuestion.sub_questions?.map(renderSubQuestion)}
          </div>
        </div>
      );
      
};

export default ComprehensionQuestion;
