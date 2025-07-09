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
import WarningHeaderForExams from './utils/WarningHeaderForExams';

const TestWindow = () => {
  const [eventDetails, setEventDetails] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [subjectSpecificQuestions, setSubjectSpecificQuestions] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [examViolations, setExamViolations] = useState([]);
  const [warningCount, setWarningCount] = useState(0);
  const [isStateRestored, setIsStateRestored] = useState(false);
  const [isInitialSetupComplete, setIsInitialSetupComplete] = useState(false);
  const [isSecurityHookInitialized, setIsSecurityHookInitialized] = useState(false);

  const examContainerRef = useRef(null);
  const { user } = useUser();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const examId = searchParams.get('examId');
  console.log("fs", examId);

  const navigate = useNavigate();

  useEffect(() => {
    if (!examId) {
      console.log("Exam Id lost");
      navigate('/student/student-landing');
    }
  }, [examId, navigate]);

  const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_TESTWINDOW || VITE_SECRET_KEY_FOR_TESTWINDOW;
  const { questions, isError: isExamError, isLoading: isQuestionLoading } = useCachedQuestions(examId);
  const { exam, isLoading: isExamLoading } = useCachedExam(examId);
  const { theme } = useTheme();

  // Enhanced useExamSecurity hook with toaster
  const {
    violationCount,
    warningCount: securityWarningCount,
    toasts,
    addToast,
    dismissToast,
    clearAllToasts,
    ToasterComponent
  } = useExamSecurity({
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

  // Utility functions for state persistence
  const saveStateToStorage = (key, data) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  };

  const loadStateFromStorage = (key) => {
    try {
      const encrypted = localStorage.getItem(key);
      if (encrypted) {
        const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error);
    }
    return null;
  };

  // Restore state on component mount
  useEffect(() => {
    if (!isStateRestored && examId) {
      const savedSelectedSubject = loadStateFromStorage(`selectedSubject_${examId}`);
      const savedSelectedQuestion = loadStateFromStorage(`selectedQuestion_${examId}`);
      const savedExamViolations = loadStateFromStorage(`examViolations_${examId}`);
      const savedWarningCount = loadStateFromStorage(`warningCount_${examId}`);

      if (savedSelectedSubject) {
        setSelectedSubject(savedSelectedSubject);
      }
      if (savedSelectedQuestion) {
        setSelectedQuestion(savedSelectedQuestion);
      }
      if (savedExamViolations && Array.isArray(savedExamViolations)) {
        setExamViolations(savedExamViolations);
      }
      // Don't restore warning count - let security hook handle it
      // This prevents conflicts between cached state and security monitoring
      
      setIsStateRestored(true);
    }
  }, [examId, isStateRestored]);

  // Save state whenever it changes (only after state is restored and security hook is initialized)
  useEffect(() => {
    if (isStateRestored && isSecurityHookInitialized && examId && selectedSubject) {
      saveStateToStorage(`selectedSubject_${examId}`, selectedSubject);
    }
  }, [selectedSubject, examId, isStateRestored, isSecurityHookInitialized]);

  useEffect(() => {
    if (isStateRestored && isSecurityHookInitialized && examId && selectedQuestion) {
      saveStateToStorage(`selectedQuestion_${examId}`, selectedQuestion);
    }
  }, [selectedQuestion, examId, isStateRestored, isSecurityHookInitialized]);

  useEffect(() => {
    if (isStateRestored && isSecurityHookInitialized && examId && Array.isArray(examViolations)) {
      saveStateToStorage(`examViolations_${examId}`, examViolations);
    }
  }, [examViolations, examId, isStateRestored, isSecurityHookInitialized]);

  useEffect(() => {
    if (isStateRestored && isSecurityHookInitialized && examId && typeof warningCount === 'number') {
      saveStateToStorage(`warningCount_${examId}`, warningCount);
    }
  }, [warningCount, examId, isStateRestored, isSecurityHookInitialized]);

  //Sync warning count from security hook with proper initialization
  useEffect(() => {
    if (!isSecurityHookInitialized && securityWarningCount !== undefined) {
      setIsSecurityHookInitialized(true);
      setWarningCount(securityWarningCount);
    } else if (isSecurityHookInitialized && securityWarningCount !== warningCount) {
      setWarningCount(securityWarningCount);
    }
  }, [securityWarningCount, warningCount, isSecurityHookInitialized]);

  // Fetch and organize questions
  useEffect(() => {
    if (!isExamLoading && !isQuestionLoading && questions?.length > 0) {
      questions.forEach(q => {
        if (!q.subject || q.subject.trim() === "") q.subject = "Unspecified";
      });

      const subjects = Array.from(new Set(questions.map(q => q.subject)));
      setEventDetails(prev => ({ ...prev, ...exam, questions, subjects }));
    }
  }, [questions, isExamLoading, isQuestionLoading, exam]);

  // Setup subject-specific questions with better caching logic
  useEffect(() => {
    if (eventDetails && isStateRestored && !isInitialSetupComplete) {
      const cached = localStorage.getItem('testQuestions');
      let questionsData = null;

      if (cached) {
        try {
          const bytes = CryptoJS.AES.decrypt(cached, secretKey);
          const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          
          // Validate cached data structure
          if (typeof decrypted === 'object' && decrypted !== null && !Array.isArray(decrypted)) {
            questionsData = decrypted;
          } else {
            console.warn('Invalid cached questions format, creating fresh questions');
          }
        } catch (error) {
          console.error('Error decrypting cached questions:', error);
          addToast('Error loading cached questions', 'error', 'Starting fresh exam session', 3000);
        }
      }

      // Create fresh questions if no valid cached data
      if (!questionsData) {
        questionsData = eventDetails.questions.reduce((acc, quest) => {
          if (!quest.subject || quest.subject.trim() === "") quest.subject = "Unspecified";
          acc[quest.subject] = acc[quest.subject] || [];
          acc[quest.subject].push({ ...quest, index: acc[quest.subject].length + 1, status: 'unanswered', response: null });
          return acc;
        }, {});
      }

      setSubjectSpecificQuestions(questionsData);
      setIsInitialSetupComplete(true);
    }
  }, [eventDetails, isStateRestored, isInitialSetupComplete, secretKey, addToast]);

  // Set default subject if none selected (only run once after initial setup)
  useEffect(() => {
    if (eventDetails && isInitialSetupComplete && !selectedSubject) {
      const defaultSubject = eventDetails.subjects[0] || "Unspecified";
      setSelectedSubject(defaultSubject);
    }
  }, [eventDetails, isInitialSetupComplete, selectedSubject]);

  // FIXED: Handle question selection logic - removed infinite loop
  useEffect(() => {
    if (
      selectedSubject &&
      subjectSpecificQuestions &&
      isInitialSetupComplete &&
      !selectedQuestion // Only run if no question is selected
    ) {
      const questionsForSubject = subjectSpecificQuestions[selectedSubject];
      if (questionsForSubject && questionsForSubject.length > 0) {
        setSelectedQuestion(questionsForSubject[0]);
      }
    }
  }, [selectedSubject, subjectSpecificQuestions, isInitialSetupComplete]); // Removed selectedQuestion from deps

  // Handle subject change - ensure valid question is selected
  useEffect(() => {
    if (
      selectedSubject &&
      subjectSpecificQuestions &&
      selectedQuestion &&
      isInitialSetupComplete
    ) {
      const questionsForSubject = subjectSpecificQuestions[selectedSubject];
      if (questionsForSubject && questionsForSubject.length > 0) {
        // Check if current question belongs to selected subject
        const questionExists = questionsForSubject.find(q => q._id === selectedQuestion._id);
        if (!questionExists) {
          // Current question doesn't belong to selected subject, select first question
          setSelectedQuestion(questionsForSubject[0]);
        }
      }
    }
  }, [selectedSubject, subjectSpecificQuestions, isInitialSetupComplete]); // Only depend on subject and questions, not selectedQuestion

  // Handle submission cleanup
  useEffect(() => {
    if (submitted) {
      // Clear all toasts when submitting
      clearAllToasts();
      
      // Clear all saved state
      localStorage.removeItem(`selectedSubject_${examId}`);
      localStorage.removeItem(`selectedQuestion_${examId}`);
      localStorage.removeItem(`examViolations_${examId}`);
      localStorage.removeItem(`warningCount_${examId}`);
      
      // Show submission success toast
      addToast(
        'Exam submitted successfully!',
        'info',
        'Redirecting to completed exams...',
        2000
      );
      
      const timeout = setTimeout(() => {
        navigate("/student/completed-exams");
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [submitted, navigate, clearAllToasts, addToast, examId]);

  // Save questions to localStorage with validation
  useEffect(() => {
    if (subjectSpecificQuestions && isInitialSetupComplete && isSecurityHookInitialized) {
      try {
        // Validate questions structure before saving
        if (typeof subjectSpecificQuestions === 'object' && subjectSpecificQuestions !== null && !Array.isArray(subjectSpecificQuestions)) {
          const encrypted = CryptoJS.AES.encrypt(JSON.stringify(subjectSpecificQuestions), secretKey).toString();
          localStorage.setItem('testQuestions', encrypted);
        }
      } catch (error) {
        console.error('Error saving questions to storage:', error);
      }
    }
  }, [subjectSpecificQuestions, secretKey, isInitialSetupComplete, isSecurityHookInitialized]);

  const handleSubmitTest = async () => {
    try {
      // Show submitting toast
      addToast(
        'Submitting exam...',
        'info',
        'Please wait while we process your submission',
        0 // Don't auto-dismiss
      );
      console.log("Submitting test with examId:", examId);
      console.log("🎀🎀🥲🥲🤍🤍")

      // Clear all saved state immediately
      localStorage.removeItem('testQuestions');
      localStorage.removeItem('encryptedTimeLeft');
      localStorage.removeItem(`selectedSubject_${examId}`);
      localStorage.removeItem(`selectedQuestion_${examId}`);
      localStorage.removeItem(`examViolations_${examId}`);
      localStorage.removeItem(`warningCount_${examId}`);
console.log("Submitting test with examId:", examId);
console.log("Subject Specific Questions:", subjectSpecificQuestions);
      const answers = calculateResultPayload(subjectSpecificQuestions, getCorrectResponse);
      console.log("Calculated answers:", answers);
      const payload = {
        studentId: user._id,
        examId,
        status: "attempted",
        ...answers,
        violations: examViolations,
        warningCount,
      };
console.log("Payload for submission:", payload);
      const response = await submitResult(payload);
      if (response.status === 200) {
        setSubmitted(true);
        if (document.fullscreenElement) {
          try {
            await document.exitFullscreen();
          } catch (error) {
            console.warn('Error exiting fullscreen:', error);
          }
        }
      } else {
        throw new Error(`Submission failed with status ${response.status}`);
      }
    } catch (err) {
      console.error("Error submitting test:", err);
      addToast(
        'Error submitting exam',
        'error',
        `Please try again. Error: ${err.message}`,
        0 // Don't auto-dismiss errors
      );
    }
    
    // Clean up external resources
    if (window?.electronAPI?.stopProctorEngine) {
      window.electronAPI.stopProctorEngine();
    }
    if (window?.electronAPI?.closeWindow) {
      window.electronAPI.closeWindow();
    }
  };

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      // Optional: Clean up on unmount if needed
      // You might want to keep the state for page reloads
    };
  }, []);

  // Show loading state
  if (!eventDetails || !isStateRestored || !isInitialSetupComplete || !isSecurityHookInitialized) return <LoadingTest />;
  
  // Show error state
  if (isExamError) {
    return (
      <div className='font-bold flex flex-col gap-8 mt-20 text-center'>
        <span className='text-indigo-900 text-4xl'>Questions not available for this exam!</span>
        <span className='text-indigo-900 text-xl'>Try contacting your institute for more info</span>
      </div>
    );
  }

  // Show loading state
  if (isExamLoading || isQuestionLoading) {
    return <div>Loading...🥲</div>;
  }

  return (
    <div ref={examContainerRef} className="exam-container">
      {/* Render Security Toaster */}
      <ToasterComponent />
      
      {/* Top Security Header */}
      <WarningHeaderForExams examViolations={examViolations} theme={theme} warningCount={warningCount}/>

      {/* Main Exam Interface */}
      <div className={`py-16 flex min-h-screen flex-col lg:flex-row gap-2 mt-8`}>
        <div className='w-full lg:w-[80%] p-2 lg:p-4 gap-2 flex flex-col'>
          <div className={`p-4 rounded-md shadow-sm w-full border ${
            theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
          }`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-xl xl:text-2xl font-bold leading-snug flex flex-col ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {eventDetails?.batch?.name || 'Batch Name'}
                <h2 className={`text-xl xl:text-2xl font-bold leading-snug flex flex-col ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}> 

                {eventDetails?.name || 'Test Name'}
                </h2>
              </h2>
              <div className="flex items-center gap-2">
                <h2 className={`px-3 py-1 rounded-full text-sm font-medium ${
                  theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'
                }`}>
                  {eventDetails?.batch?.year || ''}
                </h2>
                {/* Security Status Indicator */}
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  warningCount >= 3 
                    ? 'bg-red-100 text-red-800' 
                    : examViolations.length > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {warningCount >= 3 ? '🚨' : examViolations.length > 0 ? '⚠️' : '✅'}
                  {warningCount >= 3 ? 'High Alert' : examViolations.length > 0 ? 'Monitored' : 'Secure'}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <TestHeader 
            handleSubmitTest={handleSubmitTest}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject} 
            subjectSpecificQuestions={subjectSpecificQuestions}
            setSubjectSpecificQuestions={setSubjectSpecificQuestions}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            />

            <CountdownTimer 
              initialTime={eventDetails.duration} 
              handleSubmitTest={handleSubmitTest} 
              submitted={submitted}  
              examId={examId}
            />
          </div>

          <QuestionSection
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            subjectSpecificQuestions={subjectSpecificQuestions}
            setSubjectSpecificQuestions={setSubjectSpecificQuestions}
            selectedSubject={selectedSubject}
            handleSubmitTest={handleSubmitTest}
          />
        </div>

        <div className='w-full lg:w-[25%] lg:block'>
          <div className="hidden lg:block">
                       <TestHeader 
            handleSubmitTest={handleSubmitTest}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject} 
            subjectSpecificQuestions={subjectSpecificQuestions}
            setSubjectSpecificQuestions={setSubjectSpecificQuestions}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            />
            <CountdownTimer 
              initialTime={eventDetails.duration} 
              handleSubmitTest={handleSubmitTest} 
              submitted={submitted} 
              examId={examId} 
            />
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