import { useEffect, useState } from 'react';
import HeadingUtil from '../../../utility/HeadingUtil';
import NeedHelpComponent from '../../InstituteSide/components/NeedHelpComponent';
import UpcomingExamCard from './UpcomingExamCard';
import LiveExamCard from './LiveExamCard';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useNavigate } from 'react-router-dom';
import { useExamManagement } from '../../../../../hooks/UseExam';
import StartButton from './StartButton';
import AppRequiredMessage from './AppRequiredMessage';
import { useTheme } from '../../../../../hooks/useTheme';

const UpcomingExam = () => {
  const [liveExams, setLiveExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [isElectronEnv, setIsElectronEnv] = useState(false);
  const [proctorStatus, setProctorStatus] = useState('idle'); // idle, starting, running, stopping
  const [currentExamId, setCurrentExamId] = useState(null); // Track which exam is being proctored
  const navigate = useNavigate();
  const { exams } = useExamManagement();
  const { user } = useUser();
  const userId = user?._id;

  console.log('exam', exams);

  const question = "How To assign role groups to users ?";
  const answer = "Use the created role groups to assign permissions to users in your add user section.";

  // Check if we're in Electron environment
  useEffect(() => {
    const checkElectronEnv = () => {
      // Check if we have access to electron APIs through preload
      const isElectron = window.electronAPI !== undefined;
      setIsElectronEnv(isElectron);
      console.log('🔍 Electron environment detected:', isElectron);
    };

    checkElectronEnv();

    // Listen for proctor events if in Electron
    if (window.electronAPI) {
      // Listen for proctor logs
      window.electronAPI.onProctorLog((message) => {
        console.log('📋 Proctor Log:', message);
      });

      // Listen for proctor events
      window.electronAPI.onProctorEvent((event) => {
        console.log('🎯 Proctor Event:', event);
      });

      // Listen for proctor warnings/anomalies
      window.electronAPI.onProctorWarning((warning) => {
        console.log('⚠️ Proctor Warning:', warning);
        // You can show warnings to the user here
        showProctorWarning(warning);
      });
    }

    // Cleanup listeners on unmount
    return () => {
      if (window.electronAPI && window.electronAPI.removeAllListeners) {
        window.electronAPI.removeAllListeners('proctor-log');
        window.electronAPI.removeAllListeners('proctor-event');
        window.electronAPI.removeAllListeners('proctor-warning');
      }
    };
  }, []);

  useEffect(() => {
    if (!exams) return;

    console.log("test", exams);

    const upcoming = exams.filter(exam => exam.go_live === false || exam.go_live === "FALSE");
    const live = exams.filter(exam => exam.go_live === true || exam.go_live === "TRUE");

    setUpcomingExams(upcoming);
    setLiveExams(live);
  }, [JSON.stringify(exams)]);

  const showProctorWarning = (warning) => {
    // Create a warning notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff6b6b;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 350px;
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">⚠️ Proctoring Alert</div>
      <div style="font-size: 14px;">${warning.message || 'Suspicious activity detected'}</div>
      <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">
        Type: ${warning.eventType || 'anomaly'}
      </div>
    `;

    document.body.appendChild(notification);

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  };

  const startProctorEngine = async (examId, eventId = 'default') => {
    if (!window.electronAPI) {
      console.error('❌ Electron API not available');
      return false;
    }

    setProctorStatus('starting');
    setCurrentExamId(examId);
    
    try {
      console.log('🚀 Starting proctor engine for exam:', examId);
      
      const result = await window.electronAPI.startProctorEngineAsync({
        userId,
        examId,
        eventId
      });

      if (result.success) {
        setProctorStatus('running');
        console.log('✅ Proctor engine started successfully');
        return true;
      } else {
        setProctorStatus('idle');
        setCurrentExamId(null);
        console.error('❌ Failed to start proctor engine:', result.message);
        alert(`Failed to start proctor: ${result.message}`);
        return false;
      }
    } catch (error) {
      setProctorStatus('idle');
      setCurrentExamId(null);
      console.error('❌ Error starting proctor engine:', error);
      alert(`Error starting proctor: ${error.message}`);
      return false;
    }
  };

  const stopProctorEngine = async () => {
    if (!window.electronAPI) {
      console.error('❌ Electron API not available');
      return;
    }

    setProctorStatus('stopping');
    
    try {
      const result = await window.electronAPI.stopProctorEngineAsync();
      
      if (result.success) {
        setProctorStatus('idle');
        setCurrentExamId(null);
        console.log('✅ Proctor engine stopped successfully');
      } else {
        console.error('❌ Failed to stop proctor engine:', result.message);
      }
    } catch (error) {
      console.error('❌ Error stopping proctor engine:', error);
    }
  };

  // Helper function to check if exam is AI-proctored
  const isAiProctored = (exam) => {
    return exam.ai_proctored === true || 
           exam.ai_proctored === "TRUE" || 
           exam.ai_proctored === "true" || 
           exam.ai_proctored === 1 || 
           exam.ai_proctored === "1";
  };

  // Helper function to check if start button should be enabled
  const canStartExam = (exam) => {
    const isProctored = isAiProctored(exam);
    
    // If exam is AI-proctored, user must be in Electron environment
    if (isProctored && !isElectronEnv) {
      return false;
    }
    
    return true;
  };

  // Helper function to get start button text and style
  const getStartButtonConfig = (exam) => {
    const isProctored = isAiProctored(exam);
    const canStart = canStartExam(exam);
    
    if (isProctored && !isElectronEnv) {
      return {
        text: "Requires Desktop App",
        disabled: true,
        style: {
          backgroundColor: '#6c757d',
          cursor: 'not-allowed',
          opacity: 0.6
        }
      };
    }
    
    if (isProctored && isElectronEnv) {
      return {
        text: "Start AI-Proctored Exam",
        disabled: false,
        style: {
          backgroundColor: '#dc3545',
          color: 'white'
        }
      };
    }
    
    return {
      text: "Start Exam",
      disabled: false,
      style: {
        backgroundColor: '#28a745',
        color: 'white'
      }
    };
  };

  const handleStartTest = async (examId, isAiProctoredFlag) => {
    const eventId = 'default';
  
    if (!userId || !examId) {
      alert('Missing required information to start the exam');
      return;
    }
  
    console.log("Launching exam:", examId, "AI Proctored:", isAiProctoredFlag);
  
    // Check if the exam is AI-proctored (handle different data types)
    const isProctored = isAiProctoredFlag === true || 
                       isAiProctoredFlag === "TRUE" || 
                       isAiProctoredFlag === "true" || 
                       isAiProctoredFlag === 1 || 
                       isAiProctoredFlag === "1";
  
    if (isProctored) {
      // For AI-proctored exams in Electron environment
      if (isElectronEnv) {
        console.log("AI-proctored exam in Electron environment - starting proctor engine");
        
        // Start proctor engine first
        const proctorStarted = await startProctorEngine(examId, eventId);
        
        if (proctorStarted) {
          // Show proctor started message
          showProctorStartedMessage();
          
          // Wait a moment for proctor to initialize, then navigate to exam
          setTimeout(() => {
            navigate(`/student/test?userId=${userId}&examId=${examId}&eventId=${eventId}&proctored=true`);
          }, 2000);
        } else {
          // If proctor failed to start, ask user if they want to continue without proctoring
          const shouldContinue = confirm(
            'Proctor engine failed to start. Would you like to continue with the exam in browser mode? (Note: This may not be allowed for this exam)'
          );
          
          if (shouldContinue) {
            handleStartTestFallback(examId);
          }
        }
      } else {
        // Not in Electron environment - show error for AI-proctored exams
        alert('AI-proctored exams require the desktop application. Please use the Evalvo Proctor desktop app to take this exam.');
      }
    } else {
      // For non-AI-proctored exams, launch directly in browser mode
      // This applies to both Electron and web environments
      console.log("Non-AI proctored exam - launching directly without proctor engine");
      handleStartTestFallback(examId);
    }
  };

  const showProctorStartedMessage = () => {
    const overlay = document.createElement('div');
    overlay.id = 'proctor-starting';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-size: 18px;
    `;
    overlay.innerHTML = `
      <div style="text-align: center;">
        <div style="margin-bottom: 20px;">🛡️ AI Proctor Engine Started</div>
        <div style="font-size: 14px; opacity: 0.8;">Initializing exam environment...</div>
        <div style="margin-top: 15px;">
          <div class="spinner" style="
            border: 4px solid #f3f3f3;
            border-top: 4px solid #28a745;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
            margin: 0 auto;
          "></div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(overlay);
    
    // Remove after 2 seconds
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 2000);
  };
  const {theme} = useTheme()
  const handleStartTestFallback = (examId) => {
    const userId = user?._id;
    const eventId = 'default';
    navigate(`/student/test?userId=${userId}&examId=${examId}&eventId=${eventId}`);
  };

  //   const isProctored = isAiProctored(exam);
    
  //   return (
  //     <div style={{
  //       display: 'inline-flex',
  //       alignItems: 'center',
  //       gap: '8px',
  //       marginBottom: '10px'
  //     }}>
  //       <span style={{
  //         padding: '4px 12px',
  //         borderRadius: '20px',
  //         fontSize: '12px',
  //         fontWeight: 'bold',
  //         backgroundColor: isProctored ? '#dc3545' : '#28a745',
  //         color: 'white',
  //         display: 'flex',
  //         alignItems: 'center',
  //         gap: '5px'
  //       }}>
  //         {isProctored ? 'AI-Proctored' : 'Standard'}
  //       </span>
        
  //       {isProctored && !isElectronEnv && (
  //         <span style={{
  //           padding: '4px 8px',
  //           borderRadius: '15px',
  //           fontSize: '11px',
  //           backgroundColor: '#ffc107',
  //           color: '#000',
  //           fontWeight: 'bold'
  //         }}>
  //            Evalvo App Required
  //         </span>
  //       )}
  //     </div>
  //   );
  // };
  const ExamBadge = ({ exam, theme }) => {
    const isProctored = isAiProctored(exam);
         
    return (
      <div className="inline-flex items-center gap-3 mb-4">
        <span className={`
          px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2
          transition-all duration-300 shadow-lg backdrop-blur-sm
          ${isProctored 
            ? theme === 'light'
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200/50 border border-red-300/30' 
              : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-900/50 border border-red-500/30'
            : theme === 'light'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200/50 border border-emerald-300/30'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-emerald-900/50 border border-emerald-500/30'
          }
        `}>
          <div className={`
            w-2 h-2 rounded-full animate-pulse
            ${isProctored 
              ? 'bg-red-200' 
              : 'bg-emerald-200'
            }
          `}></div>
          {isProctored ? 'AI-Proctored' : 'Standard'}
        </span>
                 
        {isProctored && !isElectronEnv && (
          <span className={`
            px-3 py-1.5 rounded-full text-xs font-bold
            transition-all duration-300 shadow-lg backdrop-blur-sm
            animate-pulse
            ${theme === 'light'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 shadow-amber-200/60 border border-amber-300/40'
              : 'bg-gradient-to-r from-amber-500 to-yellow-600 text-gray-900 shadow-amber-900/60 border border-amber-400/40'
            }
          `}>
            Evalvo App Required
          </span>
        )}
      </div>
    );
  };

  useEffect(() => {
    return () => {
      if (proctorStatus === 'running') {
        stopProctorEngine();
      }
    };
  }, []);

  return (

<div>
<div className={`transition-opacity duration-300 ${proctorStatus === 'starting' ? 'opacity-60' : 'opacity-100'}`}>
  <div className="space-y-8">
    <HeadingUtil 
      heading="Live Exam:" 
      subHeading=""
    />
    
    <div className={`w-full flex !justify-center !items-center  p-6 mx-auto ${proctorStatus === 'starting' ? 'pointer-events-none' : 'pointer-events-auto'}`}>
      {liveExams && liveExams.length > 0 ? (
        <div className="flex md:flex-col sm:flex-col lg:flex-row gap-8 justify-items-center px-12">
          {liveExams.map((exam, idx) => (
            <div 
              key={idx} 
              className={`
                 overflow-hidden gap-12 w-[120%]
                transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1
                ${(proctorStatus === 'starting' && currentExamId !== exam.id) ? 'opacity-40' : 'opacity-100'}
                ${theme === 'light' 
                  ? 'bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:shadow-blue-100/50' 
                  : 'bg-gray-800/90 border border-gray-700 shadow-lg hover:shadow-xl hover:shadow-purple-900/20'
                }
                rounded-xl p-6 backdrop-blur-sm   
              `}
            >
              {/* Gradient overlay for visual appeal */}
              <div className={`
              group-hover:opacity-10 transition-opacity duration-300
                ${theme === 'light' 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                  : 'bg-gradient-to-br from-indigo-400 to-purple-500'
                }
              `}></div>
              
              <div className="relative z-10">
                <ExamBadge exam={exam} />
                <div className="w-full max-w-sm">
                <LiveExamCard 
                  data={exam} 
                  onStartTest={() => handleStartTest(exam.id, exam.ai_proctored)}
                />
                </div>
                <StartButton 
                  exam={exam} 
                  onStartTest={handleStartTest}
                  getStartButtonConfig={getStartButtonConfig}
                  proctorStatus={proctorStatus}
                  isElectronEnv={isElectronEnv}
                  currentExamId={exam.id}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`
          text-center py-16 rounded-xl border-2 border-dashed w-[50%] px-15
          ${theme === 'light' 
            ? 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-300 text-gray-600' 
            : 'bg-gradient-to-br from-gray-800/50 to-indigo-900/20 border-gray-600 text-indigo-300'
          }
        `}>
          <div className="text-xl font-semibold mb-3">No live exams yet</div>
          <div className="text-sm opacity-70">Check back later for available exams</div>
        </div>
      )}
    </div>
    
    <div className="pt-8">
      <HeadingUtil 
        heading="Upcoming Exams:" 
        subHeading=""
      />
    </div>
    
    <div className={` flex !justify-center !items-center  p-4 mx-auto ${proctorStatus === 'starting' ? 'pointer-events-none' : 'pointer-events-auto'}`}>
      {upcomingExams && upcomingExams.length > 0 ? (
        <div className="flex md:flex-col sm:flex-col lg:flex-row gap-8 justify-items-center ">
          {upcomingExams.map((exam, idx) => (
            <div 
              key={idx} 
              className={`
                overflow-hidden
                transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 
                ${(proctorStatus === 'starting' && currentExamId !== exam.id) ? 'opacity-40' : 'opacity-100'}
                ${theme === 'light' 
                  ? 'bg-gradient-to-br from-white to-blue-50 border border-blue-200 shadow-lg hover:shadow-xl hover:shadow-blue-200/50' 
                  : 'bg-gradient-to-br from-gray-800/90 to-indigo-900/30 border border-indigo-600/50 shadow-lg hover:shadow-xl hover:shadow-indigo-900/30'
                }
                rounded-xl p-6 backdrop-blur-sm
              `}
            >
              {/* Animated gradient overlay */}
              <div className={`
                 group-hover:opacity-15 transition-all duration-500
                ${theme === 'light' 
                  ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' 
                  : 'bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400'
                }
              `}></div>
              
              {/* Subtle pattern overlay */}
              <div className={`
                absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300
                bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.3)_1px,_transparent_0)] bg-[size:20px_20px]
              `}></div>
              
              <div className="relative z-10">
                <ExamBadge exam={exam} />
                <UpcomingExamCard 
                  data={exam} 
                  onStartTest={() => handleStartTest(exam.id, exam.ai_proctored)}
                />
                <StartButton 
                  exam={exam} 
                  onStartTest={handleStartTest}
                  getStartButtonConfig={getStartButtonConfig}
                  proctorStatus={proctorStatus}
                  isElectronEnv={isElectronEnv}
                  currentExamId={exam.id}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`
          text-center py-16 rounded-xl border-2 border-dashed w-[50%] px-15
          ${theme === 'light' 
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 text-blue-700' 
            : 'bg-gradient-to-br from-gray-800/50 to-indigo-900/20 border-indigo-600 text-indigo-300'
          }
        `}>
          <div className="text-xl font-semibold mb-3">No upcoming exams yet</div>
          <div className="text-sm opacity-70">Your scheduled exams will appear here</div>
        </div>
      )}
    </div>
    
    <div className="pt-8">
      <AppRequiredMessage isElectronEnv={isElectronEnv}/>
    </div>
    
    {/* Debug Info - Keep original logic */}
    {/* {process.env.NODE_ENV === 'development' && (
      <div className={`
        fixed bottom-4 right-4 p-4 rounded-xl text-xs z-50 backdrop-blur-md
        ${theme === 'light' 
          ? 'bg-white/90 border border-gray-200 shadow-xl text-gray-700' 
          : 'bg-gray-800/90 border border-gray-600 shadow-xl text-indigo-100'
        }
      `}>
        <div>Electron Environment: {isElectronEnv ? '✅' : '❌'}</div>
        <div>Proctor Status: {proctorStatus}</div>
        <div>Current Exam ID: {currentExamId || 'None'}</div>
        <div>User ID: {user?._id || 'Not loaded'}</div>
        <div>Platform: {navigator.platform}</div>
        {isElectronEnv && (
          <div className="mt-2 space-x-2">
            <button 
              onClick={() => startProctorEngine('test123')}
              disabled={proctorStatus !== 'idle'}
              className={`
                px-3 py-1 rounded-md text-xs font-medium transition-all duration-200
                ${proctorStatus === 'idle' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              Test Start Proctor
            </button>
            <button 
              onClick={stopProctorEngine}
              disabled={proctorStatus !== 'running'}
              className={`
                px-3 py-1 rounded-md text-xs font-medium transition-all duration-200
                ${proctorStatus === 'running' 
                  ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              Test Stop Proctor
            </button>
          </div>
        )}
      </div>
    )} */}
  </div>
</div>
</div>


  );
};

export default UpcomingExam;