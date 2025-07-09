import React, { useEffect, useState } from 'react'
import ExamAnalysis from './Components/Exam/ExamAnalysis'
import useStudentExamResults from '../afterAuth/components/StudentSide/CompletedExams/useExamResults';
import { useUser } from '../../contexts/currentUserContext';
import WrongQuestionAnalysis from './Components/WrongQuestion/WrongQuestionAnalysis';
import LeaderBoard from './Components/LeaderBoard.jsx/LeaderBoard';
import { useExamManagement } from '../../hooks/UseExam';
import { getAllStudentData } from '../../utils/services/resultPage';
import { useTheme } from '../../hooks/useTheme';

const Analysis = () => {
    const {user} = useUser()
    const {results} = useStudentExamResults(user._id);
     const { exams } = useExamManagement()
  const [exam, setExam] = useState('')
  const [examData, setExamData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [examQuestions, setExamQuestions] = useState([])
  const {theme} = useTheme()
  
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
   
      <h1 className={`font-bold text-center py-8 text-4xl ${
                    theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                  }`}>Detailed Analysis</h1>

      <ExamAnalysis results={results}/>

                  <div className=" mb-8">
                <div className=" gap-3 mb-4">
 
                    <h1 className={`font-bold text-center py-8 text-4xl ${
                    theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                  }`}>Exam Wise Analysis</h1>
                </div>
               
            </div>
            <div className={`rounded-2xl shadow-lg p-6 mb-8 ${
    theme === 'light' ? 'bg-white' : 'bg-gray-800'
}`}>                   
    <label className={`block text-lg font-semibold mb-3 ${
        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
    }`}>                     
        Switch Exam Leaderboard                 
    </label>                 
    <select                     
        value={exam}                     
        onChange={(e) => setExam(e.target.value)}                     
        className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-colors text-lg ${
            theme === 'light' 
                ? 'border-gray-200 bg-white text-gray-900 focus:border-orange-500' 
                : 'border-gray-600 bg-gray-700 text-gray-200 focus:border-orange-400'
        }`}                     
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
