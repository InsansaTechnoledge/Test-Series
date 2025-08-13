import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/currentUserContext";
import { useCachedQuestions } from "../../hooks/useCachedQuestions";
import { useCachedExam } from "../../hooks/useCachedExam";
import { useTheme } from "../../hooks/useTheme";
import CryptoJS from "crypto-js";
import { VITE_SECRET_KEY_FOR_TESTWINDOW } from "../constants/env";

import { getCorrectResponse, calculateResultPayload } from "./utils/examUtils";
import { submitResult } from "../../utils/services/resultService";
import { useExamSecurity } from "./hooks/useExamSecurity";
import CountdownTimer from "./TestTimer/CountdownTimer";
import QuestionListSection from "./QuestionListSection";
import TestHeader from "./TestWarning";
import QuestionSection from "./QuestionSection";
import LoadingTest from "./LoadingTest";
import WarningHeaderForExams from "./utils/WarningHeaderForExams";
import { useCallback } from "react";
import { useExamManagement } from "../../hooks/UseExam";
import BioBreakTimerUI from "./TestTimer/BioBreakTimerUI";
import { Shield, AlertTriangle, CheckCircle, Clock, Users, Calendar, User, BookOpen, Timer, Send } from "lucide-react";

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
  const [bioBreakTimeLeft, setBioBreakTimeLeft] = useState(0);
  const bioBreakIntervalRef = useRef(null);

  const examContainerRef = useRef(null);
  const { user } = useUser();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const examId = searchParams.get("examId");
  const isProctorRunning = searchParams.get("isProctorRunning") === "true";
  const { exams } = useExamManagement();

  const currentExam = exams.find((exam) => exam.id === examId);
  const isAutoSubmittable = currentExam?.auto_submittable;

  console.log("Current Exam Data:", currentExam.auto_submittable);
  console.log("fs", examId);

  const navigate = useNavigate();

  useEffect(() => {
    if (!examId) {
      console.log("Exam Id lost");
      navigate("/student/student-landing");
    }
  }, [examId, navigate]);

  const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_TESTWINDOW || VITE_SECRET_KEY_FOR_TESTWINDOW;
  const {
    questions,
    isError: isExamError,
    isLoading: isQuestionLoading,
  } = useCachedQuestions(examId);
  const { exam, isLoading: isExamLoading } = useCachedExam(examId);
  const { theme } = useTheme();
  const handleSubmitRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Enhanced useExamSecurity hook with toaster
  const {
    violationCount,
    warningCount: securityWarningCount,
    toasts,
    addToast,
    dismissToast,
    clearAllToasts,
    ToasterComponent,
  } = useExamSecurity({
    eventDetails,
    submitted,
    setExamViolations,
    setWarningCount,
    warningCount,
    userId: user?._id,
    examId,
    handleSubmitTest: () => handleSubmitRef.current?.(),
    examContainerRef,
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

      setIsStateRestored(true);
    }
  }, [examId, isStateRestored]);

  // Save state whenever it changes
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
    if (isStateRestored && isSecurityHookInitialized && examId && typeof warningCount === "number") {
      saveStateToStorage(`warningCount_${examId}`, warningCount);
    }
  }, [warningCount, examId, isStateRestored, isSecurityHookInitialized]);

  // Sync warning count from security hook
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
      questions.forEach((q) => {
        if (!q.subject || q.subject.trim() === "") q.subject = "Unspecified";
      });

      const subjects = Array.from(new Set(questions.map((q) => q.subject)));
      setEventDetails((prev) => ({ ...prev, ...exam, questions, subjects }));
    }
  }, [questions, isExamLoading, isQuestionLoading, exam]);

  // Setup subject-specific questions
  useEffect(() => {
    if (eventDetails && isStateRestored && !isInitialSetupComplete) {
      const cached = localStorage.getItem("testQuestions");
      let questionsData = null;

      if (cached) {
        try {
          const bytes = CryptoJS.AES.decrypt(cached, secretKey);
          const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          if (typeof decrypted === "object" && decrypted !== null && !Array.isArray(decrypted)) {
            questionsData = decrypted;
          } else {
            console.warn("Invalid cached questions format, creating fresh questions");
          }
        } catch (error) {
          console.error("Error decrypting cached questions:", error);
          addToast("Error loading cached questions", "error", "Starting fresh exam session", 3000);
        }
      }

      if (!questionsData) {
        function shuffle(array) {
          return array.sort(() => Math.random() - 0.5);
        }

        questionsData = eventDetails.questions.reduce((acc, quest) => {
          const subject = quest.subject?.trim() || "Unspecified";
          acc[subject] = acc[subject] || [];
          acc[subject].push({ ...quest, status: "unanswered", response: null });
          return acc;
        }, {});

        Object.keys(questionsData).forEach((subject) => {
          questionsData[subject] = shuffle(questionsData[subject]);
        });
      }

      setSubjectSpecificQuestions(questionsData);
      setIsInitialSetupComplete(true);
    }
  }, [eventDetails, isStateRestored, isInitialSetupComplete, secretKey, addToast]);

  // Set default subject
  useEffect(() => {
    if (eventDetails && isInitialSetupComplete && !selectedSubject) {
      const defaultSubject = eventDetails.subjects[0] || "Unspecified";
      setSelectedSubject(defaultSubject);
    }
  }, [eventDetails, isInitialSetupComplete, selectedSubject]);

  // Handle question selection
  useEffect(() => {
    if (selectedSubject && subjectSpecificQuestions && isInitialSetupComplete && !selectedQuestion) {
      const questionsForSubject = subjectSpecificQuestions[selectedSubject];
      if (questionsForSubject && questionsForSubject.length > 0) {
        setSelectedQuestion(questionsForSubject[0]);
      }
    }
  }, [selectedSubject, subjectSpecificQuestions, isInitialSetupComplete]);

  // Handle subject change
  useEffect(() => {
    if (selectedSubject && subjectSpecificQuestions && selectedQuestion && isInitialSetupComplete) {
      const questionsForSubject = subjectSpecificQuestions[selectedSubject];
      if (questionsForSubject && questionsForSubject.length > 0) {
        const questionExists = questionsForSubject.find((q) => q._id === selectedQuestion._id);
        if (!questionExists) {
          setSelectedQuestion(questionsForSubject[0]);
        }
      }
    }
  }, [selectedSubject, subjectSpecificQuestions, isInitialSetupComplete]);

  // Handle submission cleanup
  useEffect(() => {
    if (submitted) {
      clearAllToasts();

      localStorage.removeItem(`selectedSubject_${examId}`);
      localStorage.removeItem(`selectedQuestion_${examId}`);
      localStorage.removeItem(`examViolations_${examId}`);
      localStorage.removeItem(`warningCount_${examId}`);

      addToast("Exam submitted successfully!", "info", "Redirecting to completed exams...", 2000);

      const timeout = setTimeout(() => {
        navigate("/student/completed-exams");
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [submitted, navigate, clearAllToasts, addToast, examId]);

  // Save questions to localStorage
  useEffect(() => {
    if (subjectSpecificQuestions && isInitialSetupComplete && isSecurityHookInitialized) {
      try {
        if (typeof subjectSpecificQuestions === "object" && subjectSpecificQuestions !== null && !Array.isArray(subjectSpecificQuestions)) {
          const encrypted = CryptoJS.AES.encrypt(JSON.stringify(subjectSpecificQuestions), secretKey).toString();
          localStorage.setItem("testQuestions", encrypted);
        }
      } catch (error) {
        console.error("Error saving questions to storage:", error);
      }
    }
  }, [subjectSpecificQuestions, secretKey, isInitialSetupComplete, isSecurityHookInitialized]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmitTest = useCallback(async () => {
    try {
      addToast("Submitting exam...", "info", "Please wait while we process your submission", 0);

      console.log("Submitting test with examId:", examId);
      console.log("Subject Specific Questions:", subjectSpecificQuestions);

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
        addToast("Exam submitted successfully! Redirecting to completed exams...", "info", "Please wait while we process your submission", 0);
        localStorage.removeItem("testQuestions");
        localStorage.removeItem(`encryptedTimeLeft_${examId}`);
        localStorage.removeItem(`selectedSubject_${examId}`);
        localStorage.removeItem(`selectedQuestion_${examId}`);
        localStorage.removeItem(`examViolations_${examId}`);
        localStorage.removeItem(`warningCount_${examId}`);
        await window.electronAPI?.clearDbEvents();
        setSubmitted(true);
        if (document.fullscreenElement) {
          try {
            await document.exitFullscreen();
          } catch (error) {
            console.warn("Error exiting fullscreen:", error);
          }
        }
      } else {
        throw new Error(`Submission failed with status ${response.status}`);
      }
    } catch (err) {
      console.error("Error submitting test:", err);
      addToast("Error submitting exam", "error", `Please try again. Error: ${err.message}`, 0);
    }
    if (window?.electronAPI?.stopProctorEngine) {
      console.log("⏸️ Trying to stop proctor engine...");
      await window.electronAPI.stopProctorEngine();
    } else {
      console.error("❌ stopProctorEngine not available");
    }

    if (window?.electronAPI?.stopProctorEngine) {
      console.log("window.electronAPI:", window.electronAPI);
      window.electronAPI.stopProctorEngine();
    }
    if (window?.electronAPI?.closeWindow) {
      window.electronAPI.closeWindow();
    }
  }, [examId, subjectSpecificQuestions, getCorrectResponse, examViolations, warningCount, user._id, setSubmitted, addToast, submitResult]);

  useEffect(() => {
    handleSubmitRef.current = handleSubmitTest;
  }, [handleSubmitTest]);

  // Show loading state
  if (!eventDetails || !isStateRestored || !isInitialSetupComplete || !isSecurityHookInitialized)
    return <LoadingTest />;

  // Show error state
  if (isExamError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-red-600 mb-2">Questions Not Available</h1>
          <p className="text-xl text-gray-600">This exam is currently unavailable.</p>
          <p className="text-lg text-gray-500">Please contact your institute for assistance.</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isExamLoading || isQuestionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  const handleBioBreak = async (durationInMs) => {
    const eventId = "default";

    try {
      setIsPaused(true);
      setBioBreakTimeLeft(durationInMs / 1000);

      addToast("Bio break started", "info", `Proctor monitoring paused for ${durationInMs / 60000} minutes`, durationInMs);

      if (window?.electronAPI?.stopProctorEngine) {
        await window.electronAPI.stopProctorEngine();
      }

      if (bioBreakIntervalRef.current) clearInterval(bioBreakIntervalRef.current);
      bioBreakIntervalRef.current = setInterval(() => {
        setBioBreakTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(bioBreakIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(async () => {
        if (window?.electronAPI?.startProctorEngineAsync) {
          const params = {
            userId: user._id,
            examId,
            eventId,
          };
          await window.electronAPI.startProctorEngineAsync(params);
        }
        setIsPaused(false);
        addToast("Bio break ended", "info", "Proctor monitoring resumed", 3000);
      }, durationInMs);
    } catch (error) {
      console.error("Error during bio break:", error);
      addToast("Error", "error", "Failed to initiate bio break", 3000);
    }
  };

  const getSecurityStatus = () => {
    if (warningCount >= 3) {
      return { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200", label: "High Alert" };
    } else if (examViolations.length > 0) {
      return { icon: Shield, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200", label: "Monitored" };
    } else {
      return { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", border: "border-green-200", label: "Secure" };
    }
  };

  const securityStatus = getSecurityStatus();
  const SecurityIcon = securityStatus.icon;

  return (
    <div ref={examContainerRef} className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {/* Security Toaster */}
      <ToasterComponent />

      {/* Security Header */}
      <WarningHeaderForExams examViolations={examViolations} theme={theme} warningCount={warningCount} />

      {/* Professional Exam Header */}
      <div className={`border-b-2 ${theme === 'light' ? 'bg-white border-blue-200' : 'bg-gray-800 border-blue-600'} shadow-sm`}>
        <div className="mt-12 mx-auto px-6 py-4">
          {/* Top Row - Exam Info & Timer */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <BookOpen className={`h-8 w-8 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                <div>
                  <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {eventDetails?.name || "Examination"}
                  </h1>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {eventDetails?.batch?.name || "Batch"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer with prominent display */}
             
                <CountdownTimer
                  initialTime={eventDetails.duration}
                  handleSubmitTest={handleSubmitTest}
                  submitted={submitted}
                  examId={examId}
                  pause={isPaused}
                />
            </div>
          </div>

          {/* Bottom Row - Student Info, Security Status & Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <User className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {user?.name || "Student"}
                </span>
              </div>
              <div className={`h-4 w-px ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'}`}></div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  ID: {user?._id?.slice(-6) || "------"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Security Status */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${securityStatus.bg} ${securityStatus.border} border`}>
                <SecurityIcon className={`h-4 w-4 ${securityStatus.color}`} />
                <span className={`text-xs font-medium ${securityStatus.color}`}>
                  {securityStatus.label}
                </span>
              </div>

              {/* Bio Break Dropdown */}
              {window?.electronAPI && (
                <select
                  className={`text-xs px-3 py-1 rounded border ${
                    theme === 'light'
                      ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                  }`}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "bio1") {
                      handleBioBreak(3 * 60 * 1000);
                    } else if (value === "bio2") {
                      handleBioBreak(5 * 60 * 1000);
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="">Bio Break</option>
                  <option value="bio1">3 minutes</option>
                  <option value="bio2">5 minutes</option>
                </select>
              )}

              {/* Submit Button - More prominent */}
              <button
                onClick={handleSubmitTest}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Submit Exam</span>
              </button>
            </div>
          </div>
        </div>

        {/* Test Header Controls */}
        <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
          <div className="max-w-7xl mx-auto px-6 py-2">
            <TestHeader 
              isAutoSubmittable={isAutoSubmittable} 
              isProctorRunning={isProctorRunning} 
              handleSubmit={handleSubmitTest} 
              setSelectedQuestion={setSelectedQuestion}
            />
          </div>
        </div>
      </div>

      {/* Bio Break Timer Overlay */}
      {isPaused && bioBreakTimeLeft > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <BioBreakTimerUI
            formatTime={formatTime}
            bioBreakTimeLeft={bioBreakTimeLeft}
            setBioBreakTimeLeft={setBioBreakTimeLeft}
            setIsPaused={setIsPaused}
          />
        </div>
      )}

      {/* Main Exam Content - Traditional Layout */}
      <div className=" mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Question Navigator */}
          <div className="w-80 flex-shrink-0">
            <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border rounded-lg shadow-sm h-fit sticky top-6`}>
              <div className={`px-4 py-3 border-b ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-750'}`}>
                <h3 className={`font-semibold text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Question Navigator
                </h3>
              </div>
              <div className="p-4">
                <QuestionListSection
                  selectedSubject={selectedSubject}
                  setSelectedSubject={isPaused ? () => {} : setSelectedSubject}
                  selectedQuestion={selectedQuestion}
                  setSelectedQuestion={isPaused ? () => {} : setSelectedQuestion}
                  subjectSpecificQuestions={subjectSpecificQuestions}
                  setSubjectSpecificQuestions={isPaused ? () => {} : setSubjectSpecificQuestions}
                  eventDetails={eventDetails}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area - Question Display */}
          <div className="flex-1 min-w-0">
            <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border rounded-lg shadow-sm`}> 
              
              <div className="p-6">
                <QuestionSection
                  selectedQuestion={selectedQuestion}
                  setSelectedQuestion={isPaused ? () => {} : setSelectedQuestion}
                  subjectSpecificQuestions={subjectSpecificQuestions}
                  setSubjectSpecificQuestions={isPaused ? () => {} : setSubjectSpecificQuestions}
                  selectedSubject={selectedSubject}
                  handleSubmitTest={isPaused ? () => {} : handleSubmitTest}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestWindow;