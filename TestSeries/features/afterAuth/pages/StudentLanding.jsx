import StudentHero from '../components/StudentSide/Landing/StudentHero'
import StudentDetails from '../components/StudentSide/Landing/StudentDetails'
import FacultySection from '../components/StudentSide/Landing/FacultySection'
// import SubjectCards from '../components/StudentSide/Landing/SubjectCards'
import ExamLinksComponent from '../components/StudentSide/Landing/ExamLinksComponent'
import { cards } from '../data/DisplayComponentData'
import ExamStatsDashboard from '../components/StudentSide/Landing/ExamStatsDashboard'
import HeadingUtil from '../utility/HeadingUtil';
import BatchInfoCard from "../components/StudentSide/Landing/BatchInfoCard"
import ExamComponent from '../components/StudentSide/Landing/ExamComponent'
// import Certificates from '../components/StudentSide/Landing/Certificates'
// import LeaderBoardCard from '../components/StudentSide/Landing/LeaderBoardCard'


// import React, { useEffect, useState } from 'react'
// // import ExamAnalysis from '../components/StudentSide/'

// import useStudentExamResults from '../../../features/afterAuth/components/StudentSide/CompletedExams/useExamResults';
// import { useUser } from '../../../contexts/currentUserContext';
// // import WrongQuestionAnalysis from './Components/WrongQuestion/WrongQuestionAnalysis';
// // import LeaderBoard from '../';
// import { useExamManagement } from '../../../hooks/UseExam';
// import { getAllStudentData } from '../../../utils/services/resultPage';



const StudentLanding = () => {
//     const {user} = useUser()
// const {results} = useStudentExamResults(user._id);
//  const { exams } = useExamManagement()
// const [exam, setExam] = useState('')
// const [examData, setExamData] = useState([])
// const [loading, setLoading] = useState(false)
// const [error, setError] = useState('')
// const [examQuestions, setExamQuestions] = useState([])


// useEffect(() => {
// if (exams.length > 0 && !exam) {
//   setExam(exams[0].id)
// }
// }, [exams, exam])

// useEffect(() => {
// const getData = async () => {
//   if (exam) {
//     setLoading(true)
//     setError('')
//     try {
//       const response = await getAllStudentData(exam)
//       const results = response.data.enrichedResults|| response || []
//       setExamData(results);
//       setExamQuestions(response.data.questionMap || [])
//     } catch (error) {
//       console.error('Failed to fetch leaderboard data:', error)
//       setError('Failed to load leaderboard data. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   } else {
//     setExamData([])
//   }
// }

// getData()
// }, [exam])
    return (
        <>






            <div>
                {/* /student and profiles */}
                <div className='m-4 md:m-10 rounded-4xl overflow-hidden shadow-md flex flex-col lg:flex-row'>

                    <div className='w-full lg:w-1/3 flex-shrink-0'>
                        <StudentDetails />
                    </div>


                    <div className='w-full lg:w-2/3 flex-grow'>
                        <StudentHero />
                    </div>
                </div>
           


                <div className='m-4 md:m-10 rounded-4xl overflow-hidden shadow-md flex flex-col lg:flex-row min-h-[600px]'>
 
      <div className='w-full lg:w-1/2 flex-shrink-0'>
        <BatchInfoCard />
      </div>
      
    
      <div className='w-full lg:w-1/2 flex-shrink-0'>
        <ExamComponent />
      </div>
    </div>
{/* 
<Certificates/>
<LeaderBoardCard  

exams={exams}
   exam={exam}
   setExam={setExam}
   examData={examData}
   loading={loading}
   error={error}
 /> */}

            </div>


            <div className='my-12'>
                <HeadingUtil heading="Quick Link's to Exams" description="View and access all your examination resources" />
                <ExamLinksComponent Data={cards} />
            </div>
            {/* <AiWorkingSteps /> */}
            {/* <div className="w-16 h-1 bg-blue-800 mx-auto mb-4 rounded"></div> */}
            <FacultySection />
            {/* <SubjectCards /> */}
            <ExamStatsDashboard />
        </>
    )
}

export default StudentLanding
