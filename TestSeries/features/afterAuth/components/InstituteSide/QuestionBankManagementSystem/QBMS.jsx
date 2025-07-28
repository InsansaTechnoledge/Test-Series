import React, { useEffect, useState } from "react";
import { fetchQuestionBankForOrganization } from "../../../../../utils/services/questionUploadService";
import { useParams } from "react-router-dom";
import IntroductoryPage from "./components/IntroductoryPage";
import { useTheme } from "../../../../../hooks/useTheme";
import BodySkeleton from "./components/BodySkeleton";
import DetailedQuestionPage from "./components/DetailedPageRender/DetailedQuestionPage.jsx";
import Navbar from "./components/Navbar.jsx";
import ExamDataDashboard from "./components/Analytics/QuestionsAnalysis.jsx";
import AutoGeneratePaper from "./components/AutoPaperGenerator/AutoGeneratePaper.jsx";

const QBMS = () => {
  const [questions, setQuestions] = useState({ data: [] });
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState("none");
  const [showIntroPage, setShowIntroPage] = useState(true);
  const { id } = useParams();
  const { theme } = useTheme();
  const [showAlanysis, setShowAnalysis] = useState(false);

  console.log("question" , questions?.data);

  useEffect(() => {
    const fetchQuestions = async () => {
      // const res = await fetchQuestionBankForOrganization(id);
      const res = await fetchQuestionBankForOrganization({
        organization_id: id,
      });

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
    const handleBeforeUnload = (event) => {
      const message = 'reloading on this section would redirect you to start page '
      event.returnValue = message
      return message
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  },[])


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

  const filteredQuestionsByType =
    selectedQuestionType === ""
      ? questions?.data
      : questions?.data?.filter(
          (q) => q.question_type === selectedQuestionType
        ) || [];

  return (
    <div
      className={`${
        theme === "light" ? "bg-white" : "bg-gray-950"
      } min-h-screen`}
    >
      {!showIntroPage && !showAlanysis && <Navbar />}
      {/* Overlay Introductory Page */}
      <IntroductoryPage show={showIntroPage} theme={theme} />
      {showAlanysis === true ? (
        <ExamDataDashboard
          questions={questions?.data}
          setShowAnalysis={setShowAnalysis}
          theme={theme}
        />
      ) : selectedQuestionType === "none" ? (
        <BodySkeleton
          categories={questionTypes}
          QuestionLength={questions?.data.length}
          organizationId={id}
          setSelectedQuestionType={setSelectedQuestionType}
          setShowAnalysis={setShowAnalysis}
          theme={theme}
        />
      ) : (
        <DetailedQuestionPage
          setSelectedQuestionType={setSelectedQuestionType}
          selectedQuestionType={selectedQuestionType}
          filteredQuestionsByType={filteredQuestionsByType}
          categories={questionTypes}
        />
      )}
      <AutoGeneratePaper questions={questions}/>
      
    </div>
  );
};

export default QBMS;
