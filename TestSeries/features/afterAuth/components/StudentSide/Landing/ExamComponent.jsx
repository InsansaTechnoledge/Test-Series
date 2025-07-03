import { useEffect, useState } from 'react';
import LiveExamCard from '../UpcomingExams/LiveExamCard';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useNavigate } from 'react-router-dom';
import { useExamManagement } from '../../../../../hooks/UseExam';
import { useTheme } from '../../../../../hooks/useTheme';


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
  const ExamCard = ({ exam }) => {
    const isLive = exam.go_live === true || exam.go_live === "TRUE";
    
    return (
      <div 
        onClick={() => handleCardClick(exam)}
        className={`
          group cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
          rounded-xl border backdrop-blur-sm
          ${theme === 'light' 
            ? 'bg-white/80 border-gray-200 hover:border-blue-300 hover:shadow-blue-100' 
            : 'bg-gray-800/80 border-gray-700 hover:border-blue-600 hover:shadow-blue-900/20'
          }
        `}
      >
        <div className="p-6">
          <ExamBadge exam={exam} />
          
          <div className="mb-4">
            <h3 className={`
              text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}>
              {exam.title || exam.name || 'Exam Title'}
            </h3>
            
            {exam.description && (
              <p className={`
                text-sm leading-relaxed
                ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}
              `}>
                {exam.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-blue-900/30 text-blue-400'}
              `}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Total Marks
                </p>
                <p className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {exam.total_marks || exam.marks || '100'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${theme === 'light' ? 'bg-purple-50 text-purple-600' : 'bg-purple-900/30 text-purple-400'}
              `}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Duration
                </p>
                <p className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {exam.duration || '60'} mins
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(exam);
              }}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${theme === 'light' 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              View Details
            </button>

            {isLive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartTest(exam.id, exam.ai_proctored);
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Exam
              </button>
            )}
          </div>
        </div>
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
  
            <div className="">
              {liveExams && liveExams.length > 0 ? (
                liveExams.map((exam, idx) => (
                    <LiveExamCard 
                                    data={exam} 
                                    onStartTest={() => handleStartTest(exam.id, exam.ai_proctored)}
                                  />
                ))
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