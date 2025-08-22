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
import { ExamCountdown, getExamTargetISO } from './CountDownUtil';
import ExamBadge from './ExamBadge';
import AttemptedExamCard from './AttemptedExamCard';
import ExamSideBar from './LeftSideBarForInformation/ExamSideBar';

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
  const [isMobile , setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    }
    checkDevice();

    window.addEventListener("resize" , checkDevice)

    return () => {
      window.removeEventListener("resize" , checkDevice)
    }
  })

  console.log('exam', exams);

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
    if (!exams || !Array.isArray(exams)) return;
  
    const isTrue = (val) => val === true || val === 'TRUE' || val === 'true' || val === 1 || val === '1';
    const isFalse = (val) => val === false || val === 'FALSE' || val === 'false' || val === 0 || val === '0';
  
    const upcoming = exams.filter(exam => isFalse(exam.go_live));
  
    const live = exams.filter(
      exam => (
        isTrue(exam.go_live) &&
        (!exam.hasAttempted || isTrue(exam.reapplicable))
      )
    );
  
    const attempted = exams.filter(
      exam => exam.hasAttempted === true && (isFalse(exam.reapplicable) || exam.reapplicable == null)
    );
  
    console.log("🧪 Normalized Exams", { upcoming, live, attempted });
  
    setUpcomingExams(upcoming);
    setLiveExams(live);
    setAttemptedExams(attempted);
  }, [exams]);
  

  console.log("liveExam" , liveExams)

  const showProctorWarning = (warning) => {
    // Create a professional warning notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      background: #ffffff;
      color: #1f2937;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
      z-index: 10000;
      max-width: 400px;
      border-left: 4px solid #ef4444;
      animation: slideInRight 0.4s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="
          background: #fef2f2; 
          color: #dc2626; 
          width: 28px; 
          height: 28px; 
          border-radius: 6px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 14px;
          flex-shrink: 0;
        ">⚠</div>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px; color: #111827;">
            Proctoring Alert
          </div>
          <div style="font-size: 13px; line-height: 1.4; color: #4b5563; margin-bottom: 8px;">
            ${warning.message || 'Suspicious activity detected'}
          </div>
          <div style="
            font-size: 11px; 
            color: #6b7280; 
            background: #f3f4f6; 
            padding: 3px 8px; 
            border-radius: 4px; 
            display: inline-block;
            text-transform: uppercase;
            font-weight: 500;
            letter-spacing: 0.5px;
          ">
            ${warning.eventType || 'anomaly'}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        0% { 
          transform: translateX(100%); 
          opacity: 0; 
        }
        100% { 
          transform: translateX(0); 
          opacity: 1; 
        }
      }
      @keyframes slideOutRight {
        0% { 
          transform: translateX(0); 
          opacity: 1; 
        }
        100% { 
          transform: translateX(100%); 
          opacity: 0; 
        }
      }
    `;
    document.head.appendChild(style);

    // Remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
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
  
    console.log("Launching exam ", examId, "AI Proctored:", isAiProctoredFlag);
  
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

        const resultCamera = await window.electronAPI.checkCameraPermission();
        console.log("Camera permission check result:", resultCamera);
        const resultMic = await window.electronAPI.checkMicPermission();
        console.log("Microphone permission check result:", resultMic);
        if(!resultCamera.granted || !resultMic.granted){
          alert('Camera and microphone access are required to start the exam.');
          return;
        }
          
        const proctorStarted = await startProctorEngine(examId, eventId);
        
        if (proctorStarted) {
          // Show proctor started message
          showProctorStartedMessage();
          
          // Wait a moment for proctor to initialize, then navigate to exam
          setTimeout(() => {
            navigate(`/student/test?userId=${userId}&examId=${examId}&eventId=${eventId}&proctored=true&isProctorRunning=true`);
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
      backdrop-filter: blur(8px);
      animation: fadeIn 0.3s ease-out;
    `;
    overlay.innerHTML = `
      <div style="
        text-align: center; 
        padding: 48px 40px; 
        background: #1f2937; 
        border-radius: 16px; 
        border: 1px solid #374151;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
      ">
        <div style="
          background: #065f46; 
          color: #10b981; 
          width: 64px; 
          height: 64px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 28px;
          margin: 0 auto 24px auto;
        ">🛡</div>
        <div style="font-size: 20px; font-weight: 600; margin-bottom: 12px; color: #f9fafb;">
          AI Proctor Started
        </div>
        <div style="font-size: 14px; color: #d1d5db; margin-bottom: 32px;">
          Initializing secure exam environment...
        </div>
        <div style="margin-top: 20px;">
          <div class="spinner" style="
            border: 3px solid #374151;
            border-top: 3px solid #10b981;
            border-radius: 50%;
            width: 32px;
            height: 32px;
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
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      </style>
    `;
    document.body.appendChild(overlay);
    
    // Remove after 2 seconds
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
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
  
  useEffect(() => {
    return () => {
      if (proctorStatus === 'running') {
        stopProctorEngine();
      }
    };
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'light' 
        ? 'bg-white' 
        : 'bg-gray-950'
    }`}>

      <AppRequiredMessage isElectronEnv={isElectronEnv}/>
      
      {/* Main Container */}
      <div className={`mx-auto px-6 py-8 ${
        proctorStatus === 'starting' ? 'opacity-50 pointer-events-none' : 'opacity-100'
      } transition-all duration-300`}>
        
        <div className='flex h-screen'>
          {/* Sidebar */}
          {
            !isMobile &&
              <ExamSideBar theme={theme}/>
          }

          {/* Main Content */}
          <div className='flex-1 overflow-y-auto p-8'>
            
            {/* Live Exams Section */}
            <LiveExamCard theme={theme} liveExams={liveExams} proctorStatus={proctorStatus} currentExamId={currentExamId} handleStartTest={handleStartTest} canStartExam={canStartExam} getStartButtonConfig={getStartButtonConfig} isAiProctored={isAiProctored} isElectronEnv={isElectronEnv}/>

            {/* Upcoming Exams Section */}
            <UpcomingExamCard theme={theme} upcomingExams={upcomingExams} isAiProctored={isAiProctored} isElectronEnv={isElectronEnv}/>

            {/* Attempted Exams Section */}
            <AttemptedExamCard attemptedExams={attemptedExams} theme={theme} currentExamId={currentExamId} proctorStatus={proctorStatus} isAiProctored={isAiProctored} isElectronEnv={isElectronEnv} handleNavigateToResult={handleNavigateToResult} canStartExam={canStartExam} getStartButtonConfig={getStartButtonConfig}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingExam;