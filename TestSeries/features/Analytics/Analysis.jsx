import React, { useEffect, useState } from 'react'
import ExamAnalysis from './Components/Exam/ExamAnalysis'
import useStudentExamResults from '../afterAuth/components/StudentSide/CompletedExams/useExamResults';
import { useUser } from '../../contexts/currentUserContext';
import WrongQuestionAnalysis from './Components/WrongQuestion/WrongQuestionAnalysis';
import LeaderBoard from './Components/LeaderBoard.jsx/LeaderBoard';
import { useExamManagement } from '../../hooks/UseExam';
import { getAllStudentData } from '../../utils/services/resultPage';

const Analysis = () => {
    const {user} = useUser()
    const {results} = useStudentExamResults(user._id);
     const { exams } = useExamManagement()
  const [exam, setExam] = useState('')
  const [examData, setExamData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [examQuestions, setExamQuestions] = useState([])

  
  useEffect(() => {
    if (exams.length > 0 && !exam) {
      setExam(exams[0].id)
    }
  }, [exams, exam])

  useEffect(() => {
    const getData = async () => {
      if (exam) {
        setLoading(true)
        setError('')
        try {
          const response = await getAllStudentData(exam)
          console.log('Exam Data Response:', response.data)
          const results = response.data.enrichedResults|| response || []
          setExamData(results);
          setExamQuestions(response.data.questionMap || [])
        } catch (error) {
          console.error('Failed to fetch leaderboard data:', error)
          setError('Failed to load leaderboard data. Please try again.')
        } finally {
          setLoading(false)
        }
      } else {
        setExamData([])
      }
    }

    getData()
  }, [exam])

  return (
    <div>
      <h1 className='font-bold text-center py-8 text-gray-800 text-4xl'>Detailed Analysis</h1>

      <ExamAnalysis results={results}/>

                  <div className=" mb-8">
                <div className=" gap-3 mb-4">
                    <h1 className="text-4xl font-bold text-center text-gray-800">Exam Wise Analysis</h1>
                </div>
               
            </div>

       <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">


                <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Switch Exam Leaderboard
                </label>
                <select
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-lg"
                    disabled={loading}
                >
                    {exams.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.name}
                        </option>
                    ))}
                </select>
            </div>

     <LeaderBoard
     exams={exams}
        exam={exam}
        setExam={setExam}
        examData={examData}
        loading={loading}
        error={error}
      />

      <WrongQuestionAnalysis examData={examData} 
      // currentStudentId={user.role=== 'student'? user._id :user._id}
      currentStudentId={user._id}
      examQuestions={examQuestions}/>
    </div>
  )
}

export default Analysis
