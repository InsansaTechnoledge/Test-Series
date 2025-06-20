import React, { useEffect, useState } from 'react';
import QuestionListSection from './QuestionListSection';
import QuestionSection from './QuestionSection';
import CountdownTimer from './TestTimer/CountdownTimer';
import CryptoJS from 'crypto-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/currentUserContext';
import { useCachedQuestions } from '../../hooks/useCachedQuestions';
import { useCachedExam } from '../../hooks/useCachedExam';
import { calculateResult } from './utils/resultCalculator';
import { submitResult } from '../../utils/services/resultService';
import SubmitModal from './utils/SubmitResultComponent';

const TestWindow = () => {
  const [eventDetails, setEventDetails] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [subjectSpecificQuestions, setSubjectSpecificQuestions] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [warning, setWarning] = useState(null);
  const [warningCount, setWarningCount] = useState(0);
  const [proctorRunning, setProctorRunning] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [allWarnings, setAllWarnings] = useState([]);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const { user } = useUser();
  const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_TESTWINDOW;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  // const userId = searchParams.get('userId');
  const examId = searchParams.get('examId');
  // const eventId = searchParams.get('eventId');
  // const [proctorStatus, setProctorStatus] = useState('Initializing...');
  // const examId = "aa632eab-74ad-4a6b-a675-60c571257c00";
  const { questions, isError: isExamError, isLoading: isQuestionLoading } = useCachedQuestions(examId);
  const { exam, isLoading: isExamLoading } = useCachedExam(examId);

  useEffect(() => {
    if (!isExamLoading && !isQuestionLoading && questions && questions.length > 0) {
      for (const quest of questions) {
                      if (!quest.subject || quest.subject.trim() === "") {
            quest.subject = "Unspecified";  // Replace empty subject with "Unspecified"
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
          // Check if the subject is empty or null


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

      // Set the selected subject (use the first valid subject if possible)
      setSelectedSubject(eventDetails.subjects[0] || "Unspecified");
    }
  }, [eventDetails]);


  useEffect(() => {
    if (eventDetails) {
      const cached = localStorage.getItem('testQuestions');
      if (!cached) {
        const reduced = eventDetails.questions.reduce((acc, quest) => {
          // Avoid including empty subjects
          if (quest.subject.trim() === "") {
            quest.subject = "Unspecified"; // or just exclude it
          }

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

      setSelectedSubject(eventDetails.subjects[0]);
    }
  }, [eventDetails]);

  useEffect(() => {
    if (selectedSubject && subjectSpecificQuestions) {
      setSelectedQuestion(subjectSpecificQuestions[selectedSubject][0]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (submitted) {
      handleSubmitTest();
    }
  }, [submitted]);

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




  const handleSubmitTest = async () => {
    try {
      localStorage.removeItem('testQuestions');
      localStorage.removeItem('encryptedTimeLeft');

      const answers = Object.entries(subjectSpecificQuestions).reduce((acc, [, value]) => {
        const objs = value.map((val) => ({
          question_id: val.id,
          user_response: val.response,
          correct_response: getCorrectResponse(val),
          question_type: val.question_type,
          positive_marks: val.positive_marks,
          negative_marks: val.negative_marks
        }));

        return [...acc, ...objs];
      }, []);

      
      const result = calculateResult(answers);

      const payload = {
        studentId: user._id,
        examId: examId,
        status: "attempted",
        wrongAnswers: result.wrongAnswers,
        unattempted: result.unattempted,
        marks: result.totalMarks,

      }


      const response = await submitResult(payload);
      if (response.status == 200) {

        navigate('/student/completed-exams');
      }

    } catch (err) {
      
    }

    if (window?.electronAPI?.stopProctorEngine) window.electronAPI.stopProctorEngine();
    if (window?.electronAPI?.closeWindow) window.electronAPI.closeWindow();
  };



  if (!eventDetails) return <div>Loading test...</div>;

  if (isExamError) {
    return <div className='font-bold flex flex-col gap-8 mt-20 text-center'>
      <span className='text-indigo-900 text-4xl'>
        Questions not available for this exam!
      </span>
      <span className='text-indigo-900 text-xl'>Try contacting your institute for more info</span>
    </div>
  }

  if (isExamLoading || isQuestionLoading) {
    return <div>Loading...🥲
      
    </div>
  }

  return (

    <div className="flex flex-col ">
      {!eventDetails ? (
        <div className="flex justify-center items-center h-full text-lg font-medium text-gray-700">
          Loading test...
        </div>
      ) : (
        <>
          <div className="relative flex flex-col w-full px-4 py-4 sm:px-6">

            {/* Warning Banner */}
            {warning && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-100 border-l-4 border-yellow-600 text-yellow-900 px-6 py-3 rounded-xl shadow-lg text-center w-[90%] sm:w-[500px] font-medium">
                <span className="text-xl mr-2">⚠️</span>
                {warning === "No face detected" && countdown !== null
                  ? `You have ${countdown} sec to come back to the screen`
                  : warning}
              </div>
            )}

            {/* Final Popup */}
            {showFinalPopup && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
                <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-red-600 flex items-center justify-center gap-2">
                      <span>🚨</span> Multiple Anomalies Detected
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      Your test is being auto-submitted due to repeated violations. Please review the detected incidents below:
                    </p>
                  </div>
                  <ul className="mt-4 max-h-48 overflow-y-auto text-sm sm:text-base bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 rounded-md px-4 py-3 space-y-1 list-disc list-inside shadow-inner">
                    {allWarnings.map((item, idx) => (
                      <li key={idx} className="text-red-700 dark:text-red-300">{item}</li>
                    ))}
                  </ul>
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleSubmitTest}
                      className="inline-flex items-center justify-center px-6 py-2.5 text-white bg-purple-600 hover:bg-purple-700 rounded-lg text-base font-semibold transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      Okay, Close Test
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col border-3  mb-12 py-3 px-2 sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 ">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold">{eventDetails.batch?.name}</h1>
                <h2 className="text-md sm:text-lg font-semibold text-gray-600">{eventDetails.batch.year}</h2>
              </div>

              <div className="flex items-center gap-2 text-red-700 font-semibold px-4 py-1.5 bg-red-100 border border-red-300 rounded-xl shadow-sm w-fit">
                <span className="text-lg">🚨</span>
                Warnings: <span className="text-red-800 font-bold">{warningCount}</span>/5
              </div>

              <div className="flex justify-end bg-gray-100 border-purple-600 border-2 rounded-lg p-3 space-x-3 w-fit">
                <div className="px-4 py-2 bg-purple-200 rounded-lg font-semibold text-center">
                  <div>Time Left</div>
                  <div className="text-xl font-bold">
                    <CountdownTimer initialTime={eventDetails.duration} handleSubmitTest={handleSubmitTest} submitted={submitted} />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col  lg:flex-row gap-4 w-full">
              {/* Left: QuestionSection */}
              <div className="w-full lg:w-3/5 border-3 py-3 px-2 ">
                <QuestionSection
                  setSubjectSpecificQuestions={setSubjectSpecificQuestions}
                  setSelectedQuestion={setSelectedQuestion}
                  selectedQuestion={selectedQuestion}
                  selectedSubject={selectedSubject}
                  subjectSpecificQuestions={subjectSpecificQuestions}
                />
              </div>

              {/* Right: QuestionListSection */}
              <div className="w-full border-3 py-3 px-2 lg:w-2/5">
                <QuestionListSection
                  subjectSpecificQuestions={subjectSpecificQuestions}
                  setSubjectSpecificQuestions={setSubjectSpecificQuestions}
                  selectedSubject={selectedSubject}
                  setSelectedSubject={setSelectedSubject}
                  selectedQuestion={selectedQuestion}
                  setSelectedQuestion={setSelectedQuestion}
                  eventDetails={eventDetails}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center mt-8">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="rounded-md text-lg font-semibold bg-blue-900 px-6 py-2 text-white shadow hover:bg-blue-800 transition duration-200"
              >
                Submit Test
              </button>
            </div>

            {/* Submit Modal */}
            {showSubmitModal && (
              <SubmitModal
                setShowSubmitModal={setShowSubmitModal}
                setSubmitted={setSubmitted}
              />
            )}

            {/* Submission Confirmation */}
            {submitted && (
              <p className="mt-4 text-center text-green-700 font-semibold">
                ✅ Your form has been submitted successfully!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );

};

export default TestWindow;
