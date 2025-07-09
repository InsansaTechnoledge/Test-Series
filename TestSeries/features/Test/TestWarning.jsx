import CryptoJS from 'crypto-js';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/currentUserContext';
import { useCachedExam } from '../../hooks/useCachedExam';
import { useCachedQuestions } from '../../hooks/useCachedQuestions';
import { useTheme } from '../../hooks/useTheme';
import { submitResult } from '../../utils/services/resultService';
import { VITE_SECRET_KEY_FOR_TESTWINDOW } from '../constants/env';
import LoadingTest from './LoadingTest';
import { calculateResult } from './utils/resultCalculator';

const TestHeader = ({handleSubmitTest,subjectSpecificQuestions,setSubjectSpecificQuestions,selectedSubject,setSelectedSubject,setSelectedQuestion,selectedQuestion}) => {
  const [eventDetails, setEventDetails] = useState();
  // const [selectedQuestion, setSelectedQuestion] = useState();
//  --> const [subjectSpecificQuestions, setSubjectSpecificQuestions] = useState();
//  --> const [selectedSubject, setSelectedSubject] = useState();
  const [warning, setWarning] = useState(null);
  const [warningCount, setWarningCount] = useState(0);
  const [proctorRunning, setProctorRunning] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [allWarnings, setAllWarnings] = useState([]);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  
  // New proctor-specific states
  const [proctorStatus, setProctorStatus] = useState('Not Started');
  const [proctorEvents, setProctorEvents] = useState([]);
  const [isElectronEnv, setIsElectronEnv] = useState(false);
  
  // Add refs to prevent duplicate processing
  const warningProcessedRef = useRef(new Set());
  const countdownTimerRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  
  const { user } = useUser();
  const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_TESTWINDOW || VITE_SECRET_KEY_FOR_TESTWINDOW;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const examId = searchParams.get('examId');
  const { questions, isError: isExamError, isLoading: isQuestionLoading } = useCachedQuestions(examId);
  const { exam, isLoading: isExamLoading } = useCachedExam(examId);

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

      const proctorParams = {
        userId: user._id,
        examId: examId,
        eventId: examId
      };

      console.log('🔧 Sending proctor params:', proctorParams);

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
    
    console.log('🔔 Processing warning:', formattedWarning);
    
    setWarning(warningMessage);
    setWarningCount(prev => {
      const newCount = prev + 1;
      console.log('📊 Warning count updated:', newCount);
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
    
    // Check if we should show final popup (5 warnings threshold)
    // Use setTimeout to ensure state is updated before checking
setTimeout(() => {
  setWarningCount(count => (count < 5 ? count + 1 : count));
}, 5000);


// Show popup if threshold is reached
if (warningCount >= 5 && !showFinalPopup) {
  setShowFinalPopup(true);
  console.log('🚨 Showing final popup due to multiple warnings');
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
    if (selectedSubject && subjectSpecificQuestions) {
      setSelectedQuestion(subjectSpecificQuestions[selectedSubject][0]);
    }
  }, [selectedSubject]);

  const getCorrectResponse = (question) => {
    switch (question.question_type) {
      case "mcq":
        return question.correct_option;
      case "msq":
        return question.correct_options;
      case "fill":
      case "numerical":
        return question.correct_answer;
      case "tf":
        return question.is_true;
      case "match":
        return question.correct_pairs;
      case "comprehension":
        return question.sub_questions.reduce((acc, sub_q) => {
          const response = getCorrectResponse(sub_q);
          return {
            ...acc,
            [sub_q.id]: [response, sub_q.positive_marks, sub_q.negative_marks, sub_q.question_type]
          };
        }, {})
      default:
        return question.correct_response;
    }
  }

  const handleSubmit = async () => {
    try {
      // Stop proctor engine before submitting
      if (isElectronEnv && proctorRunning) {
        await window.electronAPI?.stopProctorEngineAsync();
        setProctorRunning(false);
        setProctorStatus('Stopped');
      }

      localStorage.removeItem('testQuestions');
      localStorage.removeItem('encryptedTimeLeft');

      handleSubmitTest();
      navigate('/student/completed-exams');
      // const answers = Object.entries(subjectSpecificQuestions).reduce((acc, [, value]) => {
      //   const objs = value.map((val) => ({
      //     question_id: val.id,
      //     user_response: val.response,
      //     correct_response: getCorrectResponse(val),
      //     question_type: val.question_type,
      //     positive_marks: val.positive_marks,
      //     negative_marks: val.negative_marks
      //   }));

      //   return [...acc, ...objs];
      // }, []);

      // const result = calculateResult(answers);

      // const payload = {
      //   studentId: user._id,
      //   examId: examId,
      //   status: "attempted",
      //   wrongAnswers: result.wrongAnswers,
      //   unattempted: result.unattempted,
      //   marks: result.totalMarks,
      // }

      // const response = await submitResult(payload);
      // if (response.status == 200) {
      //   navigate('/student/completed-exams');
      // }

    } catch (err) {
      console.error('Error submitting test:', err);
    }

    if (window?.electronAPI?.stopProctorEngine) window.electronAPI.stopProctorEngine();
    if (window?.electronAPI?.closeWindow) window.electronAPI.closeWindow();
  };

  if (!eventDetails) return <LoadingTest/>;

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
    <div className={`flex flex-col `}>
      {!eventDetails ? (
        <div className={`flex justify-center items-center h-full text-lg font-medium ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-800'
        }`}>
          <LoadingTest/>
        </div>
      ) : (
        <>
          <div className="relative flex flex-col w-full sm:px-6">
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
                      onClick={handleSubmit}
                      className="inline-flex items-center justify-center px-6 py-2.5 text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg text-base font-semibold transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Okay, Close Test
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col py-6 px-6 sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 rounded-xl">
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