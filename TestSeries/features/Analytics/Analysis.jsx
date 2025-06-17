import React from 'react'
import ExamAnalysis from './Components/Exam/ExamAnalysis'
import useStudentExamResults from '../afterAuth/components/StudentSide/CompletedExams/useExamResults';
import { useUser } from '../../contexts/currentUserContext';
import WrongQuestionAnalysis from './Components/WrongQuestion/WrongQuestionAnalysis';
import LeaderBoard from './Components/LeaderBoard.jsx/LeaderBoard';
const Analysis = () => {
    const {user} = useUser()
    const {results} = useStudentExamResults(user._id);

  return (
    <div>
      <h1 className='font-bold text-center py-8 text-gray-800 text-4xl'>Detailed Analysis</h1>

      <ExamAnalysis results={results}/>

      <WrongQuestionAnalysis/>

      <LeaderBoard/>
    </div>
  )
}

export default Analysis
