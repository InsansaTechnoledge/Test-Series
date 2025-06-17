import React, { useMemo } from 'react'

const WrongQuestionAnalysis = ({ examData, currentStudentId ,examQuestions}) => {
  // Map to collect question-wise stats
  const questionStats = useMemo(() => {
    const stats = {}

    examData.forEach(student => {
      const wrongs = student.wrongAnswers || []

      wrongs.forEach(wrong => {
        const qid = wrong.questionId
        if (!stats[qid]) {
          stats[qid] = {
            questionId: qid,
            question: examQuestions[qid]?.question_text || 'Unknown Question',
            correctAnswer: examQuestions[qid]?.correct_answer||examQuestions[qid]?.correct_options || examQuestions[qid].correct_option || examQuestions[qid].is_true || examQuestions[qid].correct_pairs || 'N/A',
            totalWrong: 0,
            studentIds: new Set(),
          }
        }
        stats[qid].totalWrong += 1
        stats[qid].studentIds.add(student.studentId)
      })
    })

    const totalStudents = examData.length

    return Object.values(stats).map(stat => {
      const percentWrong = ((stat.totalWrong / totalStudents) * 100).toFixed(0)
      const isCurrentStudentWrong = stat.studentIds.has(currentStudentId)
      return {
        ...stat,
        totalStudents,
        percentWrong,
        isCurrentStudentWrong,
      }
    })
  }, [examData, currentStudentId])

  if (questionStats.length === 0) {
    return <p className="text-gray-500 text-center mt-6">No wrong answers found across students.</p>
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Per-Question Analysis</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="py-3 px-4 border-b">Question</th>
              <th className="py-3 px-4 border-b">Correct Answer</th>
              <th className="py-3 px-4 border-b">Your Response</th>
              <th className="py-3 px-4 border-b">Wrong Count</th>
              {/* <th className="py-3 px-4 border-b">Wrong %</th> */}
              <th className="py-3 px-4 border-b">Insight</th>
            </tr>
          </thead>
          <tbody>
            {questionStats.map((q, index) => (
              <tr key={index} className="text-sm text-gray-800">
                <td className="py-2 px-4 border-b">{q.question}</td>
                <td className="py-2 px-4 border-b text-green-600 font-semibold">{q.correctAnswer}</td>
                <td className="py-2 px-4 border-b text-red-600">{q.totalWrong}</td>
                <td className="py-2 px-4 border-b">{q.percentWrong}%</td>
                <td className="py-2 px-4 border-b text-blue-600">
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
  )
}

export default WrongQuestionAnalysis
