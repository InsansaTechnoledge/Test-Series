import React from 'react'
import StudentHero from '../components/StudentSide/StudentHero'
import StudentDetails from '../components/StudentSide/StudentDetails'
import AiWorkingSteps from '../components/StudentSide/AiWorkingSteps'
import FacultySection from '../components/StudentSide/FacultySection'
import SubjectCards from '../components/StudentSide/SubjectCards'
import ExamLinksComponent from '../components/StudentSide/ExamLinksComponent'
import { cards } from '../data/DisplayComponentData'
import ExamStatsDashboard from '../components/StudentSide/ExamStatsDashboard'
import HeadingUtil from '../utility/HeadingUtil';

const StudentLanding = () => {
    return (
        <>
        <div className='m-2 md:m-10 rounded-4xl overflow-hidden shadow-md'>
            <StudentHero />
            <div className=' py-8'>
                <StudentDetails />
            </div>
        </div>  
        <div className='my-12'>
                <HeadingUtil heading="Quick Link's to Exams" description="View and access all your examination resources"/>
                <ExamLinksComponent Data={cards} />
        </div>
                {/* <AiWorkingSteps /> */}
                {/* <div className="w-16 h-1 bg-blue-800 mx-auto mb-4 rounded"></div> */}
                <FacultySection />
                <SubjectCards />
                <ExamStatsDashboard/>
        </>
    )
}

export default StudentLanding
