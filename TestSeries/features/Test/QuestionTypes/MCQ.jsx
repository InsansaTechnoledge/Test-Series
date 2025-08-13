import React, { useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import MarkingScheme from '../../constants/MarkingScheme';
import QuestionsAndImage from '../../constants/QuestionsAndImage';
import QuestionOptions from '../../constants/OptionsForMcqAndMsq';

const MCQ = ({ selectedQuestion, option, setOption }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (selectedQuestion) {
      // single-select expects a number (index) or null
      setOption(
        typeof selectedQuestion?.response === 'number'
          ? selectedQuestion.response
          : null
      );
    }
  }, [selectedQuestion, setOption]);

  if (!selectedQuestion) return <div>No question selected.</div>;

  return (
    <div
      className={`space-y-2 px-6 transition-all duration-300 ${
        theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
      }`}
    >
      <MarkingScheme selectedQuestion={selectedQuestion} theme={theme} />

      <QuestionsAndImage selectedQuestion={selectedQuestion} />

      <QuestionOptions
        mode="single"
        options={selectedQuestion.options || []}
        value={option}                 // number | null
        onChange={setOption}           // (newIndex:number) => void
        theme={theme}
        questionId={selectedQuestion.id}
      />
    </div>
  );
};

export default MCQ;
