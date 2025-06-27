import React, { useMemo } from 'react';

const WrongQuestionAnalysis = ({ examData, currentStudentId, examQuestions }) => {
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Wrong Question Analysis</h2>
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-gray-700 text-left">
              <th className="py-3 px-6 font-semibold">Question</th>
              <th className="py-3 px-6 font-semibold">Correct Answer</th>
              <th className="py-3 px-6 font-semibold">Your Response</th>
              <th className="py-3 px-6 font-semibold">Wrong %</th>
              <th className="py-3 px-6 font-semibold">Insight</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {questionStats.map((q, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 text-gray-800">{q.question}</td>
                <td className="py-3 px-6 text-green-600 font-medium">
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
                <td className="py-3 px-6 text-red-500">{q.yourResponse}</td>
                <td className="py-3 px-6 text-gray-700">{q.percentWrong}%</td>
                <td className="py-3 px-6 text-blue-600">
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
