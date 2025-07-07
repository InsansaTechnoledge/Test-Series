import React, { useEffect, useState } from 'react';


import { useLocation, useNavigate } from 'react-router-dom';

import { useTheme } from '../../hooks/useTheme';
import LoadingTest from './LoadingTest';
import { useUser } from '../../contexts/currentUserContext';

const TestHeader = ({}) => {
  const [eventDetails, setEventDetails] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [warning, setWarning] = useState(null);
  const [warningCount, setWarningCount] = useState(0);
  const [proctorRunning, setProctorRunning] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [allWarnings, setAllWarnings] = useState([]);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  const [proctorStatus, setProctorStatus] = useState('Not Started');
  const [proctorEvents, setProctorEvents] = useState([]);
  const [isElectronEnv, setIsElectronEnv] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const examId = searchParams.get('examId');
  const {user} = useUser()


  // Check if we're in Electron environment
  useEffect(() => {
    const checkElectronEnv = () => {
      const isElectron = window?.electronAPI?.isElectron || false;
      setIsElectronEnv(isElectron);
      console.log('🔍 Electron environment detected:', isElectron);
    };
    
    checkElectronEnv();
  }, []);

  // Initialize proctor engine in Electron environment
  useEffect(() => {
    if (isElectronEnv && user && examId && !proctorRunning) {
      initializeProctor();
    }

    return () => {
      if (isElectronEnv && window?.electronAPI) {
        cleanupProctor();
      }
    };
  }, [isElectronEnv, user, examId]);

  const initializeProctor = async () => {
    if (!window?.electronAPI) {
      console.warn('⚠️ Electron API not available');
      return;
    }

    try {
      console.log('🚀 Initializing proctor engine...');
      setProctorStatus('Initializing...');

      // Setup event listeners
      window.electronAPI.onProctorWarning((event, data) => {
        console.log('⚠️ Proctor warning received:', data);
        handleProctorWarning(data);
      });

      window.electronAPI.onProctorEvent((event, data) => {
        console.log('📥 Proctor event received:', data);
        handleProctorEvent(data);
      });

      window.electronAPI.onProctorLog((event, data) => {
        console.log('📝 Proctor log:', data);
        setProctorStatus(data);
      });

      // ✅ FIXED: Pass parameters as a single object with correct structure
      const proctorParams = {
        userId: user._id,    // This will be mapped to studentId in C++
        examId: examId,
        eventId: examId      // Using examId as eventId for now
      };

      console.log('🔧 Sending proctor params:', proctorParams);

      // Start the proctor engine
      const result = await window.electronAPI.startProctorEngineAsync(proctorParams);

      if (result.success) {
        setProctorRunning(true);
        setProctorStatus('Running');
        console.log('✅ Proctor engine started successfully');
      } else {
        setProctorStatus(`Error: ${result.message}`);
        console.error('❌ Failed to start proctor engine:', result.message);
      }
    } catch (error) {
      console.error('❌ Error initializing proctor:', error);
      setProctorStatus(`Error: ${error.message}`);
    }
  };

  const handleProctorWarning = (data) => {
    const warningMessage = data.details || data.eventType || 'Unknown warning';
    const timestamp = new Date(data.timestamp || Date.now()).toLocaleTimeString();
    const formattedWarning = `${timestamp}: ${warningMessage}`;
    
    setWarning(warningMessage);
    setWarningCount(prev => prev + 1);
    setAllWarnings(prev => [...prev, formattedWarning]);
    
    // Handle specific warning types
    if (warningMessage.includes('No face detected')) {
      setCountdown(10); // 10 second countdown
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    // Auto-clear warning after 5 seconds
    setTimeout(() => {
      setWarning(null);
      setCountdown(null);
    }, 5000);
    
    // Check if we should show final popup (5 warnings threshold)
    if (warningCount >= 4) { // 4 because we increment after setting
      setShowFinalPopup(true);
    }
  };

  const handleProctorEvent = (data) => {
    setProctorEvents(prev => [...prev.slice(-9), data]); // Keep last 10 events
  };
  const {theme} = useTheme()
  
  const cleanupProctor = () => {
    if (window?.electronAPI) {
      window.electronAPI.cleanupProctorListeners();
      if (proctorRunning) {
        window.electronAPI.stopProctorEngine();
        setProctorRunning(false);
        setProctorStatus('Stopped');
      }
    }
  };
















  return (
 

    <div className={`flex flex-col `}>
      {!eventDetails ? (
        <div className={`flex justify-center items-center h-full text-lg font-medium ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-800'
        }`}>
    {/* <LoadingTest/> */}
        </div>
      ) : (
        <>
          <div className="relative flex flex-col w-full sm:px-6">

            {/* Electron Proctor Status - Only show in Electron environment */}
            {isElectronEnv && (
              <div className={`fixed top-4 right-4 z-40 px-4 py-2 rounded-xl shadow-lg max-w-xs backdrop-blur-md ${
                theme === 'light' 
                  ? 'bg-white/90 text-gray-800 border border-gray-200' 
                  : 'bg-gray-800/90 text-white border border-gray-700'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${proctorRunning ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-sm font-medium">
                    Proctor: {proctorRunning ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className={`text-xs mt-1 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  {proctorStatus}
                </div>
              </div>
            )}

            {/* Warning Banner */}
            {warning && (
              <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-center w-[90%] sm:w-[500px] font-medium backdrop-blur-md ${
                theme === 'light'
                  ? 'bg-amber-50/95 border border-amber-200 text-amber-900'
                  : 'bg-amber-900/95 border border-amber-700 text-amber-100'
              }`}>
                <span className="text-xl mr-2">⚠️</span>
                {warning === "No face detected" && countdown !== null
                  ? `You have ${countdown} sec to come back to the screen`
                  : warning}
              </div>
            )}

            {/* Final Popup */}
            {showFinalPopup && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
                <div className={`p-6 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in ${
                  theme === 'light' 
                    ? 'bg-white text-gray-800' 
                    : 'bg-gray-800 text-gray-100'
                }`}>
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-red-500 flex items-center justify-center gap-2">
                      <span>🚨</span> Multiple Anomalies Detected
                    </h2>
                    <p className={`mt-2 text-sm sm:text-base ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      Your test is being auto-submitted due to repeated violations. Please review the detected incidents below:
                    </p>
                  </div>
                  <ul className={`mt-4 max-h-48 overflow-y-auto text-sm sm:text-base border rounded-lg px-4 py-3 space-y-1 list-disc list-inside shadow-inner ${
                    theme === 'light'
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-red-900/20 border-red-800 text-red-300'
                  }`}>
                    {allWarnings.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleSubmitTest}
                      className="inline-flex items-center justify-center px-6 py-2.5 text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg text-base font-semibold transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Okay, Close Test
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Proctor Events Log - Only show in Electron environment and when there are events */}
            {isElectronEnv && proctorEvents.length > 0 && (
              <div className={`fixed bottom-4 right-4 z-30 p-3 rounded-xl shadow-lg max-w-sm max-h-40 overflow-y-auto backdrop-blur-md ${
                theme === 'light'
                  ? 'bg-white/90 text-gray-800 border border-gray-200'
                  : 'bg-gray-800/90 text-white border border-gray-700'
              }`}>
                <h4 className="text-sm font-semibold mb-2">Recent Events</h4>
                <div className="space-y-1">
                  {proctorEvents.slice(-5).map((event, idx) => (
                    <div key={idx} className={`text-xs ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      <span className="text-amber-500 font-medium">{event?.eventType}:</span> {event?.details}
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* Header */}
            <div className="flex flex-col py-6 px-6 sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 rounded-xl  ">
           

              {/* warning and timer */}
<div className='flex flex-col gap-3 w-full'>

              <div className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-xl shadow-sm w-full justify-center ${
                theme === 'light'
                  ? 'text-red-700 bg-red-50 border border-red-200'
                  : 'text-red-300 bg-red-900/20 border border-red-800'
              }`}>
                <span className="text-lg">🚨</span>
                Warnings: <span className={`font-bold ${
                  theme === 'light' ? 'text-red-800' : 'text-red-200'
                }`}>{warningCount}</span>/5
              </div>

              

</div>
     
           
          
            </div>

           

          </div>
        </>
      )}
    </div>
  );
};

export default TestHeader;