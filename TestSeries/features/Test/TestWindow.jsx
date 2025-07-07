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
import { VITE_SECRET_KEY_FOR_TESTWINDOW } from '../constants/env';
import { useTheme } from '../../hooks/useTheme';
import TestHeader from './TestWarning';
import LoadingTest from './LoadingTest';

const TestWindow = () => {
  const [eventDetails, setEventDetails] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [subjectSpecificQuestions, setSubjectSpecificQuestions] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [isElectronEnv, setIsElectronEnv] = useState(false);
  const { user } = useUser();
  const secretKey = import.meta.env.VITE_SECRET_KEY_FOR_TESTWINDOW || VITE_SECRET_KEY_FOR_TESTWINDOW;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const examId = searchParams.get('examId');
  const { questions, isError: isExamError, isLoading: isQuestionLoading } = useCachedQuestions(examId);
  const { exam, isLoading: isExamLoading } = useCachedExam(examId);
  const { theme } = useTheme();
 
  useEffect(() => {
    const checkElectronEnv = () => {
      const isElectron = window?.electronAPI?.isElectron || false;
      setIsElectronEnv(isElectron);
      console.log('🔍 Electron environment detected:', isElectron);
    };
    
    checkElectronEnv();
  }, []);
  useEffect(() => {
    if (eventDetails) console.log("📦 Loaded Event:", eventDetails);
  }, [eventDetails]);

  useEffect(() => {
    if (eventDetails) {
      const cached = localStorage.getItem('testQuestions');
      if (!cached) {
        const reduced = eventDetails.questions.reduce((acc, quest) => {
          if (quest.subject.trim() === "") {
            quest.subject = "Unspecified";
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
      const timeout = setTimeout(() => {
        navigate("/student/completed-exams");
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [submitted, navigate]);

  const getCorrectResponse = (question) => {
    switch (question.question_type) {
      case "mcq": return question.correct_option;
      case "msq": return question.correct_options;
      case "fill":
      case "numerical": return question.correct_answer;
      case "tf": return question.is_true;
      case "match": return question.correct_pairs;
      case "comprehension":
        return question.sub_questions.reduce((acc, sub_q) => {
          const response = getCorrectResponse(sub_q);
          return {
            ...acc,
            [sub_q.id]: [response, sub_q.positive_marks, sub_q.negative_marks, sub_q.question_type]
          };
        }, {});
      default: return question.correct_response;
    }
  };


  const handleSubmitTest = async () => {
    try {
      localStorage.removeItem('testQuestions');
      localStorage.removeItem('encryptedTimeLeft');
      // localStorage.removeItem('selectedQuestionId');
      // sessionStorage.removeItem('subjectSpecificQuestions');
  

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
      };

      const response = await submitResult(payload);
      if (response.status === 200) {
        setSubmitted(true);
        navigate('/student/completed-exams');
      }

    } catch (err) {
      console.error('Error submitting test:', err);
    }
    if (window?.electronAPI?.stopProctorEngine) window.electronAPI.stopProctorEngine();
    if (window?.electronAPI?.closeWindow) window.electronAPI.closeWindow();
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

  if (isExamLoading || isQuestionLoading) {
    return <div>Loading</div>;
  }
 

  return (
    <>
      <div className='flex flex-col lg:flex-row gap-2'>
        <div className='w-full lg:w-[80%] p-2 lg:p-4 gap-2 flex flex-col'>
        <div className={`p-4 rounded-md shadow-sm w-full border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
  <div className="flex justify-between items-center">
    <h3 className={`text-l xl:text-2xl font-bold leading-snug ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
      {eventDetails?.batch?.name || 'Test Batch Name'}
    
      <div className='text-xl'>

      {eventDetails?.name || 'Test Batch Name'}
      </div>
      
    </h3>
    <h2 className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'}`}>
      {eventDetails?.batch?.year || ''}
    </h2>
  </div>
</div>


          <div className="lg:hidden">
            <TestHeader />
            <CountdownTimer initialTime={eventDetails.duration} handleSubmitTest={handleSubmitTest} submitted={submitted}  examId={examId}/>
          </div>

          <QuestionSection 
            setSubjectSpecificQuestions={setSubjectSpecificQuestions} 
            setSelectedQuestion={setSelectedQuestion} 
            selectedQuestion={selectedQuestion} 
            selectedSubject={selectedSubject} 
            subjectSpecificQuestions={subjectSpecificQuestions} 
          />
        </div>

        <div className='w-full lg:w-[25%] lg:block'>
          <div className="hidden lg:block">


            
            <TestHeader />
            <CountdownTimer initialTime={eventDetails.duration} handleSubmitTest={handleSubmitTest} submitted={submitted} examId={examId} />
          </div>
          <div className="w-full py-3 px-2">
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
      </div>
    </>
  );
};

export default TestWindow;
