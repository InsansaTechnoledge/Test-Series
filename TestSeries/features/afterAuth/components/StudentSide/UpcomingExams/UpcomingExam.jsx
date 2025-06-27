import { useEffect, useState } from 'react';
import HeadingUtil from '../../../utility/HeadingUtil';
import NeedHelpComponent from '../../InstituteSide/components/NeedHelpComponent';
import UpcomingExamCard from './UpcomingExamCard';
import LiveExamCard from './LiveExamCard';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useNavigate } from 'react-router-dom';
import { useExamManagement } from '../../../../../hooks/UseExam';

const UpcomingExam = () => {
  const [liveExams, setLiveExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [isElectronAvailable, setIsElectronAvailable] = useState(false);
  const navigate = useNavigate();
  const { exams } = useExamManagement();
  const { user } = useUser();
  const userId = user?._id;

  console.log('exam', exams);

  const question = "How To assign role groups to users ?";
  const answer = "Use the created role groups to assign permissions to users in your add user section.";

  // Check if Electron app is available
  useEffect(() => {
    checkElectronAvailability();
  }, []);

  const checkElectronAvailability = async () => {
    try {
      // Create a test protocol URL
      const testUrl = `examproc://test`;
      
      // Try to open the protocol URL
      const link = document.createElement('a');
      link.href = testUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Set up a timeout to check if the protocol worked
      let protocolWorked = false;
      
      const checkVisibility = () => {
        // If the page loses focus, it likely means the protocol worked
        if (document.hidden || document.visibilityState === 'hidden') {
          protocolWorked = true;
          setIsElectronAvailable(true);
          console.log('✅ Electron app detected');
        }
      };
      
      document.addEventListener('visibilitychange', checkVisibility);
      
      // Trigger the protocol
      link.click();
      document.body.removeChild(link);
      
      // Check after a delay
      setTimeout(() => {
        document.removeEventListener('visibilitychange', checkVisibility);
        if (!protocolWorked) {
          console.log('❌ Electron app not detected');
          setIsElectronAvailable(false);
        }
      }, 2000);
      
    } catch (error) {
      console.log('❌ Electron app not detected:', error);
      setIsElectronAvailable(false);
    }
  };

  useEffect(() => {
    if (!exams) return;

    console.log("test", exams);

    const upcoming = exams.filter(exam => exam.go_live === false || exam.go_live === "FALSE");
    const live = exams.filter(exam => exam.go_live === true || exam.go_live === "TRUE");

    setUpcomingExams(upcoming);
    setLiveExams(live);
  }, [JSON.stringify(exams)]);

  const handleStartTest = async (examId, isAiProctored) => {
    const eventId = 'default';
  
    if (!userId || !examId) {
      alert('Missing required information to start the exam');
      return;
    }

    console.log("Launching exam:", examId, "AI Proctored:", isAiProctored);
  
    // If not AI-proctored, launch directly in browser
    if (isAiProctored === false) {
      handleStartTestFallback(examId);
      return;
    }

    // For AI-proctored exams, try to launch Electron app
    const electronUrl = `examproc://splash?userId=${userId}&examId=${examId}&eventId=${eventId}`;
    
    try {
      // Show loading message
      const loadingMessage = showLoadingMessage();
      
      // Try to launch the protocol
      window.location.href = electronUrl;
      
      // Set up visibility change listener to detect if app opened
      let appOpened = false;
      
      const handleVisibilityChange = () => {
        if (document.hidden || document.visibilityState === 'hidden') {
          appOpened = true;
          hideLoadingMessage(loadingMessage);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Fallback after 3 seconds if app doesn't open
      setTimeout(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (!appOpened) {
          hideLoadingMessage(loadingMessage);
          showElectronInstructions(examId);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Failed to launch Electron app:', error);
      showElectronInstructions(examId);
    }
  };

  const showLoadingMessage = () => {
    const overlay = document.createElement('div');
    overlay.id = 'electron-loading';
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
        <div style="margin-bottom: 20px;">🚀 Launching Evalvo Proctor...</div>
        <div style="font-size: 14px; opacity: 0.8;">Please wait while we open the desktop application</div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  };

  const hideLoadingMessage = (overlay) => {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };

  const showElectronInstructions = (examId) => {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
    
    modal.innerHTML = `
      <div style="
        background: white;
        padding: 40px;
        border-radius: 10px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      ">
        <h2 style="color: #333; margin-bottom: 20px;">📱 Desktop App Required</h2>
        <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">
          To take this AI-proctored exam, you need the Evalvo Proctor desktop application installed on your computer.
        </p>
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 15px;">Next Steps:</h3>
          <ol style="text-align: left; color: #666; line-height: 1.8;">
            <li>Download and install the Evalvo Proctor desktop app</li>
            <li>Make sure the app is running</li>
            <li>Click "Start Test" again</li>
          </ol>
        </div>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                  style="
                    background: #007bff;
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                  ">
            Got It
          </button>
          <button onclick="window.open('https://your-download-link.com'); this.parentElement.parentElement.parentElement.remove();" 
                  style="
                    background: #28a745;
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                  ">
            Download App
          </button>
          <button onclick="window.location.href='/student/test?userId=${user?._id}&examId=${examId}&eventId=default'; this.parentElement.parentElement.parentElement.remove();" 
                  style="
                    background: #ffc107;
                    color: #333;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                  ">
            Take in Browser (Limited)
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  };

  const handleStartTestFallback = (examId) => {
    const userId = user?._id;
    const eventId = 'default';
    navigate(`/student/test?userId=${userId}&examId=${examId}&eventId=${eventId}`);
  };

  return (
    <div>
      <div>
        <HeadingUtil 
          heading="Live Exam:" 
          subHeading=""
        />
        <div>
          {
            liveExams && liveExams.length > 0
              ?
              liveExams.map((exam, idx) => (
                <LiveExamCard 
                  key={idx} 
                  data={exam} 
                  onStartTest={() => handleStartTest(exam.id, exam.ai_proctored)}
                />
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
        <div>
          {
            upcomingExams && upcomingExams.length > 0
              ?
              upcomingExams.map((exam, idx) => (
                <UpcomingExamCard 
                  key={idx} 
                  data={exam} 
                  onStartTest={() => handleStartTest(exam.id, exam.ai_proctored)}
                />
              ))
              :
              <div>
                No upcoming exams yet :)
              </div>
          }
        </div>
        
        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
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
            <div>Electron Available: {isElectronAvailable ? '✅' : '❌'}</div>
            <div>User ID: {user?._id || 'Not loaded'}</div>
            <div>Platform: {navigator.platform}</div>
          </div>
        )}
      </div>
      <NeedHelpComponent question={question} answer={answer} />
    </div>
  );
};

export default UpcomingExam;