import React, { useEffect, useState } from 'react';
import QuestionListSection from './QuestionListSection';
import QuestionSection from './QuestionSection';
import CountdownTimer from './TestTimer/CountdownTimer';
import CryptoJS from 'crypto-js';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/currentUserContext';
import { useCachedQuestions } from '../../hooks/useCachedQuestions';
import { useCachedExam } from '../../hooks/useCachedExam';

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

  const secretKey = 'secret-key-for-encryption';
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('userId');
  const examId = searchParams.get('examId');
  // const [proctorStatus, setProctorStatus] = useState('Initializing...');

  // const { questions, isLoading: isQuestionLoading } = useCachedQuestions("aa632eab-74ad-4a6b-a675-60c571257c00");
  // const { exam, isLoading: isExamLoading } = useCachedExam("aa632eab-74ad-4a6b-a675-60c571257c00");

  console.log(examId);

  
  
  const { questions, isLoading: isQuestionLoading } = useCachedQuestions(examId);
  const { exam, isLoading: isExamLoading } = useCachedExam(examId);


  // const dummyExam = {
  //   id: "bd0c2f10-8d62-4c4b-97fc-fb289e28e72c",
  //   name: "Midterm Mathematics Exam",
  //   date: "2025-06-15",
  //   batch: {
  //     id: "a1b2c3d4-e5f6-7g8h-9i10-jk11lm12no13",
  //     name: "Batch A - Second Semester"
  //   },
  //   organization: {
  //     id: "org123",
  //     name: "Excel Coaching Institute"
  //   },
  //   total_marks: 100,
  //   duration: 90,
  //   live_until: "2025-06-15T13:00:00+05:30",
  //   description: "This is the midterm exam for 2nd semester.",
  //   guidelines: "1. Do not switch tabs.\n2. Submit before time.",
  //   status: "scheduled",
  //   syllabus: {
  //     Algebra: ["Linear Equations", "Quadratics"],
  //     Geometry: ["Triangles", "Circles"]
  //   },
  //   created_at: "2025-05-22T10:00:00+05:30",
  //   planner_type: "exam",
  //   updated_at: "2025-05-22T10:00:00+05:30",
  //   updated_by: "admin@excelinstitute.com",
  // };

  // useEffect(()=>{
  //   if(!isExamLoading){
  //     console.log("EXXXX", exam);
  //   }
  // },[isExamLoading]);


  useEffect(() => {
    if (!isExamLoading && !isQuestionLoading && questions && questions.length > 0) {


      const subjectSet = new Set(questions.map(q => q.subject));


      setEventDetails(prev => ({
        ...prev,
        ...exam,
        questions,
        subjects: Array.from(subjectSet),
      }));
    }
  }, [questions, isQuestionLoading, isExamLoading]);


  console.log(exam);

  // const dummyQuestions = [
  //   {
  //     id: 'q1',
  //     exam_id: 'exam1',
  //     organization_id: 'org1',
  //     subject: 'Math',
  //     chapter: 'Algebra',
  //     question_type: 'mcq',
  //     difficulty: 'medium',
  //     positive_marks: 1,
  //     negative_marks: 0.25,
  //     question_text: 'What is the value of x in the equation 2x + 3 = 7?',
  //     options: ['1', '2', '3', '4'],
  //     correct_option: 'B',
  //     explanation: '2x + 3 = 7 => 2x = 4 => x = 2'
  //   },
  //   {
  //     id: 'q2',
  //     organization_id: 'org1',
  //     subject: 'Science',
  //     chapter: 'Physics',
  //     question_type: 'msq',
  //     difficulty: 'easy',
  //     positive_marks: 2,
  //     negative_marks: 0.5,
  //     question_text: 'Which of the following are SI units?',
  //     options: ['Meter', 'Second', 'Inch', 'Foot'],
  //     correct_options: [0, 1]
  //   },
  //   {
  //     id: 'q3',
  //     organization_id: 'org1',
  //     subject: 'English',
  //     chapter: 'Grammar',
  //     question_type: 'fill',
  //     difficulty: 'easy',
  //     positive_marks: 1,
  //     negative_marks: 0,
  //     question_text: 'The sun ___ in the east.',
  //     correct_answer: 'rises'
  //   },
  //   {
  //     id: 'q4',
  //     organization_id: 'org1',
  //     subject: 'GK',
  //     chapter: 'History',
  //     question_type: 'tf',
  //     difficulty: 'easy',
  //     positive_marks: 1,
  //     negative_marks: 0.25,
  //     statement: 'The Taj Mahal is located in Delhi.',
  //     is_true: false
  //   },
  //   {
  //     id: 'q5',
  //     organization_id: 'org1',
  //     subject: 'Geography',
  //     chapter: 'Maps',
  //     question_type: 'match',
  //     difficulty: 'medium',
  //     positive_marks: 2,
  //     negative_marks: 0.5,
  //     left_items: ['India', 'USA', 'UK'],
  //     right_items: ['Washington D.C.', 'London', 'New Delhi'],
  //     correct_pairs: {
  //       India: 'New Delhi',
  //       USA: 'Washington D.C.',
  //       UK: 'London'
  //     }
  //   },
  //   {
  //     id: 'q6',
  //     organization_id: 'org1',
  //     subject: 'Reading',
  //     chapter: 'Comprehension',
  //     question_type: 'comprehension',
  //     difficulty: 'medium',
  //     positive_marks: 4,
  //     negative_marks: 0,
  //     passage: 'Climate change refers to long-term shifts in temperatures and weather patterns...',
  //     sub_questions: [
  //       {
  //         id: 'q6_1',
  //         index: 1,
  //         question_type: 'mcq',
  //         positive_marks: 1,
  //         negative_marks: 0.25,
  //         question_text: 'What is climate change?',
  //         options: ['Short-term weather shifts', 'Seasonal changes', 'Long-term shifts', 'Daily temperature changes'],
  //         correct_option: 'C'
  //       },
  //       {
  //         id: 'q6_2',
  //         index: 2,
  //         question_type: 'tf',
  //         positive_marks: 1,
  //         negative_marks: 0.25,
  //         statement: 'Climate change occurs over decades.',
  //         is_true: true
  //       }
  //     ]
  //   },
  //   {
  //     id: 'q7',
  //     organization_id: 'org1',
  //     subject: 'Math',
  //     chapter: 'Numbers',
  //     question_type: 'numerical',
  //     difficulty: 'medium',
  //     positive_marks: 2,
  //     negative_marks: 0.5,
  //     question_text: 'Calculate the square root of 49.',
  //     correct_answer: 7
  //   }
  // ];


  // useEffect(() => {
  //   setEventDetails(dummyExam);
  // }, [])


  // useEffect(() => {
  //   const handleProctorWarning = (data) => {
  //     if (!proctorRunning) {
  //       setProctorRunning(true);
  //       setWarning(data.details);
  //       setAllWarnings((prev) => [...prev, data.details]);

  //       if (data.details === 'No face detected') {
  //         let remaining = 5;
  //         setCountdown(remaining);
  //         const interval = setInterval(() => {
  //           remaining--;
  //           setCountdown(remaining);
  //           if (remaining <= 0) {
  //             clearInterval(interval);
  //             setCountdown(null);
  //           }
  //         }, 1000);
  //       }

  //       setWarningCount((prev) => {
  //         const newCount = prev + 1;
  //         if (newCount >= 5 && !submitted) {
  //           setShowFinalPopup(true); // Wait for user to confirm
  //         }
  //         return newCount;
  //       });

  //       setTimeout(() => {
  //         setWarning(null);
  //         setProctorRunning(false);
  //       }, 5000);
  //     }
  //   };

  //   if (window?.electronAPI?.onProctorWarning) {
  //     window.electronAPI.onProctorWarning(handleProctorWarning);
  //   }

  //   return () => {
  //     window?.electronAPI?.removeProctorWarningListener?.();
  //   };
  // }, [submitted, proctorRunning]);

  // useEffect(() => {
  //   const handleProctorEvent = (data) => {
  //     console.log("📦 Proctor Event received:", data);  // Already there ✅

  //     if (data?.eventType === 'session_start') {
  //       console.log("🚀 Received SESSION START in TestWindow!");
  //       setProctorStatus('Proctoring Started ✅');
  //     }
  //     else if (data?.eventType === 'session_end') {
  //       console.log("🛑 Received SESSION END in TestWindow!");
  //       handleSubmitTest();
  //     }
  //     else if (data?.eventType === 'info') {
  //       console.log("ℹ️ Info Event:", data.details);
  //     }
  //   };

  //   if (window?.electronAPI?.onProctorEvent) {
  //     window.electronAPI.onProctorEvent(handleProctorEvent);
  //   }

  //   return () => {
  //     window?.electronAPI?.removeProctorEventListener?.();
  //   };
  // }, []);


  // FETCHING THE EVENT DETAILS ----->

  // useEffect(() => {
  //   const fetchEventDetails = async () => {
  //     try {
  //       const response = await getFullEventDetails(eventId);
  //       if (response.status === 200) {
  //         setEventDetails(response.data);
  //         console.log("eve", response.data);
  //       }
  //     } catch (err) {
  //       console.log(err.response?.data?.errors?.[0] || err.message);
  //     }
  //   };

  //   fetchEventDetails();
  // }, []);

  useEffect(() => {
    if (subjectSpecificQuestions) {
      console.log("subjectspecific", subjectSpecificQuestions);
    }
  }, [subjectSpecificQuestions]);
  
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
      setSelectedSubject(eventDetails.subjects[0]);
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
            [sub_q.id]: response
          };
        },{})
      default:
        return question.correct_response;
    }
  }

  const handleSubmitTest = async () => {
    try {
      localStorage.removeItem('testQuestions');
      localStorage.removeItem('encryptedTimeLeft');
      setSubmitted(true);

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

      // await deleteEventAttemptsByUser(eventId, userId);
      // const response = await checkUsersAnswers(answers, userId, eventDetails.exam_id, eventDetails.id);
      // if (response.status === 200) {
      //   console.log('✅ Test submitted successfully.');
      // }

      

      console.log(answers);
    } catch (err) {
      console.log(err);
    }

    if (window?.electronAPI?.stopProctorEngine) window.electronAPI.stopProctorEngine();
    if (window?.electronAPI?.closeWindow) window.electronAPI.closeWindow();
  };

  if (!eventDetails) return <div>Loading test...</div>;

  if (isExamLoading || isQuestionLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex'>
      {
        !eventDetails ? (
          <div>Loading test</div>
        ) : (
          <>
             <div className='p-3 flex flex-col'>

{/* <div className="text-center text-lg font-bold py-2 text-purple-600">
{proctorStatus}
</div> */}

{warning && (
  <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-100 border-l-4 border-yellow-600 text-yellow-900 px-6 py-3 rounded-xl shadow-lg text-center w-[90%] sm:w-[500px] font-medium">
    <span className="text-xl mr-2">⚠️</span>
    {warning === "No face detected" && countdown !== null
      ? `You have ${countdown} sec to come back to the screen`
      : warning}
  </div>
)}

{showFinalPopup && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 sm:px-0">
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow-2xl max-w-2xl w-full animate-fade-in">
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
          <li key={idx} className="text-red-700 dark:text-red-300">
            {item}
          </li>
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

{/* Header + Timer + Scoring Info */}
<div className='flex w-full justify-between space-x-5'>
  <div className='font-bold p-5'>
    <h1 className='text-3xl font-bold'>{eventDetails.batch_id.name}</h1>
    <h2 className='text-lg font-bold'>{eventDetails.batch_id.name}</h2>
  </div>
  <div className="flex items-center gap-2 text-red-700 font-semibold px-4 py-1.5 bg-red-100 border border-red-300 rounded-xl shadow-sm">
    <span className="text-lg">🚨</span>
    Warnings: <span className="text-red-800 font-bold">{warningCount}</span>/5
  </div>

  <div className='flex justify-end space-x-3 bg-gray-100 border-purple-600 border-2 rounded-lg p-3'>
    {/* <div className='text-green-700 font-bold border rounded-lg px-4 py-2'>Correct: +{eventDetails.exam.positive_marks}</div> */}
    {/* <div className='text-red-700 font-bold border rounded-lg px-4 py-2'>Wrong: -{eventDetails.exam.negative_marks}</div> */}
    {/* <div className='text-gray-700 font-bold border rounded-lg px-4 py-2'>Unattempted: 0</div> */}
    <div className='px-4 py-2 bg-purple-200 rounded-lg font-semibold'>
      <div>Time Left</div>
      <div className='text-xl font-bold'>
        {/* <CountdownTimer initialTime={eventDetails.duration} handleSubmitTest={handleSubmitTest} submitted={submitted} /> */}
      </div>
    </div>
  </div>
</div>

<div className='grid grid-cols-5 mt-5 space-x-5 p-3'>
  <div className='col-span-3 flex flex-col space-y-5 p-3'>
    <QuestionSection
      setSubjectSpecificQuestions={setSubjectSpecificQuestions}
      setSelectedQuestion={setSelectedQuestion}
      selectedQuestion={selectedQuestion}
      selectedSubject={selectedSubject}
      subjectSpecificQuestions={subjectSpecificQuestions}
    />
  </div>
  <div className='col-span-2'>
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

<button
  onClick={handleSubmitTest}
  className='mx-auto mt-10 rounded-md text-lg font-semibold bg-blue-900 px-4 py-2 w-fit text-white'
>
  Submit Test
</button>
</div>
          </>
        )
      }
     
    </div>
  );
};

export default TestWindow;
