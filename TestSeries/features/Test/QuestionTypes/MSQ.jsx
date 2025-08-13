import React, { useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import QuestionsAndImage from '../../constants/QuestionsAndImage';
import MarkingScheme from '../../constants/MarkingScheme';
import QuestionOptions from '../../constants/OptionsForMcqAndMsq';

const MSQ = ({ selectedQuestion, option, setOption }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (selectedQuestion) {
      // multi-select expects an array of indices
      const initial = Array.isArray(selectedQuestion?.response)
        ? selectedQuestion.response
        : [];
      setOption(initial);
    }
  }, [selectedQuestion, setOption]);

  if (!selectedQuestion) return <div>No question selected.</div>;

  return (
    <div
      className={`space-y-6 px-6 transition-all duration-300 ${
        theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
      }`}
    >
      <MarkingScheme selectedQuestion={selectedQuestion} theme={theme} />

      <QuestionsAndImage selectedQuestion={selectedQuestion} />

      <QuestionOptions
        mode="multi"
        options={selectedQuestion.options || []}
        value={option}                 // number[]
        onChange={setOption}           // (newArray:number[]) => void
        theme={theme}
        questionId={selectedQuestion.id}
      />
    </div>
  );
};

export default MSQ;
