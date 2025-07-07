// import React, { useEffect, useState, useRef } from 'react';
// import QuestionListSection from './QuestionListSection';
// import QuestionSection from './QuestionSection';
// import CountdownTimer from './TestTimer/CountdownTimer';
// import CryptoJS from 'crypto-js';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useUser } from '../../contexts/currentUserContext';
// import { useCachedQuestions } from '../../hooks/useCachedQuestions';
// import { useCachedExam } from '../../hooks/useCachedExam';
// import { calculateResult } from './utils/resultCalculator';
// import { submitResult } from '../../utils/services/resultService';
// import { VITE_SECRET_KEY_FOR_TESTWINDOW } from '../constants/env';
// import { useTheme } from '../../hooks/useTheme';
// import TestHeader from './TestWarning';
// import LoadingTest from './LoadingTest';

// const TestWindow = () => {
//   const [eventDetails, setEventDetails] = useState();
//   const [selectedQuestion, setSelectedQuestion] = useState();
//   const [subjectSpecificQuestions, setSubjectSpecificQuestions] = useState();
//   const [selectedSubject, setSelectedSubject] = useState();
//   const [submitted, setSubmitted] = useState(false);
//   const [examViolations, setExamViolations] = useState([]);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [warningCount, setWarningCount] = useState(0);
//   const examContainerRef = useRef(null);

//   const { user } = useUser();
//   const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_TESTWINDOW || VITE_SECRET_KEY_FOR_TESTWINDOW;
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const navigate = useNavigate();
//   const examId = searchParams.get('examId');
//   const { questions, isError: isExamError, isLoading: isQuestionLoading } = useCachedQuestions(examId);
//   const { exam, isLoading: isExamLoading } = useCachedExam(examId);
//   const { theme } = useTheme();

//   // Security and Anti-Cheat Measures
//   useEffect(() => {
//     let violationInterval;
    
//     const initializeExamSecurity = () => {
//       // Enter fullscreen mode
//       enterFullscreen();
      
//       // Disable right-click context menu
//       const disableContextMenu = (e) => {
//         e.preventDefault();
//         logViolation('Right-click attempted');
//         return false;
//       };
      
//       // Disable key combinations
//       const disableKeys = (e) => {
//         // Disable F12 (Developer Tools)
//         if (e.key === 'F12') {
//           e.preventDefault();
//           logViolation('F12 key pressed');
//           return false;
//         }
        
//         // Disable Ctrl+Shift+I (Developer Tools)
//         if (e.ctrlKey && e.shiftKey && e.key === 'I') {
//           e.preventDefault();
//           logViolation('Ctrl+Shift+I pressed');
//           return false;
//         }
        
//         // Disable Ctrl+Shift+J (Console)
//         if (e.ctrlKey && e.shiftKey && e.key === 'J') {
//           e.preventDefault();
//           logViolation('Ctrl+Shift+J pressed');
//           return false;
//         }
        
//         // Disable Ctrl+Shift+C (Element Inspector)
//         if (e.ctrlKey && e.shiftKey && e.key === 'C') {
//           e.preventDefault();
//           logViolation('Ctrl+Shift+C pressed');
//           return false;
//         }
        
//         // Disable Ctrl+U (View Source)
//         if (e.ctrlKey && e.key === 'u') {
//           e.preventDefault();
//           logViolation('Ctrl+U pressed');
//           return false;
//         }
        
//         // Disable Ctrl+S (Save Page)
//         if (e.ctrlKey && e.key === 's') {
//           e.preventDefault();
//           logViolation('Ctrl+S pressed');
//           return false;
//         }
        
//         // Disable Ctrl+P (Print)
//         if (e.ctrlKey && e.key === 'p') {
//           e.preventDefault();
//           logViolation('Print attempt');
//           return false;
//         }
        
//         // Disable Alt+Tab (Task Switch)
//         if (e.altKey && e.key === 'Tab') {
//           e.preventDefault();
//           logViolation('Alt+Tab pressed');
//           return false;
//         }
        
//         // Disable Ctrl+Tab (Browser Tab Switch)
//         if (e.ctrlKey && e.key === 'Tab') {
//           e.preventDefault();
//           logViolation('Ctrl+Tab pressed');
//           return false;
//         }
        
