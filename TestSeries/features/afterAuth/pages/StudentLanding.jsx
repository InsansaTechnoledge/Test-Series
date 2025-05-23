import StudentHero from '../components/StudentSide/Landing/StudentHero'
import StudentDetails from '../components/StudentSide/Landing/StudentDetails'
import FacultySection from '../components/StudentSide/Landing/FacultySection'
import SubjectCards from '../components/StudentSide/Landing/SubjectCards'
import ExamLinksComponent from '../components/StudentSide/Landing/ExamLinksComponent'
import { cards } from '../data/DisplayComponentData'
import ExamStatsDashboard from '../components/StudentSide/Landing/ExamStatsDashboard'
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
                {/* <SubjectCards /> */}
                <ExamStatsDashboard/>
        </>
    )
}

export default StudentLanding
