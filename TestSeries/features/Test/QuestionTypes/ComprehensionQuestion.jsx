import React, { useEffect, useState } from 'react';
import MCQ from './MCQ';
import MSQ from './MSQ';
import NumericalQuestion from './NumericQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import MatchingQuestion from './MatchingQuestion';
import FillInTheBlankQuestion from './FillInTheBlankQuestion';
import { useTheme } from '../../../hooks/useTheme';

const ComprehensionQuestion = ({ selectedQuestion, option, setOption }) => {
    const [isLoading, setIsLoading] = useState(true);
    const {theme} = useTheme()
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
       
        <div className={`space-y-10 p-6 rounded-xl transition-all duration-300
  ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}
`}>
  {/* Comprehension Passage */}
  <div className={`p-6 rounded-xl shadow-md ring-1 transition-all duration-200
    ${theme === 'light'
      ? 'bg-yellow-50 ring-yellow-100 text-yellow-900'
      : 'bg-yellow-900 ring-yellow-700 text-yellow-100'}
  `}>
    <h3 className="font-bold text-xl sm:text-2xl mb-3">
      Comprehension
    </h3>
    <p className={`text-base sm:text-lg leading-relaxed whitespace-pre-line
      ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}
    `}>
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