//         // Disable Windows Key
//         if (e.key === 'Meta') {
//           e.preventDefault();
//           logViolation('Windows key pressed');
//           return false;
//         }
        
//         // Disable Ctrl+N (New Window)
//         if (e.ctrlKey && e.key === 'n') {
//           e.preventDefault();
//           logViolation('Ctrl+N pressed');
//           return false;
//         }
        
//         // Disable Ctrl+T (New Tab)
//         if (e.ctrlKey && e.key === 't') {
//           e.preventDefault();
//           logViolation('Ctrl+T pressed');
//           return false;
//         }
        
//         // Disable Ctrl+W (Close Tab)
//         if (e.ctrlKey && e.key === 'w') {
//           e.preventDefault();
//           logViolation('Ctrl+W pressed');
//           return false;
//         }
        
//         // Disable Ctrl+R (Refresh)
//         if (e.ctrlKey && e.key === 'r') {
//           e.preventDefault();
//           logViolation('Ctrl+R pressed');
//           return false;
//         }
        
//         // Disable F5 (Refresh)
//         if (e.key === 'F5') {
//           e.preventDefault();
//           logViolation('F5 pressed');
//           return false;
//         }
//       };
      
//       // Monitor window focus/blur
//       const handleWindowBlur = () => {
//         logViolation('Window lost focus');
//         showWarning('You switched away from the exam window!');
//       };
      
//       const handleWindowFocus = () => {
//         console.log('Window regained focus');
//       };
      
//       // Monitor visibility change
//       const handleVisibilityChange = () => {
//         if (document.hidden) {
//           logViolation('Page became hidden');
//           showWarning('You switched to another tab or minimized the window!');
//         }
//       };
      
//       // Monitor fullscreen changes
//       const handleFullscreenChange = () => {
//         if (!document.fullscreenElement) {
//           setIsFullscreen(false);
//           logViolation('Exited fullscreen mode');
//           showWarning('You must stay in fullscreen mode during the exam!');
//           // Attempt to re-enter fullscreen
//           setTimeout(() => {
//             enterFullscreen();
//           }, 1000);
//         } else {
//           setIsFullscreen(true);
//         }
//       };
      
//       // Prevent copy/paste
//       const preventCopyPaste = (e) => {
//         if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
//           e.preventDefault();
//           logViolation('Copy/Paste/Cut attempted');
//           return false;
//         }
//       };
      
//       // Prevent text selection
//       const preventTextSelection = (e) => {
//         if (e.ctrlKey && e.key === 'a') {
//           e.preventDefault();
//           logViolation('Select all attempted');
//           return false;
//         }
//       };
      
//       // Add event listeners
//       document.addEventListener('contextmenu', disableContextMenu);
//       document.addEventListener('keydown', disableKeys);
//       document.addEventListener('keydown', preventCopyPaste);
//       document.addEventListener('keydown', preventTextSelection);
//       window.addEventListener('blur', handleWindowBlur);
//       window.addEventListener('focus', handleWindowFocus);
//       document.addEventListener('visibilitychange', handleVisibilityChange);
//       document.addEventListener('fullscreenchange', handleFullscreenChange);
      
//       // Disable drag and drop
//       const disableDragDrop = (e) => {
//         e.preventDefault();
//         logViolation('Drag and drop attempted');
//         return false;
//       };
      
//       document.addEventListener('dragstart', disableDragDrop);
//       document.addEventListener('drop', disableDragDrop);
      
//       // Monitor for developer tools
//       violationInterval = setInterval(() => {
//         checkForDevTools();
//       }, 1000);
      
//       // Cleanup function
//       return () => {
//         document.removeEventListener('contextmenu', disableContextMenu);
//         document.removeEventListener('keydown', disableKeys);
//         document.removeEventListener('keydown', preventCopyPaste);
//         document.removeEventListener('keydown', preventTextSelection);
//         window.removeEventListener('blur', handleWindowBlur);
//         window.removeEventListener('focus', handleWindowFocus);
//         document.removeEventListener('visibilitychange', handleVisibilityChange);
//         document.removeEventListener('fullscreenchange', handleFullscreenChange);
//         document.removeEventListener('dragstart', disableDragDrop);
//         document.removeEventListener('drop', disableDragDrop);
//         if (violationInterval) {
//           clearInterval(violationInterval);
//         }
//       };
//     };
    
