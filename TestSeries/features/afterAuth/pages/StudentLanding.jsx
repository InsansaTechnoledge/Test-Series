import StudentHero from '../components/StudentSide/Landing/StudentHero';
import StudentDetails from '../components/StudentSide/Landing/StudentDetails';
import FacultySection from '../components/StudentSide/Landing/FacultySection';
import ExamLinksComponent from '../components/StudentSide/Landing/ExamLinksComponent';
import { cards } from '../data/DisplayComponentData';
import ExamStatsDashboard from '../components/StudentSide/Landing/ExamStatsDashboard';
import HeadingUtil from '../utility/HeadingUtil';
import BatchInfoCard from '../components/StudentSide/Landing/BatchInfoCard';
import ContestRegistrationPage from '../components/StudentSide/Coding-Contests/Registration/ContestRegistrationPage';
import RegistrationComponent from '../components/StudentSide/Coding-Contests/Registration/components/RegistrationComponent';
import ExamComponent from '../components/StudentSide/Landing/ExamComponent';
import { useTheme } from '../../../hooks/useTheme';
import RegisteredComponent from '../components/StudentSide/Coding-Contests/RegisteredAndScheduled/components/RegisteredComponent';
import LiveContestComponent from '../components/StudentSide/Coding-Contests/LiveContest/components/LiveContestComponent';
import OverviewAnalysisCard from "../components/StudentSide/Landing/OverviewAnalysisCard"
import Certificates from "../components/StudentSide/Landing/Certificates"
import YouTubeVideos from '../components/StudentSide/ClassroomContent/YouTubeVideos';
import { useEffect, useState } from 'react';
const StudentLanding = () => {
  const { theme } = useTheme();

  const [isMobile , setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },[])

  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-950'}`}>
      {/* Main Container */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Hero Section - Student Profile & Dashboard */}
        <section className={`${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-3xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} overflow-hidden`}>
          <div className="flex flex-col lg:flex-row">
            <div className={`w-full lg:w-1/3 ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-indigo-400 text-gray-950'}`}>
              <div className="p-6 lg:p-8">
                <StudentDetails />
              </div>
            </div>
            
            {/* Hero Content */}
            <div className={`w-full lg:w-2/3 ${theme === 'light' ? 'bg-white' : 'bg-gray-950'}`}>
              <div className="p-6 lg:p-8">
                <StudentHero />
              </div>
            </div>
          </div>
        </section>

        {/* Academic Information Section */}
        <section className={`${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-3xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} overflow-hidden`}>
          <div className="p-6 lg:p-8">
            <div className="flex items-center mb-6">
              <div className={`w-1 h-8 ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'} rounded-full mr-4`}></div>
              <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Academic Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-2xl p-6 border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
                <BatchInfoCard />
              </div>
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-2xl p-6 border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
                <ExamComponent />
              </div>
            </div>
          </div>
        </section>
        <section className={`${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-3xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} overflow-hidden`}>
{/* Certificates and Overview Analysis Section */}
<div className="m-4 md:m-10 rounded-3xl overflow-hidden">
  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
    
    {/* Certificates Section */}
    <div className={`w-full lg:w-[45%] ${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} shadow-lg overflow-hidden`}>
      <div className="p-6 lg:p-8">
        <div className="flex items-center mb-6">
          <div className={`w-1 h-8 ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'} rounded-full mr-4`}></div>
          <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Certificates</h3>
        </div>
        
        <div className="h-full">
          <Certificates />
        </div>
      </div>
    </div>

    {/* Overview Analysis Section */}
    <div className={`w-full lg:w-[50%] ${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} shadow-lg overflow-hidden`}>
      <div className="p-6 lg:p-8">
        <div className="flex items-center mb-6">
          <div className={`w-1 h-8 ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'} rounded-full mr-4`}></div>
          <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Performance Analysis</h3>
        </div>
        
        <div className="h-full">
          <OverviewAnalysisCard />
        </div>
      </div>
    </div>   
  </div>
</div>


          </section>





        {/* Registration & Contests Section */}
        <section className={`${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-3xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} overflow-hidden`}>
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`w-1 h-8 ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'} rounded-full mr-4`}></div>
                <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Coding Contests</h2>
              </div>

            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-2xl p-6 border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
                <RegistrationComponent />
              </div>
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-2xl p-6 border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
                <RegisteredComponent />
              </div>
              {
                !isMobile && (
                    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-2xl p-6 border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
                    <LiveContestComponent isMobile={isMobile} />
                  </div>
                )
              }
            </div>
          </div>
      
        </section>


        { /** classroom content */}
        <div className={`w-full  ${theme === 'light' ? 'bg-white' : 'bg-gray-950'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} shadow-lg overflow-hidden`}>
      <div className="p-6 lg:p-8">
        <div className="flex items-center mb-6">
          <div className={`w-1 h-8 ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'} rounded-full mr-4`}></div>
          <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Classroom Content</h3>
        </div>
        
        <div className="h-full">
          <YouTubeVideos/>
        </div>
      </div>
    </div>
        

      </div>
    </div>
  );
};

export default StudentLanding;