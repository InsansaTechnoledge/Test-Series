import React, { useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import MarkingScheme from '../../constants/MarkingScheme';
import QuestionsAndImage from '../../constants/QuestionsAndImage';
import AnswerInput from '../../constants/AnswerInput';

const FillInTheBlankQuestion = ({ selectedQuestion, option, setOption }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (selectedQuestion) {
      setOption(selectedQuestion.response || '');
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
          label="Your Answer"
          placeholder="Type your answer here..."
          theme={theme}
          variant="text"
          // Example validation (optional):
          // validate={(val) => val.trim() ? null : "Answer cannot be empty"}
        />
      </div>
    </div>
  );
};

export default FillInTheBlankQuestion;
