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
const StudentLanding = () => {
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
                <div className='m-4 md:m-10 rounded-4xl overflow-hidden shadow-md flex flex-col lg:flex-row'>

<BatchInfoCard/>
<ExamComponent/>
                </div>

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
