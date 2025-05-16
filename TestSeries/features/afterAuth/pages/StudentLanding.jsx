import React from 'react'
import StudentHero from '../components/StudentSide/StudentHero'
import StudentDetails from '../components/StudentSide/StudentDetails'
import AiWorkingSteps from '../components/StudentSide/AiWorkingSteps'
import FacultySection from '../components/StudentSide/FacultySection'
import ExamLinksComponent from '../components/StudentSide/ExamLinksComponent'

const StudentLanding = () => {
    return (
        <>
        <div className='m-10 rounded-4xl overflow-hidden shadow-md'>
            <StudentHero />
            <div className='px-30 py-8'>
                <StudentDetails />
            </div>
        </div>
            <ExamLinksComponent/>

            <div className="w-16 h-1 bg-blue-800 mx-auto mb-4 rounded"></div>

                {/* <AiWorkingSteps /> */}
                {/* <div className="w-16 h-1 bg-blue-800 mx-auto mb-4 rounded"></div> */}
                <FacultySection />

        </>
    )
}

export default StudentLanding
