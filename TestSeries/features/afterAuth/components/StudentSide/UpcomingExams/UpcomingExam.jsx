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

  const handleStartTestFallback = (examId) => {
    const userId = user?._id;
    const eventId = 'default';
    navigate(`/student/test?userId=${userId}&examId=${examId}&eventId=${eventId}`);
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
        
        {isProctored && !isElectronEnv && (
          <span style={{
            padding: '4px 8px',
            borderRadius: '15px',
            fontSize: '11px',
            backgroundColor: '#ffc107',
            color: '#000',
            fontWeight: 'bold'
          }}>
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
    <div style={{ opacity: proctorStatus === 'starting' ? 0.6 : 1, transition: 'opacity 0.3s ease' }}>
        <NeedHelpComponent question={question} answer={answer} />
      <div>
        <HeadingUtil 
          heading="Live Exam:" 
          subHeading=""
        />
        <div style={{ pointerEvents: proctorStatus === 'starting' ? 'none' : 'auto' }}>
          {
            liveExams && liveExams.length > 0
              ?
              liveExams.map((exam, idx) => (
                <div key={idx} style={{ 
                  opacity: (proctorStatus === 'starting' && currentExamId !== exam.id) ? 0.4 : 1,
                  transition: 'opacity 0.3s ease',
                  marginBottom: '20px',
                  padding: '15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <ExamBadge exam={exam} />
                  <LiveExamCard 
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
              ))
              :
              <div>
                No live exams yet :)
              </div>
          }
        </div>
        
        <HeadingUtil 
          heading="Upcoming Exams:" 
          subHeading=""
        />
        <div style={{ pointerEvents: proctorStatus === 'starting' ? 'none' : 'auto' }}>
          {
            upcomingExams && upcomingExams.length > 0
              ?
              upcomingExams.map((exam, idx) => (
                <div key={idx} style={{ 
                  opacity: (proctorStatus === 'starting' && currentExamId !== exam.id) ? 0.4 : 1,
                  transition: 'opacity 0.3s ease',
                  marginBottom: '20px',
                  padding: '15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}>
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
              ))
              :
              <div>
                No upcoming exams yet :)
              </div>
          }
        </div>
        
        <AppRequiredMessage isElectronEnv={isElectronEnv}/>
        
        {/* Debug Info */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            position: 'fixed', 
            bottom: '10px', 
            right: '10px', 
            background: '#f0f0f0', 
            padding: '10px', 
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 1000
          }}>
            <div>Electron Environment: {isElectronEnv ? '✅' : '❌'}</div>
            <div>Proctor Status: {proctorStatus}</div>
            <div>Current Exam ID: {currentExamId || 'None'}</div>
            <div>User ID: {user?._id || 'Not loaded'}</div>
            <div>Platform: {navigator.platform}</div>
            {isElectronEnv && (
              <div style={{ marginTop: '5px' }}>
                <button 
                  onClick={() => startProctorEngine('test123')}
                  disabled={proctorStatus !== 'idle'}
                  style={{
                    padding: '5px 10px',
                    background: proctorStatus === 'idle' ? '#007bff' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: proctorStatus === 'idle' ? 'pointer' : 'not-allowed',
                    fontSize: '11px',
                    marginRight: '5px'
                  }}
                >
                  Test Start Proctor
                </button>
                <button 
                  onClick={stopProctorEngine}
                  disabled={proctorStatus !== 'running'}
                  style={{
                    padding: '5px 10px',
                    background: proctorStatus === 'running' ? '#dc3545' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: proctorStatus === 'running' ? 'pointer' : 'not-allowed',
                    fontSize: '11px'
                  }}
                >
                  Test Stop Proctor
                </button>
              </div>
            )}
          </div>
        )} */}
      </div>
    
    </div>
  );
};

export default UpcomingExam;