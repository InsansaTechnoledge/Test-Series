import React, { useMemo } from 'react';
import { useTheme } from '../../../../hooks/useTheme';

const WrongQuestionAnalysis = ({ examData, currentStudentId, examQuestions }) => {
  const {theme} = useTheme()
  const questionStats = useMemo(() => {
    const stats = {};
    if (!Array.isArray(examData)) return [];

    examData.forEach(student => {
      const wrongs = student.wrongAnswers || [];

      wrongs.forEach(wrong => {
        const qid = wrong.questionId;
        if (!stats[qid]) {
          stats[qid] = {
            questionId: qid,
            question:
              examQuestions[qid]?.question_text ||
              (examQuestions[qid]?.question_type === 'match'
                ? 'Match the following'
                : examQuestions[qid]?.question_type === 'tf'
                ? examQuestions[qid]?.statement
                : 'N/A'),

            correctAnswer: (() => {
              const question = examQuestions[qid];
              if (!question) return 'N/A';

              const { question_type, correct_answer, correct_options, correct_option, is_true, correct_pairs, options } = question;

              if ((question_type === 'mcq' || question_type === 'msq') && Array.isArray(correct_options)) {
                return correct_options.map(i => options?.[i]).filter(Boolean).join(', ') || 'N/A';
              }
              if (question_type === 'mcq') {
                return options[correct_option];
              }
              if (question_type === 'tf') {
                return is_true === true ? 'True' : is_true === false ? 'False' : 'N/A';
              }
              if (question_type === 'match' && typeof correct_pairs === 'object') {
                return Object.entries(correct_pairs).map(([k, v]) => `${k}: ${v}`).join(', ');
              }
              return correct_answer || 'N/A';
            })(),

            yourResponse: (() => {
              const question = examQuestions[qid];
              if (!question) return 'N/A';

              const { question_type, options } = question;
              const response = wrong.response;

              if ((question_type === 'mcq' || question_type === 'msq') && Array.isArray(response)) {
                return response.map(i => options?.[i]).filter(Boolean).join(', ') || 'N/A';
              }
              if (question_type === 'tf') {
                return response === true ? 'True' : response === false ? 'False' : 'N/A';
              }
              if (question_type === 'match' && typeof response === 'object') {
                return Object.entries(response).map(([k, v]) => `${k}: ${v}`).join(', ');
              }
              return typeof response === 'string' || typeof response === 'number'
                ? response
                : JSON.stringify(response);
            })(),

            totalWrong: 0,
            studentIds: new Set(),
          };
        }
        stats[qid].totalWrong += 1;
        stats[qid].studentIds.add(student.studentId);
      });
    });

    const totalStudents = examData.length;

    return Object.values(stats).map(stat => {
      const percentWrong = ((stat.totalWrong / totalStudents) * 100).toFixed(0);
      const isCurrentStudentWrong = stat.studentIds.has(currentStudentId);
      return {
        ...stat,
        totalStudents,
        percentWrong,
        isCurrentStudentWrong,
      };
    });
  }, [examData, currentStudentId]);

  if (questionStats.length === 0) {
    return <p className="text-gray-500 text-center mt-6">No wrong answers found across students.</p>;
  }

  return (
<div className="mt-10 px-4 sm:px-8">
  <h2 className={`text-3xl font-bold mb-6 ${
    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
  }`}>
    Wrong Question Analysis
  </h2>
  <div className={`overflow-x-auto rounded-xl shadow-md border ${
    theme === 'dark' 
      ? 'border-gray-700 shadow-gray-900/50' 
      : 'border-gray-200 shadow-gray-200/50'
  }`}>
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className={`sticky top-0 z-10 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <tr className={`text-left ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
        }`}>
          <th className="py-3 px-6 font-semibold">Question</th>
          <th className="py-3 px-6 font-semibold">Correct Answer</th>
          <th className="py-3 px-6 font-semibold">Your Response</th>
          <th className="py-3 px-6 font-semibold">Wrong %</th>
          <th className="py-3 px-6 font-semibold">Insight</th>
        </tr>
      </thead>
      <tbody className={`divide-y ${
        theme === 'dark' 
          ? 'bg-gray-900 divide-gray-700' 
          : 'bg-white divide-gray-100'
      }`}>
        {questionStats.map((q, index) => (
          <tr key={index} className={`transition ${
            theme === 'dark' 
              ? 'hover:bg-gray-800' 
              : 'hover:bg-gray-50'
          }`}>
            <td className={`py-3 px-6 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {q.question}
            </td>
            <td className={`py-3 px-6 font-medium ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              {typeof q.correctAnswer === 'object' && !Array.isArray(q.correctAnswer) ? (
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(q.correctAnswer).map(([key, value]) => (
                    <li key={key}>{key} : {value}</li>
                  ))}
                </ul>
              ) : Array.isArray(q.correctAnswer) ? (
                q.correctAnswer.join(', ')
              ) : (
                q.correctAnswer
              )}
            </td>
            <td className={`py-3 px-6 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-500'
            }`}>
              {q.yourResponse}
            </td>
            <td className={`py-3 px-6 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {q.percentWrong}%
            </td>
            <td className={`py-3 px-6 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {q.isCurrentStudentWrong
                ? `You're among the ${q.percentWrong}% who answered this wrong`
                : `You got this right while ${q.percentWrong}% missed it`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
};

export default WrongQuestionAnalysis;
