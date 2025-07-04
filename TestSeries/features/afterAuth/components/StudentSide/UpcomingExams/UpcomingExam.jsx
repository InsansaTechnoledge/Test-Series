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

  const ExamBadge = ({ exam, theme }) => {
    const isProctored = isAiProctored(exam);
         
    return (
      <div className="inline-flex items-center gap-3 mb-4">
        <span className={`
          px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider
          ${isProctored 
            ? theme === 'light'
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-red-900/30 text-red-300 border border-red-600/30'
            : theme === 'light'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-green-900/30 text-green-300 border border-green-600/30'
          }
        `}>
          {isProctored ? 'AI-Proctored' : 'Standard'}
        </span>
                 
        {isProctored && !isElectronEnv && (
          <span className={`
            px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider
            ${theme === 'light'
              ? 'bg-orange-100 text-orange-700 border border-orange-200'
              : 'bg-orange-900/30 text-orange-300 border border-orange-600/30'
            }
          `}>
            App Required
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
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-950'}`}>
      {/* Main Container */}
      <div className={`max-w-7xl mx-auto px-6 py-8 ${
        proctorStatus === 'starting' ? 'opacity-60 pointer-events-none' : 'opacity-100'
      } transition-all duration-300`}>
        
        {/* Live Exams Section */}
        <section className="mb-16">
          <div className="mb-8">
            <HeadingUtil 
              heading="Live Exams" 
              subHeading="Active exams available for immediate participation"
            />
          </div>
          
          <div className="space-y-6">
            {liveExams && liveExams.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {liveExams.map((exam, idx) => (
                  <div
                    key={idx}
                    className={`
                      relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300
                      hover:shadow-2xl hover:scale-[1.02] group
                      ${theme === 'light' 
                        ? 'bg-white border-2 border-indigo-600/10 hover:border-indigo-600/20' 
                        : 'bg-gray-950 border-2 border-indigo-400/10 hover:border-indigo-400/20'
                      }
                      ${(proctorStatus === 'starting' && currentExamId !== exam.id) ? 'opacity-40' : 'opacity-100'}
                    `}
                  >
                    {/* Live Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-semibold">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
                      theme === 'light' 
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600' 
                        : 'bg-gradient-to-br from-indigo-400 to-purple-400'
                    }`}></div>
                    
                    <div className="relative z-10 p-6">
                      <ExamBadge exam={exam} theme={theme} />
                      
                      <div className="mb-6">
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
                text-center py-16 rounded-2xl border-2 border-dashed
                ${theme === 'light' 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                  : 'bg-indigo-950/30 border-indigo-800 text-indigo-400'
                }
              `}>
                <div className="space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/50'
                  }`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No Live Exams</h3>
                    <p className="text-sm opacity-70">There are no active exams at the moment. Check back later!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Exams Section */}
        <section className="mb-16">
          <div className="mb-8">
            <HeadingUtil 
              heading="Upcoming Exams" 
              subHeading="Scheduled exams that will be available soon"
            />
          </div>
          
          <div className="space-y-6">
            {upcomingExams && upcomingExams.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {upcomingExams.map((exam, idx) => (
                  <div
                    key={idx}
                    className={`
                      relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300
                      hover:shadow-2xl hover:scale-[1.02] group
                      ${theme === 'light' 
                        ? 'bg-white border-2 border-indigo-600/10 hover:border-indigo-600/20' 
                        : 'bg-gray-950 border-2 border-indigo-400/10 hover:border-indigo-400/20'
                      }
                      ${(proctorStatus === 'starting' && currentExamId !== exam.id) ? 'opacity-40' : 'opacity-100'}
                    `}
                  >
                    {/* Upcoming Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        theme === 'light' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-indigo-900/50 text-indigo-300'
                      }`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        UPCOMING
                      </div>
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
                      theme === 'light' 
                        ? 'bg-gradient-to-br from-indigo-600 to-blue-600' 
                        : 'bg-gradient-to-br from-indigo-400 to-blue-400'
                    }`}></div>
                    
                    <div className="relative z-10 p-6">
                      <ExamBadge exam={exam} theme={theme} />
                      
                      <div className="mb-6">
                        <UpcomingExamCard 
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
                text-center py-16 rounded-2xl border-2 border-dashed
                ${theme === 'light' 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                  : 'bg-indigo-950/30 border-indigo-800 text-indigo-400'
                }
              `}>
                <div className="space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/50'
                  }`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No Upcoming Exams</h3>
                    <p className="text-sm opacity-70">Your scheduled exams will appear here when available.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* App Required Message */}
        <section>
          <AppRequiredMessage isElectronEnv={isElectronEnv}/>
        </section>
      </div>

      {/* Proctor Status Overlay */}
      {proctorStatus === 'starting' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`p-8 rounded-2xl max-w-md mx-4 text-center ${
            theme === 'light' ? 'bg-white' : 'bg-gray-950'
          }`}>
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Starting Proctor Engine
            </h3>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Please wait while we initialize the exam environment...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingExam;