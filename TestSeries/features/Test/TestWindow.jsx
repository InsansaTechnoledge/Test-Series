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

  //Sync warning count from security hook
  useEffect(() => {
    if (securityWarningCount !== warningCount) {
      setWarningCount(securityWarningCount);
    }
  }, [securityWarningCount, warningCount]);

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
        try {
          const bytes = CryptoJS.AES.decrypt(cached, secretKey);
          const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          setSubjectSpecificQuestions(decrypted);
        } catch (error) {
          console.error('Error decrypting cached questions:', error);
          addToast('Error loading cached questions', 'error', 'Starting fresh exam session', 3000);
          
          // Fallback to fresh questions
          const reduced = eventDetails.questions.reduce((acc, quest) => {
            if (!quest.subject || quest.subject.trim() === "") quest.subject = "Unspecified";
            acc[quest.subject] = acc[quest.subject] || [];
            acc[quest.subject].push({ ...quest, index: acc[quest.subject].length + 1, status: 'unanswered', response: null });
            return acc;
          }, {});
          setSubjectSpecificQuestions(reduced);
        }
      }

      setSelectedSubject(eventDetails.subjects[0] || "Unspecified");
    }
  }, [eventDetails, secretKey,addToast]);

  useEffect(() => {
    if (selectedSubject && subjectSpecificQuestions && !selectedQuestion) {
      const questionsForSubject = subjectSpecificQuestions[selectedSubject];
      if (questionsForSubject && questionsForSubject.length > 0) {
        setSelectedQuestion(questionsForSubject[0]);
      }
    }
  }, [selectedSubject, subjectSpecificQuestions, selectedQuestion]);
  

  useEffect(() => {
    if (
      selectedSubject &&
      subjectSpecificQuestions &&
      !selectedQuestion // ✅ Only set if none already selected
    ) {
      const questionsForSubject = subjectSpecificQuestions[selectedSubject];
      if (questionsForSubject && questionsForSubject.length > 0) {
        setSelectedQuestion(questionsForSubject[0]);
      } else {
        const availableSubjects = Object.keys(subjectSpecificQuestions);
        if (availableSubjects.length > 0) {
          setSelectedSubject(availableSubjects[0]);
          setSelectedQuestion(subjectSpecificQuestions[availableSubjects[0]][0]);
        }
      }
    }
  }, [selectedSubject, subjectSpecificQuestions, selectedQuestion]);
  
  useEffect(() => {
    if (submitted) {
      // Clear all toasts when submitting
      clearAllToasts();
      
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
  }, [submitted, navigate,clearAllToasts, addToast]);

  const handleSubmitTest = async () => {
    try {
      // Show submitting toast
      addToast(
        'Submitting exam...',
        'info',
        'Please wait while we process your submission',
        0 // Don't auto-dismiss
      );

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

  // Show loading state
  if (!eventDetails) return <LoadingTest />;
  
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
            <TestHeader />
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
          />
        </div>

        <div className='w-full lg:w-[25%] lg:block'>
          <div className="hidden lg:block">
            <TestHeader />
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