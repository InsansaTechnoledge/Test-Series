import React from 'react'
import StudentHero from '../components/StudentSide/StudentHero'
import StudentDetails from '../components/StudentSide/StudentDetails'
import AiWorkingSteps from '../components/StudentSide/AiWorkingSteps'
import FacultySection from '../components/StudentSide/FacultySection'

const StudentLanding = () => {
    return (
        <div className='m-4 rounded-4xl overflow-hidden shadow-md'>
            <StudentHero />
            <div className='px-30 py-8'>
                <StudentDetails />
                <AiWorkingSteps />
                <FacultySection />
            </div>
        </div>
    )
}

export default StudentLanding
