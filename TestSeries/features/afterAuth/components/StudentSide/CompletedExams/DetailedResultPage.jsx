
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTheme } from "../../../../../hooks/useTheme";

// Custom hooks
import { useResultData } from "./DetailedResultComponents/useResultDataHook";
import { useQuestionFilters } from "./DetailedResultComponents/useQuestionsFilterHook";

// Utils
import { transformQuestions, transformUserAnswers } from "./DetailedResultComponents/transformers";
import { getFilteredQuestions, calculateTotalMarks, getQuestionResult } from "./DetailedResultComponents/resultCalculator";

// Components
import { LoadingState } from "./DetailedResultComponents/LoadingState";
import { ErrorState } from "./DetailedResultComponents/ErrorState";
import { ResultHeader } from "./DetailedResultComponents/ResultHeader";
import { StatsCards } from "./DetailedResultComponents/StatsCard";
import { QuestionStatusOverview } from "./DetailedResultComponents/QuestionStatusOverview";
import { SearchAndFilters } from "./DetailedResultComponents/SearchAndFilter";
import { QuestionsList } from "./DetailedResultComponents/QuestionList";

const DetailedResultPage = () => {
  const { theme } = useTheme();
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  
  const examName = searchParams.get("name");
  const resultId = searchParams.get("resultId");

  // Custom hooks
  const { resultData, loading, error } = useResultData(examId, resultId);
  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterResult,
    setFilterResult,
  } = useQuestionFilters();

  // Loading state
  if (loading) {
    return <LoadingState theme={theme} />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} theme={theme} />;
  }

  // No data state
  if (!resultData || !resultData.questions) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          <svg className="mx-auto h-24 w-24 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl font-medium">No result data found</p>
        </div>
      </div>
    );
  }

  // Transform data
  const questions = transformQuestions(resultData.questions);
  const userAnswers = transformUserAnswers(
    resultData.wrongAnswers || [],
    resultData.questions,
    resultData,
    resultData.descriptiveResponses || []
  );
  const filteredQuestions = getFilteredQuestions(
    questions,
    userAnswers,
    searchTerm,
    filterType,
    filterResult,
    theme
  );

  // Calculate statistics
  const totalQuestions = questions.length;
  const totalMarks = calculateTotalMarks(questions);
  const scoredMarks = resultData.marks || 0;
  const percentage = totalMarks > 0 ? ((scoredMarks / totalMarks) * 100).toFixed(2) : "N/A";
  const filteredDescriptiveResponses = Object.fromEntries(resultData.descriptiveResponses.map((r)=>[r.questionId,r]) || {});

  // Calculate question status counts
  const correctCount = questions.filter(
    (q) => getQuestionResult(q, userAnswers, theme ,filteredDescriptiveResponses).status === "correct"
  ).length;
  
  const incorrectCount = questions.filter((q) => {
    const status = getQuestionResult(q, userAnswers, theme ,filteredDescriptiveResponses).status;
    return status === "incorrect" || status === "partial";
  }).length;
  
  const unansweredCount = questions.filter(
    (q) => getQuestionResult(q, userAnswers, theme ,filteredDescriptiveResponses).status === "unanswered"
  ).length;
  
  const descriptiveCount = questions.filter(
    (q) => getQuestionResult(q, userAnswers, theme ,filteredDescriptiveResponses).status === "descriptive"
  ).length;

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"} transition-colors duration-200`}>
      {/* Header */}
      <ResultHeader
        examName={examName}
        examId={examId}
        resultData={resultData}
        theme={theme}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards
          scoredMarks={scoredMarks}
          totalMarks={totalMarks}
          percentage={percentage}
          rank={resultData.rank}
          totalQuestions={totalQuestions}
          theme={theme}
        />

        {/* Question Status Overview */}
        <QuestionStatusOverview
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          unansweredCount={unansweredCount}
          descriptiveCount={descriptiveCount}
          theme={theme}
        />

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          filterResult={filterResult}
          setFilterResult={setFilterResult}
          theme={theme}
        />

        {/* Questions List */}
        <QuestionsList
          questions={filteredQuestions}
          userAnswers={userAnswers}
          theme={theme}
          descriptiveResponses={filteredDescriptiveResponses}
        />
      </div>
    </div>
  );
};

export default DetailedResultPage;