//     if (eventDetails && !submitted) {
//       return initializeExamSecurity();
//     }
//   }, [eventDetails, submitted]);

//   // Function to enter fullscreen
//   const enterFullscreen = () => {
//     if (examContainerRef.current) {
//       const element = examContainerRef.current;
//       if (element.requestFullscreen) {
//         element.requestFullscreen().catch(err => {
//           console.error('Error entering fullscreen:', err);
//         });
//       } else if (element.webkitRequestFullscreen) {
//         element.webkitRequestFullscreen();
//       } else if (element.msRequestFullscreen) {
//         element.msRequestFullscreen();
//       }
//     }
//   };

//   // Function to check for developer tools
//   const checkForDevTools = () => {
//     const threshold = 160;
//     if (window.outerHeight - window.innerHeight > threshold || 
//         window.outerWidth - window.innerWidth > threshold) {
//       logViolation('Developer tools detected');
//       showWarning('Developer tools detected! This is not allowed during the exam.');
//     }
//   };

//   // Function to log violations
//   const logViolation = (violationType) => {
//     const violation = {
//       type: violationType,
//       timestamp: new Date().toISOString(),
//       userId: user._id,
//       examId: examId
//     };
    
//     setExamViolations(prev => [...prev, violation]);
    
//     // You can send this to your backend for logging
//     console.warn('Exam Violation:', violation);
    
//     // Optionally send to server
//     // sendViolationToServer(violation);
//   };

//   // Function to show warnings
//   const showWarning = (message) => {
//     setWarningCount(prev => prev + 1);
//     alert(`⚠️ WARNING: ${message}\n\nThis is warning ${warningCount + 1}. Multiple violations may result in exam termination.`);
    
//     // Auto-submit exam after too many warnings
//     if (warningCount >= 3) {
//       alert('Too many violations detected. Your exam will be submitted automatically.');
//       handleSubmitTest();
//     }
//   };

//   // Disable browser back button
//   useEffect(() => {
//     const handlePopState = (e) => {
//       e.preventDefault();
//       logViolation('Back button pressed');
//       showWarning('Browser back button is disabled during the exam!');
//       // Push a new state to prevent going back
//       window.history.pushState(null, null, window.location.pathname);
//     };

//     // Push initial state
//     window.history.pushState(null, null, window.location.pathname);
//     window.addEventListener('popstate', handlePopState);

//     return () => {
//       window.removeEventListener('popstate', handlePopState);
//     };
//   }, []);

//   // Prevent page refresh/close
//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       e.preventDefault();
//       logViolation('Page refresh/close attempted');
//       e.returnValue = 'Are you sure you want to leave the exam? Your progress may be lost.';
//       return e.returnValue;
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

//   // Original useEffect hooks from your code
//   useEffect(() => {
//     if (eventDetails) {
//       const cached = localStorage.getItem('testQuestions');
//       if (!cached) {
//         const reduced = eventDetails.questions.reduce((acc, quest) => {
//           if (quest.subject.trim() === "") {
//             quest.subject = "Unspecified";
//           }

//           if (!acc[quest.subject]) {
//             acc[quest.subject] = [{ ...quest, index: 1, status: 'unanswered', response: null }];
//           } else {
//             acc[quest.subject].push({ ...quest, index: acc[quest.subject].length + 1, status: 'unanswered', response: null });
//           }
//           return acc;
//         }, {});

//         setSubjectSpecificQuestions(reduced);
//       } else {
//         const bytes = CryptoJS.AES.decrypt(cached, secretKey);
//         const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//         setSubjectSpecificQuestions(decrypted);
//       }

//       setSelectedSubject(eventDetails.subjects[0]);
//     }
//   }, [eventDetails]);

//   useEffect(() => {
//     if (!isExamLoading && !isQuestionLoading && questions && questions.length > 0) {
//       for (const quest of questions) {
//         if (!quest.subject || quest.subject.trim() === "") {
//           quest.subject = "Unspecified";
//         }
//       }
//       const subjectSet = new Set(questions.map(q => q.subject));

//       setEventDetails(prev => ({
//         ...prev,
//         ...exam,
//         questions,
//         subjects: Array.from(subjectSet),
//       }));
//     }
//   }, [questions, isQuestionLoading, isExamLoading]);

