import React, { useEffect, useState } from 'react';
import { fetchQuestionBankForOrganization } from '../../../../../utils/services/questionUploadService';
import { useParams } from 'react-router-dom';
import IntroductoryPage from './components/IntroductoryPage';
import { useTheme } from '../../../../../hooks/useTheme';
import BodySkeleton from './components/BodySkeleton';
import DetailedQuestionPage from './components/DetailedPageRender/DetailedQuestionPage.jsx';
import Navbar from './components/Navbar.jsx';

const QBMS = () => {
  const [questions, setQuestions] = useState({ data: [] });
  const [questionTypes, setQuestionTypes] = useState([]); 
  const [selectedQuestionType, setSelectedQuestionType] = useState('none'); 
  const [showIntroPage, setShowIntroPage] = useState(true);
  const { id } = useParams();
  const {theme} = useTheme();


  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetchQuestionBankForOrganization(id);
      setQuestions(res);
    };

    fetchQuestions();
  }, [id]);

  useEffect(() => {
    if (questions?.data?.length > 0) {
      // Count the number of questions of each type
      const typesWithCounts = questions.data.reduce((acc, question) => {
        const { question_type } = question;
        if (acc[question_type]) {
          acc[question_type]++;
        } else {
          acc[question_type] = 1;
        }
        return acc;
      }, {});

      const types = Object.keys(typesWithCounts).map((type) => ({
        type,
        count: typesWithCounts[type],
      }));

      setQuestionTypes(types);
    }
  }, [questions]);


  useEffect(() => {
    // Check if user has visited today
    // const lastVisitDate = localStorage.getItem('lastVisitDate');
    // const today = new Date().toISOString().split('T')[0];

    // if (lastVisitDate === today) {
    //   setShowIntroPage(false);
    // } else {
    //   localStorage.setItem('lastVisitDate', today);
      // Auto-close after 5 seconds if user doesn't interact
      const timer = setTimeout(() => setShowIntroPage(false), 2700);
      
      // Cleanup timer on component unmount
      return () => clearTimeout(timer);
    // }
  }, []);

  const filteredQuestionsByType = selectedQuestionType === '' 
    ? questions?.data
    : questions?.data?.filter((q) => q.question_type === selectedQuestionType) || [];

  return (
    <div className='max-h-screen'>
      {
        !showIntroPage && 
          <Navbar/>
      }
      {/* Overlay Introductory Page */}
      <IntroductoryPage 
        show={showIntroPage} 
        theme={theme}
      />
      {
        selectedQuestionType === 'none' ? 
          <BodySkeleton 
          categories={questionTypes} 
          QuestionLength={questions?.data.length} 
          organizationId={id}
          setSelectedQuestionType={setSelectedQuestionType}
        />
        :
        <DetailedQuestionPage 
          setSelectedQuestionType={setSelectedQuestionType} 
          selectedQuestionType={selectedQuestionType} 
          filteredQuestionsByType={filteredQuestionsByType}
          categories={questionTypes}
        />
      } 
    </div> 
  );
};

export default QBMS;