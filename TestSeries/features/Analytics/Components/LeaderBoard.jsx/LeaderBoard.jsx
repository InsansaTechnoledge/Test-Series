import React, { useEffect, useState } from 'react'
import { getResultDetail } from '../../../../utils/services/resultPage'
import { useExams } from '../../../../hooks/UseExam'

const LeaderBoard = () => {
    const {exams } = useExams()

    console.log(exams)

    const [ExamData ,  setExamData] = useState([])

    useEffect(() => {
        const getData = async () => {
            const data = await getResultDetail()
        }
    },[])
  return (
    <div>
        <h1 className="text-3xl font-bold my-6 text-gray-800">Exam Wise LeaderBoard</h1>
    </div>
  )
}

export default LeaderBoard