//   useEffect(() => {
//     if (eventDetails) {
//       const cached = localStorage.getItem('testQuestions');

//       if (!cached) {
//         const reduced = eventDetails.questions.reduce((acc, quest) => {
//           if (!acc[quest.subject]) {
//             acc[quest.subject] = [{ ...quest, index: 1, status: 'unanswered', response: null }];
//           } else {
//             acc[quest.subject].push({ ...quest, index: acc[quest.subject].length + 1, status: 'unanswered', response: null });
//           }
//           return acc;
//         }, {});

//         setSubjectSpecificQuestions(reduced);
//       } else {
//         const bytes = CryptoJS.AES.decrypt(cached, secretKey);
//         const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//         setSubjectSpecificQuestions(decrypted);
//       }

//       setSelectedSubject(eventDetails.subjects[0] || "Unspecified");
//     }
//   }, [eventDetails]);

//   useEffect(() => {
//     if (selectedSubject && subjectSpecificQuestions) {
//       setSelectedQuestion(subjectSpecificQuestions[selectedSubject][0]);
//     }
//   }, [selectedSubject]);

//   useEffect(() => {
//     if (submitted) {
//       const timeout = setTimeout(() => {
//         navigate("/student/completed-exams");
//       }, 2500);
//       return () => clearTimeout(timeout);
//     }
//   }, [submitted, navigate]);

//   const getCorrectResponse = (question) => {
//     switch (question.question_type) {
//       case "mcq": return question.correct_option;
//       case "msq": return question.correct_options;
//       case "fill":
//       case "numerical": return question.correct_answer;
//       case "tf": return question.is_true;
//       case "match": return question.correct_pairs;
//       case "comprehension":
//         return question.sub_questions.reduce((acc, sub_q) => {
//           const response = getCorrectResponse(sub_q);
//           return {
//             ...acc,
//             [sub_q.id]: [response, sub_q.positive_marks, sub_q.negative_marks, sub_q.question_type]
//           };
//         }, {});
//       default: return question.correct_response;
//     }
//   };

//   const handleSubmitTest = async () => {
//     try {
//       localStorage.removeItem('testQuestions');
//       localStorage.removeItem('encryptedTimeLeft');

//       const answers = Object.entries(subjectSpecificQuestions).reduce((acc, [, value]) => {
//         const objs = value.map((val) => ({
//           question_id: val.id,
//           user_response: val.response,
//           correct_response: getCorrectResponse(val),
//           question_type: val.question_type,
//           positive_marks: val.positive_marks,
//           negative_marks: val.negative_marks
//         }));
//         return [...acc, ...objs];
//       }, []);

//       const result = calculateResult(answers);

//       const payload = {
//         studentId: user._id,
//         examId: examId,
//         status: "attempted",
//         wrongAnswers: result.wrongAnswers,
//         unattempted: result.unattempted,
//         marks: result.totalMarks,
//         violations: examViolations, 
//         warningCount: warningCount
//       };

//       const response = await submitResult(payload);
//       if (response.status === 200) {
//         setSubmitted(true);
//         // Exit fullscreen when exam is submitted
//         if (document.fullscreenElement) {
//           document.exitFullscreen();
//         }
//       }

//     } catch (err) {
//       console.error('Error submitting test:', err);
//     }
//   };

//   if (!eventDetails) return <LoadingTest />;
//   if (isExamError) {
//     return (
//       <div className='font-bold flex flex-col gap-8 mt-20 text-center'>
//         <span className='text-indigo-900 text-4xl'>Questions not available for this exam!</span>
//         <span className='text-indigo-900 text-xl'>Try contacting your institute for more info</span>
//       </div>
//     );
//   }

//   if (isExamLoading || isQuestionLoading) {
//     return <div>Loading...🥲</div>;
//   }

//   return (
//     <div ref={examContainerRef} className="exam-container">
//       {/* Security Status Bar */}
//       <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-sm ${
//         theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900 text-red-100'
//       }`}>
//         <div className="flex justify-between items-center">
//           <span>🔒 EXAM MODE ACTIVE - Evalvo's Security Monitoring Enabled</span>
//           <span>Violations: {examViolations.length} | Warnings: {warningCount}</span>
//         </div>
//       </div>

