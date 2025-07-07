import { useEffect, useState } from 'react';
import LiveExamCard from '../UpcomingExams/LiveExamCard';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useNavigate } from 'react-router-dom';
import { useExamManagement } from '../../../../../hooks/UseExam';
import { useTheme } from '../../../../../hooks/useTheme';
import LiveExamCardLanding from "./LiveExamCardLanding"

const ExamComponent = () => {
  const [liveExams, setLiveExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const navigate = useNavigate();
  const { exams } = useExamManagement();
  const { user } = useUser();
//   const userId = user?._id;
const {theme} = useTheme()
  console.log('exam', exams);

  useEffect(() => {
    if (!exams) return;

    console.log("test", exams);

    const upcoming = exams.filter(exam => exam.go_live === false || exam.go_live === "FALSE");
    const live = exams.filter(exam => exam.go_live === true || exam.go_live === "TRUE");

    setUpcomingExams(upcoming);
    setLiveExams(live);
  }, [JSON.stringify(exams)]);

  const isAiProctored = (exam) => {
    return exam.ai_proctored === true || 
           exam.ai_proctored === "TRUE" || 
           exam.ai_proctored === "true" || 
           exam.ai_proctored === 1 || 
           exam.ai_proctored === "1";
  };

 

  const ExamBadge = ({ exam }) => {
    const isProctored = isAiProctored(exam);
    
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '10px'
      }}>
        <span style={{
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: isProctored ? '#dc3545' : '#28a745',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          {isProctored ? 'AI-Proctored' : 'Standard'}
        </span>
        
      
      </div>
    );
  };

  return (
    
    <div>
        <div className="container mx-auto px-6 py-8">
          {/* Live Exams Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              
              <div>
                <h1 className={`text-3xl font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Live Exams
                </h1>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Active exams available for participation
                </p>
              </div>
            </div>
  
    
            
<div className="cursor-pointer h-full" onClick={() => navigate('/student/upcoming-exams')}>
  {liveExams && liveExams.length > 0 ? (
    <div className='!h-full'>
    

  
    <LiveExamCardLanding
       data={liveExams[0]} 
       onStartTest={() => handleStartTest(liveExams[0].id, liveExams[0].ai_proctored)}
    
    />
    </div>
  ) : (
    <div className={`
      col-span-full text-center py-12 rounded-xl border-2 border-dashed
      ${theme === 'light' 
        ? 'border-gray-300 bg-gray-50 text-gray-500' 
        : 'border-gray-600 bg-gray-800 text-gray-400'
      }
    `}>
      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h3 className="text-lg font-semibold mb-2">No Live Exams</h3>
      <p>There are no active exams at the moment. Check back later!</p>
    </div>
  )}
</div>











          </div>
  
         
        </div>
      </div>
  );
};

export default ExamComponent;