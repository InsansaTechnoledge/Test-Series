import React, { useEffect, useState } from 'react'
import { getResultDetail } from '../../../../utils/services/resultPage'
import { useExamManagement } from '../../../../hooks/UseExam'

const LeaderBoard = () => {
    const { exams } = useExamManagement()

    const [exam, setExam] = useState('')
    const [examData, setExamData] = useState([])

    useEffect(() => {
        const getData = async () => {
            if (exam) {
                try {
                    const data = await getResultDetail(exam , true); 
                    console.log("t" , data)
                    // setExamData(data);
                } catch (error) {
                    console.error('Failed to fetch leaderboard data:', error)
                }
            }
        }

        getData();
    }, [exam])

    return (
        <div >
            <h1 className="text-3xl font-bold my-6 text-gray-800">Exam Wise LeaderBoard</h1>
            <span className="block mb-2 text-gray-600">Choose Exam to See LeaderBoard</span>

            <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="mb-6 p-2 border rounded"
            >
                <option value="">-- Select Exam --</option>
                {exams.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.name}
                    </option>
                ))}
            </select>

            {examData.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Leaderboard:</h2>
                    <ul className="list-disc pl-5">
                        {examData.map((entry, index) => (
                            <li key={index}>
                                {entry.studentName} - {entry.score} marks
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default LeaderBoard