//       <div className={`py-16 flex min-h-screen flex-col lg:flex-row gap-2 mt-8`}>
//         <div className='w-full lg:w-[80%] p-2 lg:p-4 gap-2 flex flex-col'>
//           <div className={`p-4 rounded-md shadow-sm w-full border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
//             <div className="flex justify-between items-center">
//               <h1 className={`text-xl xl:text-2xl font-bold leading-snug ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
//                 {eventDetails?.batch?.name || 'Test Batch Name'}
//               </h1>
//               <h2 className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'}`}>
//                 {eventDetails?.batch?.year || ''}
//               </h2>
//             </div>
//           </div>

//           <div className="lg:hidden">
//             <TestHeader />
//             <CountdownTimer initialTime={eventDetails.duration} handleSubmitTest={handleSubmitTest} submitted={submitted} />
//           </div>

//           <QuestionSection 
//             setSubjectSpecificQuestions={setSubjectSpecificQuestions} 
//             setSelectedQuestion={setSelectedQuestion} 
//             selectedQuestion={selectedQuestion} 
//             selectedSubject={selectedSubject} 
//             subjectSpecificQuestions={subjectSpecificQuestions} 
//           />
//         </div>

//         <div className='w-full lg:w-[25%] lg:block'>
//           <div className="hidden lg:block">
//             <TestHeader />
//             <CountdownTimer initialTime={eventDetails.duration} handleSubmitTest={handleSubmitTest} submitted={submitted} />
//           </div>
//           <div className="w-full py-3 px-2">
//             <QuestionListSection 
//               subjectSpecificQuestions={subjectSpecificQuestions} 
//               setSubjectSpecificQuestions={setSubjectSpecificQuestions} 
//               selectedSubject={selectedSubject} 
//               setSelectedSubject={setSelectedSubject} 
//               selectedQuestion={selectedQuestion} 
//               setSelectedQuestion={setSelectedQuestion} 
//               eventDetails={eventDetails} 
//             />
//           </div>
//         </div>
//       </div>

//       {/* {process.env.NODE_ENV === 'development' && (
//         <div className="fixed bottom-4 right-4 max-w-sm p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-lg">
//           <h3 className="font-bold mb-2">Violation Log</h3>
//           <div className="max-h-40 overflow-y-auto text-xs">
//             {examViolations.slice(-5).map((violation, index) => (
//               <div key={index} className="mb-1">
//                 {violation.type} - {new Date(violation.timestamp).toLocaleTimeString()}
//               </div>
//             ))}
//           </div>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default TestWindow;


import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/currentUserContext';
import { useCachedQuestions } from '../../hooks/useCachedQuestions';
import { useCachedExam } from '../../hooks/useCachedExam';
import { useTheme } from '../../hooks/useTheme';
import CryptoJS from 'crypto-js';
import { VITE_SECRET_KEY_FOR_TESTWINDOW } from '../constants/env';


import { getCorrectResponse, calculateResultPayload } from './utils/examUtils';
import { submitResult } from '../../utils/services/resultService';
import { useExamSecurity } from './hooks/useExamSecurity';
import CountdownTimer from './TestTimer/CountdownTimer';
import QuestionListSection from './QuestionListSection';
import TestHeader from './TestWarning';
import QuestionSection from './QuestionSection';
import LoadingTest from './LoadingTest';

