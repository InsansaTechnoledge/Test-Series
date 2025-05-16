import React from 'react'
import StudentHero from '../components/StudentSide/StudentHero'
import AiWorkingSteps from '../components/StudentSide/AiWorkingSteps'
import FacultySection from '../components/StudentSide/FacultySection'

const StudentLanding = () => {
  return (
    <div>
      <StudentHero/>
      <AiWorkingSteps/>
      <div className="w-16 h-1 bg-blue-800 mx-auto mb-4 rounded"></div>
      <FacultySection/>
    </div>
  )
}

export default StudentLanding
