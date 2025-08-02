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
  const [isSecurityHookInitialized, setIsSecurityHookInitialized] =
    useState(false);

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

  const secretKey =
    import.meta.env.VITE_SECRET_KEY_FOR_TESTWINDOW ||
    VITE_SECRET_KEY_FOR_TESTWINDOW;
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
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        secretKey
      ).toString();
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
      const savedSelectedSubject = loadStateFromStorage(
        `selectedSubject_${examId}`
      );
      const savedSelectedQuestion = loadStateFromStorage(
        `selectedQuestion_${examId}`
      );
      const savedExamViolations = loadStateFromStorage(
        `examViolations_${examId}`
      );
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
    if (
      isStateRestored &&
      isSecurityHookInitialized &&
      examId &&
      selectedSubject
    ) {
      saveStateToStorage(`selectedSubject_${examId}`, selectedSubject);
    }
  }, [selectedSubject, examId, isStateRestored, isSecurityHookInitialized]);

  useEffect(() => {
    if (
      isStateRestored &&
      isSecurityHookInitialized &&
      examId &&
      selectedQuestion
    ) {
      saveStateToStorage(`selectedQuestion_${examId}`, selectedQuestion);
    }
  }, [selectedQuestion, examId, isStateRestored, isSecurityHookInitialized]);

  useEffect(() => {
    if (
      isStateRestored &&
      isSecurityHookInitialized &&
      examId &&
      Array.isArray(examViolations)
    ) {
      saveStateToStorage(`examViolations_${examId}`, examViolations);
    }
  }, [examViolations, examId, isStateRestored, isSecurityHookInitialized]);

  useEffect(() => {
    if (
      isStateRestored &&
      isSecurityHookInitialized &&
      examId &&
      typeof warningCount === "number"
    ) {
      saveStateToStorage(`warningCount_${examId}`, warningCount);
    }
  }, [warningCount, examId, isStateRestored, isSecurityHookInitialized]);

  //Sync warning count from security hook with proper initialization
  useEffect(() => {
    if (!isSecurityHookInitialized && securityWarningCount !== undefined) {
      setIsSecurityHookInitialized(true);
      setWarningCount(securityWarningCount);
    } else if (
      isSecurityHookInitialized &&
      securityWarningCount !== warningCount
    ) {
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

  // Setup subject-specific questions with better caching logic
  useEffect(() => {
    if (eventDetails && isStateRestored && !isInitialSetupComplete) {
      const cached = localStorage.getItem("testQuestions");
      let questionsData = null;

      if (cached) {
        try {
          const bytes = CryptoJS.AES.decrypt(cached, secretKey);
          const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          // Validate cached data structure
          if (
            typeof decrypted === "object" &&
            decrypted !== null &&
            !Array.isArray(decrypted)
          ) {
            questionsData = decrypted;
          } else {
            console.warn(
              "Invalid cached questions format, creating fresh questions"
            );
          }
        } catch (error) {
          console.error("Error decrypting cached questions:", error);
          addToast(
            "Error loading cached questions",
            "error",
            "Starting fresh exam session",
            3000
          );
        }
      }

      // Create fresh questions if no valid cached data
      if (!questionsData) {
        // questionsData = eventDetails.questions.reduce((acc, quest) => {
        //   if (!quest.subject || quest.subject.trim() === "") quest.subject = "Unspecified";
        //   acc[quest.subject] = acc[quest.subject] || [];
        //   acc[quest.subject].push({ ...quest, index: acc[quest.subject].length + 1, status: 'unanswered', response: null });
        //   return acc;
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
  }, [
    eventDetails,
    isStateRestored,
    isInitialSetupComplete,
    secretKey,
    addToast,
  ]);

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
        const questionExists = questionsForSubject.find(
          (q) => q._id === selectedQuestion._id
        );
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
        "Exam submitted successfully!",
        "info",
        "Redirecting to completed exams...",
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
    if (
      subjectSpecificQuestions &&
      isInitialSetupComplete &&
      isSecurityHookInitialized
    ) {
      try {
        // Validate questions structure before saving
        if (
          typeof subjectSpecificQuestions === "object" &&
          subjectSpecificQuestions !== null &&
          !Array.isArray(subjectSpecificQuestions)
        ) {
          const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(subjectSpecificQuestions),
            secretKey
          ).toString();
          localStorage.setItem("testQuestions", encrypted);
        }
      } catch (error) {
        console.error("Error saving questions to storage:", error);
      }
    }
  }, [
    subjectSpecificQuestions,
    secretKey,
    isInitialSetupComplete,
    isSecurityHookInitialized,
  ]);
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmitTest = useCallback(async () => {
    try {
      addToast(
        "Submitting exam...",
        "info",
        "Please wait while we process your submission",
        0
      );

      console.log("Submitting test with examId:", examId);
      console.log("Subject Specific Questions:", subjectSpecificQuestions);

      localStorage.removeItem("testQuestions");
      localStorage.removeItem(`encryptedTimeLeft_${examId}`);
      localStorage.removeItem(`selectedSubject_${examId}`);
      localStorage.removeItem(`selectedQuestion_${examId}`);
      localStorage.removeItem(`examViolations_${examId}`);
      localStorage.removeItem(`warningCount_${examId}`);

      const answers = calculateResultPayload(
        subjectSpecificQuestions,
        getCorrectResponse
      );
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
        addToast(
          "Exam submitted successfully! Redirecting to completed exams...",
          "info",
          "Please wait while we process your submission",
          0
        );
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
      addToast(
        "Error submitting exam",
        "error",
        `Please try again. Error: ${err.message}`,
        0
      );
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
  }, [
    examId,
    subjectSpecificQuestions,
    getCorrectResponse,
    examViolations,
    warningCount,
    user._id,
    setSubmitted,
    addToast,
    submitResult,
  ]);

  useEffect(() => {
    handleSubmitRef.current = handleSubmitTest;
  }, [handleSubmitTest]);

  // Show loading state
  if (
    !eventDetails ||
    !isStateRestored ||
    !isInitialSetupComplete ||
    !isSecurityHookInitialized
  )
    return <LoadingTest />;

  // Show error state
  if (isExamError) {
    return (
      <div className="font-bold flex flex-col gap-8 mt-20 text-center">
        <span className="text-indigo-900 text-4xl">
          Questions not available for this exam!
        </span>
        <span className="text-indigo-900 text-xl">
          Try contacting your institute for more info
        </span>
      </div>
    );
  }

  // Show loading state
  if (isExamLoading || isQuestionLoading) {
    return <div>Loading...🥲</div>;
  }

  const handleBioBreak = async (durationInMs) => {
    const eventId = "default";

    try {
      setIsPaused(true);
      setBioBreakTimeLeft(durationInMs / 1000); // in seconds

      addToast(
        "Bio break started",
        "info",
        `Proctor monitoring paused for ${durationInMs / 60000} minutes`,
        durationInMs
      );

      if (window?.electronAPI?.stopProctorEngine) {
        await window.electronAPI.stopProctorEngine();
      }

      // Start countdown timer
      if (bioBreakIntervalRef.current)
        clearInterval(bioBreakIntervalRef.current);
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
          const params={
            userId: user._id,
            examId,
            eventId,
          }
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

  return (
    <div ref={examContainerRef} className="exam-container min-h-screen overflow-y-auto">
      {/* Render Security Toaster */}
      <ToasterComponent />

      {/* Top Security Header */}
      <WarningHeaderForExams
        examViolations={examViolations}
        theme={theme}
        warningCount={warningCount}
      />

      {/* Main Exam Interface */}
     
      <div className={`py-16 flex min-h-screen flex-col lg:flex-row gap-2 mt-8`}>
        <div className='w-full p-2 lg:p-4 gap-2 flex flex-col'>
          <div className={`p-4 rounded-md shadow-sm w-full border ${
            theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
          }`}>
            <div className="flex justify-between items-center">
              <h2
                className={`text-xl xl:text-2xl font-bold leading-snug flex flex-col ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                {eventDetails?.batch?.name || "Batch Name"}
                <h2
                  className={`text-xl xl:text-2xl font-bold leading-snug flex flex-col ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  {eventDetails?.name || "Test Name"}
                </h2>
              </h2>
              <div className="flex items-center gap-2">
                <h2
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    theme === "light"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {eventDetails?.batch?.year || ""}
                </h2>

                {/** BIO Break */}

                {window?.electronAPI && (
                  <div className="flex items-center justify-center">
                    <div
                      className={`rounded-xl shadow-sm px-4 py-2 w-full max-w-xs transition-all ${
                        theme === "light"
                          ? "bg-green-100 text-green-800"
                          : "bg-green-800 text-green-100"
                      }`}
                    >
                      <label
                        htmlFor="bio-break-select"
                        className="block text-sm font-semibold mb-1"
                      >
                        Request a Bio Break
                      </label>
                      <select
                        id="bio-break-select"
                        className={`w-full px-3 py-2 rounded-lg border outline-none transition-all text-sm font-medium shadow-sm ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-green-400"
                            : "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-green-500"
                        }`}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "bio1") {
                            handleBioBreak(3 * 60 * 1000); // 3 min
                          } else if (value === "bio2") {
                            handleBioBreak(5 * 60 * 1000); // 5 min
                          }
                        }}
                      >
                        <option value="">Choose a Reason</option>
                        <option value="bio1">Bio Break - Short (3 min)</option>
                        <option value="bio2">Bio Break - Long (5 min)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Security Status Indicator */}
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    warningCount >= 3
                      ? "bg-red-100 text-red-800"
                      : examViolations.length > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {warningCount >= 3
                    ? "🚨"
                    : examViolations.length > 0
                    ? "⚠️"
                    : "✅"}
                  {warningCount >= 3
                    ? "High Alert"
                    : examViolations.length > 0
                    ? "Monitored"
                    : "Secure"}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <TestHeader isAutoSubmittable={isAutoSubmittable} isProctorRunning={isProctorRunning} handleSubmit={handleSubmitTest} setSelectedQuestion={setSelectedQuestion}/>

            <CountdownTimer
              initialTime={eventDetails.duration}
              handleSubmitTest={handleSubmitTest}
              submitted={submitted}
              examId={examId}
              pause={isPaused}
            />
          </div>

          {isPaused && bioBreakTimeLeft > 0 && (
            <BioBreakTimerUI
              formatTime={formatTime}
              bioBreakTimeLeft={bioBreakTimeLeft}
              setBioBreakTimeLeft={setBioBreakTimeLeft}
              setIsPaused={setIsPaused}
            />
          )}

          <QuestionSection
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={isPaused ? () => {} : setSelectedQuestion}
            subjectSpecificQuestions={subjectSpecificQuestions}
            setSubjectSpecificQuestions={
              isPaused ? () => {} : setSubjectSpecificQuestions
            }
            selectedSubject={selectedSubject}
            handleSubmitTest={isPaused ? () => {} : handleSubmitTest}
          />
        </div>

        <div className="w-full lg:w-[25%] lg:block">
          <div className="hidden lg:block">
          <TestHeader isAutoSubmittable={isAutoSubmittable} isProctorRunning={isProctorRunning} handleSubmit={handleSubmitTest} setSelectedQuestion={setSelectedQuestion}/>
          <CountdownTimer
              initialTime={eventDetails.duration}
              handleSubmitTest={handleSubmitTest}
              submitted={submitted}
              examId={examId}
              pause={isPaused}
            />
          </div>

          <div className="w-full py-3 px-2">
            <QuestionListSection
              selectedSubject={selectedSubject}
              setSelectedSubject={isPaused ? () => {} : setSelectedSubject}
              selectedQuestion={selectedQuestion}
              setSelectedQuestion={isPaused ? () => {} : setSelectedQuestion}
              subjectSpecificQuestions={subjectSpecificQuestions}
              setSubjectSpecificQuestions={
                isPaused ? () => {} : setSubjectSpecificQuestions
              }
              eventDetails={eventDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestWindow;