const TestWindow = () => {
  const [eventDetails, setEventDetails] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [subjectSpecificQuestions, setSubjectSpecificQuestions] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [examViolations, setExamViolations] = useState([]);
  const [warningCount, setWarningCount] = useState(0);

  const examContainerRef = useRef(null);
  const { user } = useUser();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const examId = searchParams.get('examId');
  const navigate = useNavigate();

  const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_TESTWINDOW || VITE_SECRET_KEY_FOR_TESTWINDOW;
  const { questions, isError: isExamError, isLoading: isQuestionLoading } = useCachedQuestions(examId);
  const { exam, isLoading: isExamLoading } = useCachedExam(examId);
  const { theme } = useTheme();

  useExamSecurity({
    eventDetails,
    submitted,
    setExamViolations,
    setWarningCount,
    warningCount,
    userId: user?._id,
    examId,
    handleSubmitTest: () => handleSubmitTest(),
    examContainerRef
  });

  // Fetch and organize questions
  useEffect(() => {
    if (!isExamLoading && !isQuestionLoading && questions?.length > 0) {
      questions.forEach(q => {
        if (!q.subject || q.subject.trim() === "") q.subject = "Unspecified";
      });

      const subjects = Array.from(new Set(questions.map(q => q.subject)));
      setEventDetails(prev => ({ ...prev, ...exam, questions, subjects }));
    }
  }, [questions, isExamLoading, isQuestionLoading]);

  useEffect(() => {
    if (eventDetails) {
      const cached = localStorage.getItem('testQuestions');

      if (!cached) {
        const reduced = eventDetails.questions.reduce((acc, quest) => {
          if (!quest.subject || quest.subject.trim() === "") quest.subject = "Unspecified";
          acc[quest.subject] = acc[quest.subject] || [];
          acc[quest.subject].push({ ...quest, index: acc[quest.subject].length + 1, status: 'unanswered', response: null });
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
    if (selectedSubject && subjectSpecificQuestions)
      setSelectedQuestion(subjectSpecificQuestions[selectedSubject][0]);
  }, [selectedSubject]);

  useEffect(() => {
    if (submitted) {
      const timeout = setTimeout(() => {
        navigate("/student/completed-exams");
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [submitted]);

  const handleSubmitTest = async () => {
    try {
      localStorage.removeItem('testQuestions');
      localStorage.removeItem('encryptedTimeLeft');

      const answers = calculateResultPayload(subjectSpecificQuestions, getCorrectResponse);
      const payload = {
        studentId: user._id,
        examId,
        status: "attempted",
        ...answers,
        violations: examViolations,
        warningCount,
      };

      const response = await submitResult(payload);
      if (response.status === 200) {
        setSubmitted(true);
        if (document.fullscreenElement) document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error submitting test:", err);
    }
  };

  if (!eventDetails) return <LoadingTest />;
  if (isExamError) {
    return (
      <div className='font-bold flex flex-col gap-8 mt-20 text-center'>
        <span className='text-indigo-900 text-4xl'>Questions not available for this exam!</span>
        <span className='text-indigo-900 text-xl'>Try contacting your institute for more info</span>
      </div>
    );
  }

  if (isExamLoading || isQuestionLoading) return <div>Loading...🥲</div>;

  return (
    <div ref={examContainerRef} className="exam-container">
      {/* Top Security Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-sm ${
        theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900 text-red-100'
      }`}>
        <div className="flex justify-between items-center">
          <span>🔒 EXAM MODE ACTIVE - Evalvo's Security Monitoring Enabled</span>
          <span>Violations: {examViolations.length} | Warnings: {warningCount}</span>
        </div>
      </div>

      {/* Main Exam Interface */}
      <div className={`py-16 flex min-h-screen flex-col lg:flex-row gap-2 mt-8`}>
        <div className='w-full lg:w-[80%] p-2 lg:p-4 gap-2 flex flex-col'>
          <div className={`p-4 rounded-md shadow-sm w-full border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
            <div className="flex justify-between items-center">
              <h1 className={`text-xl xl:text-2xl font-bold leading-snug ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {eventDetails?.batch?.name || 'Test Batch Name'}
              </h1>
              <h2 className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'}`}>
                {eventDetails?.batch?.year || ''}
              </h2>
            </div>
          </div>

          <div className="lg:hidden">
            <TestHeader />
            <CountdownTimer initialTime={eventDetails.duration} handleSubmitTest={handleSubmitTest} submitted={submitted} />
          </div>

          <QuestionSection
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            subjectSpecificQuestions={subjectSpecificQuestions}
            setSubjectSpecificQuestions={setSubjectSpecificQuestions}
            selectedSubject={selectedSubject}
          />
        </div>

        <div className='w-full lg:w-[25%] lg:block'>
          <div className="hidden lg:block">
            <TestHeader />
            <CountdownTimer initialTime={eventDetails.duration} handleSubmitTest={handleSubmitTest} submitted={submitted} />
          </div>
          <div className="w-full py-3 px-2">
            <QuestionListSection
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedQuestion={selectedQuestion}
              setSelectedQuestion={setSelectedQuestion}
              subjectSpecificQuestions={subjectSpecificQuestions}
              setSubjectSpecificQuestions={setSubjectSpecificQuestions}
              eventDetails={eventDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestWindow;
