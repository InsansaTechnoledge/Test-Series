import CryptoJS from 'crypto-js';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation} from 'react-router-dom';
import { useUser } from '../../contexts/currentUserContext';
import { useCachedExam } from '../../hooks/useCachedExam';
import { useCachedQuestions } from '../../hooks/useCachedQuestions';
import { useTheme } from '../../hooks/useTheme';
import { VITE_SECRET_KEY_FOR_TESTWINDOW } from '../constants/env';
import LoadingTest from './LoadingTest';
import { checkToStopExamForStudent } from '../../utils/services/proctorService';

const TestHeader = ({ isAutoSubmittable,isProctorRunning,handleSubmit}) => {
  const [eventDetails, setEventDetails] = useState();
  const [subjectSpecificQuestions, setSubjectSpecificQuestions] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [warning, setWarning] = useState(null);
  const [warningCount, setWarningCount] = useState(0);
  const [proctorRunning, setProctorRunning] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [allWarnings, setAllWarnings] = useState([]);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  const [showManualReviewMessage, setShowManualReviewMessage] = useState(false);

  // Organization stop toast states
  const [showOrgStopToast, setShowOrgStopToast] = useState(false);
  const [orgStopCountdown, setOrgStopCountdown] = useState(5);
  const [isElectronEnv, setIsElectronEnv] = useState(false);

  // Add refs to prevent duplicate processing
  const warningProcessedRef = useRef(new Set());
  const countdownTimerRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const autoSubmitTriggeredRef = useRef(false);
  const orgStopTimerRef = useRef(null);

  const { user } = useUser();
  const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_TESTWINDOW || VITE_SECRET_KEY_FOR_TESTWINDOW;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const examId = searchParams.get('examId');
  const { questions, isError: isExamError, isLoading: isQuestionLoading } = useCachedQuestions(examId);
  const { exam, isLoading: isExamLoading } = useCachedExam(examId);

  // FIXED: Get auto_submittable from exam data if prop is not provided
  const autoSubmittable = isAutoSubmittable ?? exam?.auto_submittable ?? false;

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
        handleProctorEvent(data);
      });

      window.electronAPI.onProctorLog((event, data) => {
        setProctorStatus(data);
      });

      const proctorParams = {
        userId: user._id,
        examId: examId,
        eventId: examId
      };


      const result = await window.electronAPI.startProctorEngineAsync(proctorParams);

      if (result.success) {
        setProctorRunning(true);
        setProctorStatus('Running');
        console.log('✅ Proctor engine started successfully');
      } else {
        setProctorRunning(isProctorRunning);
         isProctorRunning ? setProctorStatus('Running') : setProctorStatus('Stopped');
        setProctorStatus(`Error: ${result.message}`);
        console.error('❌ Failed to start proctor engine:', result.message);
      }
    } catch (error) {
      console.error('❌ Error initializing proctor:', error);
      setProctorStatus(`Error: ${error.message}`);
    }
  };

  const handleProctorWarning = (data) => {
    // Create a unique identifier for this warning
    const warningId = `${data.timestamp || Date.now()}-${data.eventType || 'unknown'}`;

    // Prevent duplicate processing
    if (warningProcessedRef.current.has(warningId)) {
      console.log('⚠️ Duplicate warning ignored:', warningId);
      return;
    }

    warningProcessedRef.current.add(warningId);

    // Clean up old processed warnings (keep last 20)
    if (warningProcessedRef.current.size > 20) {
      const oldWarnings = Array.from(warningProcessedRef.current).slice(0, -20);
      oldWarnings.forEach(id => warningProcessedRef.current.delete(id));
    }

    const warningMessage = data.details || data.eventType || 'Unknown warning';
    const timestamp = new Date(data.timestamp || Date.now()).toLocaleTimeString();
    const formattedWarning = `${timestamp}: ${warningMessage}`;


    setWarning(warningMessage);
    setWarningCount(prev => {
      const newCount = prev + 1;
      console.log('📊 Warning count updated:', newCount);

      // Check warning threshold immediately
      const MAX_WARNINGS_ALLOWED = 5;
      if (newCount >= MAX_WARNINGS_ALLOWED) {
        handleWarningThresholdReached();
      }

      return newCount;
    });

    setAllWarnings(prev => [...prev, formattedWarning]);

    // Clear any existing countdown timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    // Handle specific warning types
    if (warningMessage.includes('No face detected')) {
      setCountdown(10);
      countdownTimerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Clear any existing warning timeout
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Auto-clear warning after 5 seconds
    warningTimeoutRef.current = setTimeout(() => {
      setWarning(null);
      setCountdown(null);
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    }, 5000);
  };

  const handleWarningThresholdReached = () => {
    // Prevent multiple triggers
    if (autoSubmitTriggeredRef.current) {
      console.log('⚠️ Warning threshold already processed');
      return;
    }

    autoSubmitTriggeredRef.current = true;

    // FIXED: Use the computed autoSubmittable value
    console.log('🚨 Warning threshold reached. Auto-submittable:', autoSubmittable);

    if (autoSubmittable === true) {
      console.log('🔄 Triggering auto-submit');
      setShowFinalPopup(true);
    } else {
      console.log('📝 Showing manual review message');
      setShowManualReviewMessage(true);
    }
  };

  const handleProctorEvent = (data) => {
    setProctorEvents(prev => [...prev.slice(-9), data]);
  };

  const { theme } = useTheme();

  const cleanupProctor = () => {
    // Clean up timers
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }

    // Add cleanup for organization stop timer
    if (orgStopTimerRef.current) {
      clearInterval(orgStopTimerRef.current);
      orgStopTimerRef.current = null;
    }

    if (window?.electronAPI) {
      window.electronAPI.cleanupProctorListeners();
      if (proctorRunning) {
        window.electronAPI.stopProctorEngine();
        setProctorRunning(false);
        setProctorStatus('Stopped');
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupProctor();
    };
  }, []);

  useEffect(() => {
    if (!isExamLoading && !isQuestionLoading && questions && questions.length > 0) {
      for (const quest of questions) {
        if (!quest.subject || quest.subject.trim() === "") {
          quest.subject = "Unspecified";
        }
      }
      const subjectSet = new Set(questions.map(q => q.subject));

      setEventDetails(prev => ({
        ...prev,
        ...exam,
        questions,
        subjects: Array.from(subjectSet),
      }));
    }
  }, [questions, isQuestionLoading, isExamLoading]);

  useEffect(() => {
    if (eventDetails) {
      const cached = localStorage.getItem('testQuestions');

      if (!cached) {
        const reduced = eventDetails.questions.reduce((acc, quest) => {
          if (!acc[quest.subject]) {
            acc[quest.subject] = [{ ...quest, index: 1, status: 'unanswered', response: null }];
          } else {
            acc[quest.subject].push({ ...quest, index: acc[quest.subject].length + 1, status: 'unanswered', response: null });
          }
          return acc;
        }, {});

        setSubjectSpecificQuestions(reduced);
      } else {
        const bytes = CryptoJS.AES.decrypt(cached, secretKey);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setSubjectSpecificQuestions(decrypted);
      }

      setSelectedSubject(eventDetails.subjects[0] || "Unspecified");
    }
  }, [eventDetails]);

  useEffect(() => {
    if (
      selectedSubject &&
      subjectSpecificQuestions &&
      Array.isArray(subjectSpecificQuestions[selectedSubject]) &&
      subjectSpecificQuestions[selectedSubject].length > 0
    ) {
      setSelectedQuestion(subjectSpecificQuestions[selectedSubject][0]);
    } else {
      setSelectedQuestion(null); // optional fallback
    }
  }, [selectedSubject, subjectSpecificQuestions]);

  // Enhanced useEffect with toast notification for organization stop
  useEffect(() => {
    // Only start polling if autoSubmittable is false AND warning count >= 5
    if (autoSubmittable || warningCount < 5 || !user?._id) {
      return; // Exit early if conditions aren't met
    }

    console.log("🔄 Starting stopExam polling - warningCount:", warningCount, "autoSubmittable:", autoSubmittable);

    const intervalId = setInterval(async () => {
      try {
        const result = await checkToStopExamForStudent(user._id);

        const stopExamValue = result?.stopExam || result?.data?.stopExam || result?.response?.stopExam;
        console.log("📊 stopExamValue:", stopExamValue, "type:", typeof stopExamValue);

        if (stopExamValue === true || stopExamValue === "true" || stopExamValue === 1 || stopExamValue === "1") {
          console.log("⛔ Exam manually stopped by proctor - showing toast notification");


          clearInterval(intervalId);


          setShowOrgStopToast(true);
          setOrgStopCountdown(15);

          // Start countdown timer
          orgStopTimerRef.current = setInterval(() => {
            setOrgStopCountdown(prev => {
              if (prev <= 1) {
                // When countdown reaches 0, submit the test
                clearInterval(orgStopTimerRef.current);
                orgStopTimerRef.current = null;
                setShowOrgStopToast(false);

                console.log("🚀 Countdown finished - submitting test");
                handleSubmit();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (err) {
        console.error('❌ Failed to check stopExam flag:', err);
      }
    }, 5000); // Check every 5 seconds

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up stopExam polling interval");
      clearInterval(intervalId);
      if (orgStopTimerRef.current) {
        clearInterval(orgStopTimerRef.current);
        orgStopTimerRef.current = null;
      }
    };
  }, [warningCount, autoSubmittable, user?._id]); // Dependencies ensure effect runs when these change

  console.log("sd", isAutoSubmittable);

  const dismissManualReviewMessage = () => {
    setShowManualReviewMessage(false);
  };

  if (!eventDetails) return <LoadingTest />;

  if (isExamError) {
    return <div className='font-bold flex flex-col gap-8 mt-20 text-center'>
      <span className='text-indigo-900 text-4xl'>
        Questions not available for this exam!
      </span>
      <span className='text-indigo-900 text-xl'>Try contacting your institute for more info</span>
    </div>
  }

  if (isExamLoading || isQuestionLoading) {
    return <div>Loading...🥲</div>
  }

  return (
    <div className={`flex flex-col`}>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-scale {
          animation: pulse 1s ease-in-out infinite;
        }
      `}</style>

      {!eventDetails ? (
        <div className={`flex justify-center items-center h-full text-lg font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-800'
          }`}>
          <LoadingTest />
        </div>
      ) : (
        <>
          <div className="relative flex flex-col w-full sm:px-6">
            {/* Warning Banner */}
            {warning && (
              <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-center w-[90%] sm:w-[500px] font-medium backdrop-blur-md ${theme === 'light'
                  ? 'bg-amber-50/95 border border-amber-200 text-amber-900'
                  : 'bg-amber-900/95 border border-amber-700 text-amber-100'
                }`}>
                <span className="text-xl mr-2">⚠️</span>
                {warning === "No face detected" && countdown !== null
                  ? `You have ${countdown} sec to come back to the screen`
                  : warning}
              </div>
            )}

            {/* Organization Stop Toast Notification */}
            {showOrgStopToast && (
              <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                <div className={`p-6 rounded-2xl shadow-2xl w-96 border-l-4 border-red-500 ${theme === 'light'
                    ? 'bg-white text-gray-800'
                    : 'bg-gray-800 text-gray-100'
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">🛑</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-red-600 mb-2">
                        Examination Terminated
                      </h3>
                      <p className={`text-sm leading-relaxed mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                        }`}>
                        Your examination has been terminated by the organization due to repeated
                        monitoring anomalies detected during the assessment period.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>
                          Auto-submitting in:
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center animate-pulse-scale">
                            <span className="text-white font-bold text-sm">
                              {orgStopCountdown}
                            </span>
                          </div>
                          <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                            seconds
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Auto-Submit Final Popup */}
            {showFinalPopup && autoSubmittable && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
                <div className={`p-6 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in ${theme === 'light'
                    ? 'bg-white text-gray-800'
                    : 'bg-gray-800 text-gray-100'
                  }`}>
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-red-500 flex items-center justify-center gap-2">
                      <span>🚨</span> Multiple Anomalies Detected
                    </h2>
                    <p className={`mt-2 text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                      Your test is being auto-submitted due to repeated violations. Please review the detected incidents below:
                    </p>
                  </div>
                  <ul className={`mt-4 max-h-48 overflow-y-auto text-sm sm:text-base border rounded-lg px-4 py-3 space-y-1 list-disc list-inside shadow-inner ${theme === 'light'
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-red-900/20 border-red-800 text-red-300'
                    }`}>
                    {allWarnings.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <div className="mt-6 text-center">
                    <button
                      onClick={()=>{handleSubmit()}}
                      className="inline-flex items-center justify-center px-6 py-2.5 text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg text-base font-semibold transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Okay, Close Test
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Review Message Popup */}
            {showManualReviewMessage && !autoSubmittable && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
                <div className={`p-6 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in ${theme === 'light'
                    ? 'bg-white text-gray-800'
                    : 'bg-gray-800 text-gray-100'
                  }`}>
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-amber-500 flex items-center justify-center gap-2">
                      <span>⚠️</span> Warning Threshold Reached
                    </h2>
                    <p className={`mt-2 text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                      Multiple anomalies have been detected during your test. The examiner is reviewing the outcome.
                    </p>
                  </div>
                  <ul className={`mt-4 max-h-48 overflow-y-auto text-sm sm:text-base border rounded-lg px-4 py-3 space-y-1 list-disc list-inside shadow-inner ${theme === 'light'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-amber-900/20 border-amber-800 text-amber-300'
                    }`}>
                    {allWarnings.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <div className="mt-6 text-center">
                    <button
                      onClick={dismissManualReviewMessage}
                      className="inline-flex items-center justify-center px-6 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-base font-semibold transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Continue Test
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col py-6 px-6 sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 rounded-xl">
              {/* warning and timer */}
              {
                isElectronEnv && (
                  <div className='flex flex-col gap-3 w-full'>
                    <div className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-xl shadow-sm w-full justify-center ${theme === 'light'
                        ? 'text-red-700 bg-red-50 border border-red-200'
                        : 'text-red-300 bg-red-900/20 border border-red-800'
                      }`}>
                      <span className="text-lg">🚨</span>
                      Warnings: <span className={`font-bold ${theme === 'light' ? 'text-red-800' : 'text-red-200'
                        }`}>{warningCount}</span>/5
                      {!autoSubmittable && (
                        <span className={`ml-2 text-xs px-2 py-1 rounded ${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-300'
                          }`}>
                          Manual Review
                        </span>
                      )}
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TestHeader;