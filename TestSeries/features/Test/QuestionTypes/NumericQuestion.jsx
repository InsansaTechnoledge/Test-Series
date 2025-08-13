import React, { useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import MarkingScheme from '../../constants/MarkingScheme';
import QuestionsAndImage from '../../constants/QuestionsAndImage';
import AnswerInput from '../../constants/AnswerInput';

const NumericalQuestion = ({ selectedQuestion, option, setOption }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (selectedQuestion) {
      setOption(selectedQuestion.response?.toString() || '');
    }
  }, [selectedQuestion, setOption]);

  if (!selectedQuestion) return null;

  return (
    <div
      className={`space-y-6 px-6 transition-all duration-300 ${
        theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
      }`}
    >
      <MarkingScheme selectedQuestion={selectedQuestion} theme={theme} />

      <div>
        <QuestionsAndImage selectedQuestion={selectedQuestion} />

        <AnswerInput
          value={option || ''}
          onChange={setOption}
          questionId={selectedQuestion.id}
          label="Enter your answer:"
          placeholder="e.g. 42.98 or 21"
          theme={theme}
          variant="numeric"
          // Optional: restrict very long numeric answers
          // maxLength={20}
          // Optional: custom validation message
          // validate={(val) => /^-?\d*\.?\d*$/.test(val) ? null : "Enter a valid number"}
          // Narrow input on wide screens (matches your previous sm:w-1/2)
          className="sm:w-1/2"
          inputClassName="py-2 text-lg"
        />
      </div>
    </div>
  );
};

export default NumericalQuestion;
