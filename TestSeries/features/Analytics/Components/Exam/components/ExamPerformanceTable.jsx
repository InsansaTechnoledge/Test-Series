import React from 'react';

export const ExamPerformanceTable = ({ examStats }) => {
  const getScoreColorClass = (score) => {
    return score > 0 ? 'text-green-600' : 
           score === 0 ? 'text-yellow-600' : 'text-red-600';
  };

  const getScoreBadgeClass = (score) => {
    return score > 0 
      ? 'bg-green-100 text-green-800' 
      : score === 0 
        ? 'bg-yellow-100 text-yellow-800' 
        : 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Exam Performance Summary</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Exam Name</th>
              <th className="text-left py-2 px-4">Attempts</th>
              <th className="text-left py-2 px-4">Avg Score</th>
              <th className="text-left py-2 px-4">Best Score</th>
              <th className="text-left py-2 px-4">Worst Score</th>
              <th className="text-left py-2 px-4">All Attempts</th>
            </tr>
          </thead>
          <tbody>
            {examStats?.map((exam, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 px-4 font-medium">{exam.examName}</td>
                <td className="py-2 px-4">{exam.attempts}</td>
                <td className="py-2 px-4">
                  <span className={`font-semibold ${getScoreColorClass(parseFloat(exam.avgScore))}`}>
                    {exam.avgScore}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <span className={`font-semibold ${getScoreColorClass(exam.bestScore)}`}>
                    {exam.bestScore}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <span className={`font-semibold ${getScoreColorClass(exam.worstScore)}`}>
                    {exam.worstScore}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <div className="flex flex-wrap gap-1">
                    {exam.allAttempts?.map((attempt, attemptIndex) => (
                      <span
                        key={attemptIndex}
                        className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${getScoreBadgeClass(attempt.score)}`}
                        title={`Score: ${attempt.score} | Date: ${attempt.date} | Time: ${attempt.time}`}
                      >
                        {attempt.score}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};