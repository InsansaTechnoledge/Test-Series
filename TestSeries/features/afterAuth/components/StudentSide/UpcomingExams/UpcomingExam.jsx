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
  const [attemptedExams , setAttemptedExams] = useState([]);
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
    const live = exams.filter(
      exam => (exam.go_live === true || exam.go_live === "TRUE") && exam.hasAttempted !== true || exam.reapplicable === true
    );
    const attempted = exams.filter(exam => 
      exam.hasAttempted === true && (exam.reapplicable === false || exam.reapplicable == null)
    );
    
    setUpcomingExams(upcoming);
    setLiveExams(live);
    setAttemptedExams(attempted);

  }, [JSON.stringify(exams)]);

  const showProctorWarning = (warning) => {
    // Create a warning notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: white;
      padding: 20px 25px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(255, 107, 107, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      max-width: 400px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      animation: slideInBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 15px;">
        <div style="font-size: 24px; line-height: 1;">⚠️</div>
        <div>
          <div style="font-weight: 700; margin-bottom: 8px; font-size: 16px;">Proctoring Alert</div>
          <div style="font-size: 14px; line-height: 1.4; opacity: 0.95; margin-bottom: 6px;">
            ${warning.message || 'Suspicious activity detected'}
          </div>
          <div style="font-size: 12px; opacity: 0.8; background: rgba(255, 255, 255, 0.1); padding: 4px 8px; border-radius: 8px; display: inline-block;">
            Type: ${warning.eventType || 'anomaly'}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInBounce {
        0% { 
          transform: translateX(100%) scale(0.8); 
          opacity: 0; 
        }
        60% { 
          transform: translateX(-10%) scale(1.02); 
          opacity: 0.9; 
        }
        100% { 
          transform: translateX(0) scale(1); 
          opacity: 1; 
        }
      }
      @keyframes slideOutBounce {
        0% { 
          transform: translateX(0) scale(1); 
          opacity: 1; 
        }
        100% { 
          transform: translateX(100%) scale(0.8); 
          opacity: 0; 
        }
      }
    `;
    document.head.appendChild(style);

    // Remove after 6 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutBounce 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 400);
      }
    }, 6000);
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


  const getStartButtonConfig = (exam) => {
    const isProctored = isAiProctored(exam);
    const canStart = canStartExam(exam);
  
    // 1. Exam is proctored but running in browser — disallow
    if (isProctored && !isElectronEnv) {
      return {
        text: "Desktop App Required",
        tooltip: "This exam requires the Evalvo Proctor desktop app.",
        disabled: true,
        style: {
          backgroundColor: '#9ca3af', // Gray
          color: '#ffffff',
          cursor: 'not-allowed',
          opacity: 0.7
        }
      };
    }
  
    // 2. AI-Proctored + Electron — allow
    if (isProctored && isElectronEnv) {
      return {
        text: "Launch Proctored Exam",
        tooltip: "AI-based proctoring is active for this exam.",
        disabled: !canStart,
        style: {
          backgroundColor: '#b91c1c', // Red
          color: '#ffffff',
          border: 'none'
        }
      };
    }
  
    // 3. Attempted and NOT reapplicable — block
    if (exam.hasAttempted === true && exam.reapplicable !== true) {
      return {
        text: "Attempt Completed",
        tooltip: "You have already attempted this exam.",
        disabled: true,
        style: {
          backgroundColor: '#d1d5db', // Light gray
          color: '#6b7280',
          cursor: 'not-allowed'
        }
      };
    }
  
    // 4. Attempted but reapplicable — allow retry
    if (exam.hasAttempted === true && exam.reapplicable === true) {
      return {
        text: "Retake Exam",
        tooltip: "You can reattempt this exam.",
        disabled: !canStart,
        style: {
          backgroundColor: '#2563eb', // Blue
          color: '#ffffff'
        }
      };
    }
  
    // 5. Default case — start exam
    return {
      text: "Begin Exam",
      tooltip: "Start your exam now.",
      disabled: !canStart,
      style: {
        backgroundColor: '#16a34a', // Green
        color: '#ffffff'
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
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(30, 30, 30, 0.9) 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-size: 18px;
      backdrop-filter: blur(10px);
      animation: fadeInScale 0.4s ease-out;
    `;
    overlay.innerHTML = `
      <div style="text-align: center; padding: 40px; background: rgba(255, 255, 255, 0.05); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px);">
        <div style="margin-bottom: 25px; font-size: 48px; animation: pulse 2s infinite;">🛡️</div>
        <div style="font-size: 24px; font-weight: 700; margin-bottom: 15px; background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          AI Proctor Engine Started
        </div>
        <div style="font-size: 16px; opacity: 0.8; margin-bottom: 30px;">Initializing secure exam environment...</div>
        <div style="margin-top: 20px;">
          <div class="spinner" style="
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top: 4px solid #22c55e;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          "></div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      </style>
    `;
    document.body.appendChild(overlay);
    
    // Remove after 2 seconds
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.style.animation = 'fadeInScale 0.3s ease-out reverse';
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 300);
      }
    }, 2000);
  };

  const {theme} = useTheme();

  const handleStartTestFallback = (examId) => {
    const userId = user?._id;
    const eventId = 'default';
    navigate(`/student/test?userId=${userId}&examId=${examId}&eventId=${eventId}`);
  };

  const handleNavigateToResult = (examId) => {
    navigate(`/student/result/${examId}`);
  };
  

  const ExamBadge = ({ exam, theme }) => {
    const isProctored = isAiProctored(exam);
         
    return (
      <div className="inline-flex items-center gap-3 mb-4">
        <span className={`
          px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest
          transition-all duration-300 hover:scale-105
          ${isProctored 
            ? theme === 'light'
              ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-2 border-red-200 shadow-lg shadow-red-100' 
              : 'bg-gradient-to-r from-red-900/40 to-pink-900/40 text-red-300 border-2 border-red-600/40 shadow-lg shadow-red-900/20'
            : theme === 'light'
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-200 shadow-lg shadow-green-100'
              : 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 text-green-300 border-2 border-green-600/40 shadow-lg shadow-green-900/20'
          }
        `}>
          {isProctored ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
              AI-Proctored
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-current rounded-full"></span>
              Standard
            </span>
          )}
        </span>
                 
        {isProctored && !isElectronEnv && (
          <span className={`
            px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
            animate-pulse transition-all duration-300
            ${theme === 'light'
              ? 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border-2 border-orange-200 shadow-lg shadow-orange-100'
              : 'bg-gradient-to-r from-orange-900/40 to-yellow-900/40 text-orange-300 border-2 border-orange-600/40 shadow-lg shadow-orange-900/20'
            }
          `}>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              App Required
            </span>
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
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-white to-blue-50' 
        : 'bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950'
    }`}>

      <AppRequiredMessage isElectronEnv={isElectronEnv}/>
      {/* Main Container */}
      <div className={`mx-auto px-6 py-8 ${
        proctorStatus === 'starting' ? 'opacity-60 pointer-events-none' : 'opacity-100'
      } transition-all duration-500`}>
        
        <div className='flex h-screen'>
          {/* Sidebar */}
          <div className={`
            w-[320px] min-w-[320px] border-r p-6 overflow-y-auto sticky top-0 h-screen
            transition-all duration-300 backdrop-blur-sm
            ${theme === 'light' 
              ? 'bg-white/80 border-gray-200/50 shadow-xl shadow-gray-100/50' 
              : 'bg-gray-900/80 border-gray-800/50 shadow-xl shadow-black/20'
            }
          `}>
            <div className="mb-8">
              <HeadingUtil 
                heading="Exam Security" 
                subHeading="Understand the measures enforced during your test"
              />
            </div>

            <div className="space-y-6 text-sm">
              {/* Non-Proctored Security */}
              <div className={`
                p-6 rounded-2xl border-2 transition-all duration-300
                hover:shadow-lg hover:scale-[1.02] group cursor-pointer
                ${theme === 'light'
                  ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 hover:border-yellow-300 hover:shadow-yellow-100'
                  : 'border-yellow-700/50 bg-gradient-to-br from-yellow-900/20 to-amber-900/20 hover:border-yellow-600/50 hover:shadow-yellow-900/20'
                }
              `}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${theme === 'light' ? 'bg-yellow-200' : 'bg-yellow-800/50'}
                  `}>
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className={`text-base font-bold ${
                    theme === 'light' ? 'text-yellow-800' : 'text-yellow-300'
                  }`}>
                    Non-Proctored Security
                  </h3>
                </div>
                <ul className={`space-y-2 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 text-xs mt-1">●</span>
                    <span>Tab switch activity is tracked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 text-xs mt-1">●</span>
                    <span>Print, Save, and View Source operations are blocked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 text-xs mt-1">●</span>
                    <span>Developer tools and shortcut keys are disabled</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 text-xs mt-1">●</span>
                    <span>Page refresh and URL tampering attempts are monitored</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 text-xs mt-1">●</span>
                    <span>Loss of focus or minimizing triggers alerts</span>
                  </li>
                </ul>
              </div>

              {/* Proctored Security */}
              <div className={`
                p-6 rounded-2xl border-2 transition-all duration-300
                hover:shadow-lg hover:scale-[1.02] group cursor-pointer
                ${theme === 'light'
                  ? 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50 hover:border-red-300 hover:shadow-red-100'
                  : 'border-red-600/50 bg-gradient-to-br from-red-900/20 to-pink-900/20 hover:border-red-500/50 hover:shadow-red-900/20'
                }
              `}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${theme === 'light' ? 'bg-red-200' : 'bg-red-800/50'}
                  `}>
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className={`text-base font-bold ${
                    theme === 'light' ? 'text-red-800' : 'text-red-300'
                  }`}>
                    AI-Proctored Security
                  </h3>
                </div>
                <ul className={`space-y-2 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 text-xs mt-1">●</span>
                    <span>All non-proctored rules apply</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 text-xs mt-1">●</span>
                    <span>Facial recognition is used throughout the session</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 text-xs mt-1">●</span>
                    <span>Multiple face detection to avoid unauthorized presence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 text-xs mt-1">●</span>
                    <span>Proper lighting and solitary environment are mandatory</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1 overflow-y-auto p-8'>
            {/* Live Exams Section */}
            <section className="mb-20">
              <div className="mb-10">
                <HeadingUtil 
                  heading="Live Exams" 
                  subHeading="Active exams available for immediate participation"
                />
              </div>
              
              <div className="space-y-8">
                {liveExams && liveExams.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {liveExams.map((exam, idx) => (
                      <div
                        key={idx}
                        className={`
                          relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500
                          hover:shadow-3xl hover:scale-[1.03] group cursor-pointer
                          ${theme === 'light' 
                            ? 'bg-white/90 border-2 border-indigo-100 hover:border-indigo-200 backdrop-blur-sm' 
                            : 'bg-gray-900/90 border-2 border-indigo-800/50 hover:border-indigo-700/50 backdrop-blur-sm'
                          }
                          ${(proctorStatus === 'starting' && currentExamId !== exam.id) ? 'opacity-40' : 'opacity-100'}
                        `}
                        style={{
                          animationDelay: `${idx * 100}ms`,
                          animation: 'fadeInUp 0.6s ease-out both'
                        }}
                      >
                        {/* Animated Background */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                          <div className={`w-full h-full ${
                            theme === 'light' 
                              ? 'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500' 
                              : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600'
                          }`} style={{
                            animation: 'gradientShift 8s ease-in-out infinite'
                          }}></div>
                        </div>
                        
                        {/* Live Badge */}
                        {
                          exam.hasAttempted !== true && (
                            <div className="absolute top-6 right-6 z-10">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse">
                              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                              Live Now
                            </div>
                          </div>
                          )
                        }
                      

                        <div className="relative z-10 p-8">
                          <ExamBadge exam={exam} theme={theme} />
                          
                          <div className="mb-6">
                            <h3 className={`text-2xl font-bold mb-3 ${
                              theme === 'light' ? 'text-gray-800' : 'text-white'
                            }`}>
                              {exam.name || 'Untitled Exam'}
                            </h3>
                            {/* <p className={`text-base leading-relaxed ${
                              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                            }`}>
                              {exam.description || 'No description available'}
                            </p> */}
                          </div>

                          <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/50'
                              }`}>
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className={`text-sm font-medium ${
                                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                              }`}>
                                Duration: {exam.duration || 'N/A'} minutes
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                theme === 'light' ? 'bg-green-100' : 'bg-green-900/50'
                              }`}>
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className={`text-sm font-medium ${
                                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                              }`}>
                                Marks: {exam.total_marks || 'N/A'}
                              </span>
                            </div>
                          </div>

                          <button
                          onClick={() => handleStartTest(exam.id || exam._id, exam.ai_proctored)}
                          disabled={!canStartExam(exam) || (exam.hasAttempted === true && exam.reapplicable === false)}
                          className={`
                            w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300
                            transform hover:scale-105 hover:shadow-xl active:scale-95
                            ${!canStartExam(exam) || (exam.hasAttempted === true && exam.reapplicable === false)
                              ? 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-60'
                              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:from-green-600 hover:to-emerald-600'
                            }
                          `}
                        >
                          {getStartButtonConfig(exam).text}
                        </button>

                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`
                    text-center py-20 px-8 rounded-3xl border-2 border-dashed transition-all duration-300
                    ${theme === 'light' 
                      ? 'border-gray-300 bg-gray-50/50' 
                      : 'border-gray-600 bg-gray-800/50'
                    }
                  `}>
                    <div className="mb-6">
                      <svg className={`w-16 h-16 mx-auto ${
                        theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      No Live Exams Available
                    </h3>
                    <p className={`text-base ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      There are currently no active exams. Check back later or view upcoming exams below.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Upcoming Exams Section */}
            <section>
              <div className="mb-10">
                <HeadingUtil 
                  heading="Upcoming Exams" 
                  subHeading="Scheduled exams that will be available soon"
                />
              </div>
              
              <div className="space-y-8">
                {upcomingExams && upcomingExams.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {upcomingExams.map((exam, idx) => (
                      <div
                        key={idx}
                        className={`
                          relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500
                          hover:shadow-3xl hover:scale-[1.03] group cursor-pointer
                          ${theme === 'light' 
                            ? 'bg-white/90 border-2 border-amber-100 hover:border-amber-200 backdrop-blur-sm' 
                            : 'bg-gray-900/90 border-2 border-amber-800/50 hover:border-amber-700/50 backdrop-blur-sm'
                          }
                        `}
                        style={{
                          animationDelay: `${idx * 100}ms`,
                          animation: 'fadeInUp 0.6s ease-out both'
                        }}
                      >
                        {/* Animated Background */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                          <div className={`w-full h-full ${
                            theme === 'light' 
                              ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500' 
                              : 'bg-gradient-to-br from-amber-600 via-orange-600 to-red-600'
                          }`} style={{
                            animation: 'gradientShift 8s ease-in-out infinite'
                          }}></div>
                        </div>
                        
                        {/* Upcoming Badge */}
                        <div className="absolute top-6 right-6 z-10">
                          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Upcoming
                          </div>
                        </div>

                        <div className="relative z-10 p-8">
                          <ExamBadge exam={exam} theme={theme} />
                          
                          <div className="mb-6">
                            <h3 className={`text-2xl font-bold mb-3 ${
                              theme === 'light' ? 'text-gray-800' : 'text-white'
                            }`}>
                              {exam.name || 'Untitled Exam'}
                            </h3>
                            {/* <p className={`text-base leading-relaxed ${
                              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                            }`}>
                              {exam.description || 'No description available'}
                            </p> */}
                          </div>

                          <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/50'
                              }`}>
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className={`text-sm font-medium ${
                                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                              }`}>
                                Duration: {exam.duration || 'N/A'} minutes
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                theme === 'light' ? 'bg-green-100' : 'bg-green-900/50'
                              }`}>
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className={`text-sm font-medium ${
                                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                              }`}>
                                Marks: {exam.total_marks || 'N/A'}
                              </span>
                            </div>

                            {exam.start_date && (
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  theme === 'light' ? 'bg-purple-100' : 'bg-purple-900/50'
                                }`}>
                                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <span className={`text-sm font-medium ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                }`}>
                                  Starts: {new Date(exam.start_date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            disabled={true}
                            className={`
                              w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300
                              bg-gray-400 text-gray-700 cursor-not-allowed opacity-60
                            `}
                          >
                            Not Available Yet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`
                    text-center py-20 px-8 rounded-3xl border-2 border-dashed transition-all duration-300
                    ${theme === 'light' 
                      ? 'border-gray-300 bg-gray-50/50' 
                      : 'border-gray-600 bg-gray-800/50'
                    }
                  `}>
                    <div className="mb-6">
                      <svg className={`w-16 h-16 mx-auto ${
                        theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      No Upcoming Exams
                    </h3>
                    <p className={`text-base ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      There are no scheduled exams at the moment. Check with your instructor for updates.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Attempted Exams Section */}
            <section className="mb-20 mt-12">
              <div className="mb-10">
                <HeadingUtil 
                  heading="Attempted Exams" 
                  subHeading="Active exams available for immediate participation"
                />
              </div>
              
              <div className="space-y-8  ">
                {attemptedExams && attemptedExams.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {attemptedExams.map((exam, idx) => (
                      <div
                        key={idx}
                        className={`
                          relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500
                          hover:shadow-3xl hover:scale-[1.03] group cursor-pointer
                          ${theme === 'light' 
                            ? 'bg-white/90 border-2 border-indigo-100 hover:border-indigo-200 backdrop-blur-sm' 
                            : 'bg-gray-900/90 border-2 border-indigo-800/50 hover:border-indigo-700/50 backdrop-blur-sm'
                          }
                          ${(proctorStatus === 'starting' && currentExamId !== exam.id) ? 'opacity-40' : 'opacity-100'}
                        `}
                        style={{
                          animationDelay: `${idx * 100}ms`,
                          animation: 'fadeInUp 0.6s ease-out both'
                        }}
                      >
                       
                       
                      

                        <div className="relative z-10 p-8">
                          <ExamBadge exam={exam} theme={theme} />
                          
                          <div className="mb-6">
                            <h3 className={`text-2xl font-bold mb-3 ${
                              theme === 'light' ? 'text-gray-800' : 'text-white'
                            }`}>
                              {exam.name || 'Untitled Exam'}
                            </h3>
                            {/* <p className={`text-base leading-relaxed ${
                              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                            }`}>
                              {exam.description || 'No description available'}
                            </p> */}
                          </div>

                          <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/50'
                              }`}>
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className={`text-sm font-medium ${
                                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                              }`}>
                                Duration: {exam.duration || 'N/A'} minutes
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                theme === 'light' ? 'bg-green-100' : 'bg-green-900/50'
                              }`}>
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className={`text-sm font-medium ${
                                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                              }`}>
                                Marks: {exam.total_marks || 'N/A'}
                              </span>
                            </div>
                          </div>

                          <button
                          onClick={() => handleNavigateToResult(exam.id)}
                          disabled={!canStartExam(exam) || (exam.hasAttempted === true && exam.reapplicable === false)}
                          className={`
                            w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300
                            transform hover:scale-105 hover:shadow-xl active:scale-95
                            ${!canStartExam(exam) || exam.hasAttempted
                              ? 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-60'
                              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:from-green-600 hover:to-emerald-600'
                            }
                          `}
                        >
                          {getStartButtonConfig(exam).text}
                        </button>

                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`
                    text-center py-20 px-8 rounded-3xl border-2 border-dashed transition-all duration-300
                    ${theme === 'light' 
                      ? 'border-gray-300 bg-gray-50/50' 
                      : 'border-gray-600 bg-gray-800/50'
                    }
                  `}>
                    <div className="mb-6">
                      <svg className={`w-16 h-16 mx-auto ${
                        theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      No Live Exams Available
                    </h3>
                    <p className={`text-base ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      There are currently no attempted exams.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

     

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default UpcomingExam;