import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getResultDetail } from "../../../../../utils/services/resultPage";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "../../../../../hooks/useTheme";
const ResultPage = () => {
  const { theme } = useTheme();
  const { examId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterResult, setFilterResult] = useState("all");
  const [viewMode, setViewMode] = useState("detailed"); // 'detailed' or 'compact'

  const [searchParams] = useSearchParams();
  const examName = searchParams.get("name");
  const resultId = searchParams.get("resultId");
  console.log("Result ID:", resultId);

  console.log("Exam ID:", examId);

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        setLoading(true);
        const data = await getResultDetail(examId, false, resultId);
        console.log("Fetched Result Data:", data);
        setResultData(data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch result data");
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchResultData();
    }
  }, [examId]);

  // Transform API data to component format
  const transformQuestions = (questions) => {
    return questions.map((q) => {
      let transformed = {
        id: q.id,
        question_text:
          q.question_text || (q.question_type === "tf" ? q.statement : ""),
        type: q.question_type,
        difficulty: q.difficulty,
        positive_marks: q.positive_marks,
        negative_marks: q.negative_marks,
        subject: q.subject,
        chapter: q.chapter,
        options: q.options,
        correct_option: q.correct_option,
        correct_options: q.correct_options,
        correct_answer: q.correct_answer,
        is_true: q.is_true,
        explanation: q.explanation,
        left_items: q.left_items,
        right_items: q.right_items,
        correct_pairs: q.correct_pairs,
        passage: q.passage,
        sub_question_ids: q.sub_question_ids,
      };
      console.log("questoons" + questions);

      if (
        q.question_type === "comprehension" &&
        Array.isArray(q.sub_questions)
      ) {
        transformed.sub_questions = q.sub_questions.map((sub) => ({
          id: sub.id,
          question_text:
            sub.question_text ||
            (sub.question_type === "tf" ? sub.statement : ""),
          type: sub.question_type,
          difficulty: sub.difficulty,
          positive_marks: sub.positive_marks,
          negative_marks: sub.negative_marks,
          subject: sub.subject,
          chapter: sub.chapter,
          options: sub.options,
          correct_option: sub.correct_option,
          correct_options: sub.correct_options,
          correct_answer: sub.correct_answer,
          is_true: sub.is_true,
          explanation: sub.explanation,
        }));
      }

      return transformed;
    });
  };

  const transformUserAnswers = (wrongAnswers, questions) => {
    const userAnswers = {};

    // Initialize all questions (including sub-questions) as null
    questions.forEach((q) => {
      userAnswers[q.id] = null;
      if (
        q.question_type === "comprehension" &&
        Array.isArray(q.sub_questions)
      ) {
        q.sub_questions.forEach((sub) => {
          userAnswers[sub.id] = null;
        });
      }
    });

    // Set wrong answers
    wrongAnswers.forEach((wrong) => {
      userAnswers[wrong.questionId] = wrong.response;
    });

    // Set correct answers for questions that were answered correctly
    questions.forEach((q) => {
      if (
        q.question_type === "comprehension" &&
        Array.isArray(q.sub_questions)
      ) {
        q.sub_questions.forEach((sub) => {
          if (
            !wrongAnswers.find((w) => w.questionId === sub.id) &&
            (!resultData.unattempted ||
              !resultData.unattempted.includes(sub.id))
          ) {
            if (sub.question_type === "mcq") {
              userAnswers[sub.id] = sub.correct_option;
            } else if (sub.question_type === "msq") {
              userAnswers[sub.id] = sub.correct_options;
            } else if (sub.question_type === "tf") {
              userAnswers[sub.id] = sub.is_true;
            } else if (
              sub.question_type === "fill" ||
              sub.question_type === "numerical"
            ) {
              userAnswers[sub.id] = sub.correct_answer;
            } else if (sub.question_type === "match") {
              userAnswers[sub.id] = sub.correct_pairs;
            }
          }
        });
      } else {
        if (
          !wrongAnswers.find((w) => w.questionId === q.id) &&
          (!resultData.unattempted || !resultData.unattempted.includes(q.id))
        ) {
          if (q.question_type === "mcq") {
            userAnswers[q.id] = q.correct_option;
          } else if (q.question_type === "msq") {
            userAnswers[q.id] = q.correct_options;
          } else if (q.question_type === "tf") {
            userAnswers[q.id] = q.is_true;
          } else if (
            q.question_type === "fill" ||
            q.question_type === "numerical"
          ) {
            userAnswers[q.id] = q.correct_answer;
          } else if (q.question_type === "match") {
            userAnswers[q.id] = q.correct_pairs;
          }
        }
      }
    });

    return userAnswers;
  };

  // Get result status for a question (including comprehension logic)
  const getQuestionResult = (question, userAnswers) => {
    if (
      question.type === "comprehension" &&
      Array.isArray(question.sub_questions)
    ) {
      let allAnswered = true;
      let allCorrect = true;
      let hasCorrect = false;

      question.sub_questions.forEach((subQ) => {
        const subResult = getQuestionResult(subQ, userAnswers);
        if (subResult.status === "unanswered") {
          allAnswered = false;
        } else if (subResult.status === "incorrect") {
          allCorrect = false;
        } else if (subResult.status === "correct") {
          hasCorrect = true;
        }
      });

      if (!allAnswered) {
        return {
          status: "unanswered",
          class:
            theme === "dark"
              ? "bg-gray-800 text-gray-300"
              : "bg-gray-100 text-gray-700",
          label: "Partially Answered",
          icon: "◐",
        };
      } else if (allCorrect) {
        return {
          status: "correct",
          class:
            theme === "dark"
              ? "bg-green-900 text-green-300"
              : "bg-green-100 text-green-800",
          label: "All Correct",
          icon: "✓",
        };
      } else if (hasCorrect) {
        return {
          status: "partial",
          class:
            theme === "dark"
              ? "bg-yellow-900 text-yellow-300"
              : "bg-yellow-100 text-yellow-800",
          label: "Partially Correct",
          icon: "◑",
        };
      } else {
        return {
          status: "incorrect",
          class:
            theme === "dark"
              ? "bg-red-900 text-red-300"
              : "bg-red-100 text-red-800",
          label: "All Incorrect",
          icon: "✗",
        };
      }
    }

    const userAnswer = userAnswers[question.id];

    if (userAnswer === undefined || userAnswer === null || userAnswer === "") {
      return {
        status: "unanswered",
        class:
          theme === "dark"
            ? "bg-gray-800 text-gray-300"
            : "bg-gray-100 text-gray-700",
        label: "Not Answered",
        icon: "○",
      };
    }

    let isCorrect = false;

    if (question.type === "mcq") {
      isCorrect = userAnswer === question.correct_option;
    } else if (question.type === "msq") {
      isCorrect =
        JSON.stringify(userAnswer?.sort()) ===
        JSON.stringify(question.correct_options?.sort());
    } else if (question.type === "tf") {
      isCorrect = userAnswer === question.is_true;
    } else if (question.type === "fill" || question.type === "numerical") {
      isCorrect =
        userAnswer?.toString().toLowerCase().trim() ===
        question.correct_answer?.toString().toLowerCase().trim();
    } else if (question.type === "match") {
      const sortObject = (obj) => {
        return Object.keys(obj || {})
          .sort()
          .reduce((res, key) => {
            res[key] = obj[key];
            return res;
          }, {});
      };

      const correct = JSON.stringify(sortObject(question.correct_pairs));
      const answer = JSON.stringify(sortObject(userAnswer));
      isCorrect = correct === answer;
    }

    if (isCorrect) {
      return {
        status: "correct",
        class:
          theme === "dark"
            ? "bg-green-900 text-green-300"
            : "bg-green-100 text-green-800",
        label: "Correct",
        icon: "✓",
      };
    } else {
      return {
        status: "incorrect",
        class:
          theme === "dark"
            ? "bg-red-900 text-red-300"
            : "bg-red-100 text-red-800",
        label: "Incorrect",
        icon: "✗",
      };
    }
  };

  // Filter questions based on search term, type, and result
  const getFilteredQuestions = (questions, userAnswers) => {
    return questions.filter((q) => {
      const text = q.question_text || q.passage || "";
      const subject = q.subject || "";
      const chapter = q.chapter || "";

      let matchesSearch =
        text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapter.toLowerCase().includes(searchTerm.toLowerCase());

      if (q.type === "comprehension" && Array.isArray(q.sub_questions)) {
        matchesSearch =
          matchesSearch ||
          q.sub_questions.some((sub) =>
            (sub.question_text || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
      }

      const matchesType = filterType === "all" || q.type === filterType;
      const result = getQuestionResult(q, userAnswers);
      const matchesResult =
        filterResult === "all" ||
        (filterResult === "correct" && result.status === "correct") ||
        (filterResult === "incorrect" &&
          (result.status === "incorrect" || result.status === "partial")) ||
        (filterResult === "unanswered" && result.status === "unanswered");

      return matchesSearch && matchesType && matchesResult;
    });
  };

  const getQuestionTypeLabel = (type) => {
    const types = {
      mcq: "Multiple Choice",
      msq: "Multiple Select",
      fill: "Fill in the Blank",
      tf: "True/False",
      numerical: "Numerical",
      code: "Coding",
      match: "Match the Following",
      comprehension: "Comprehension",
    };
    return types[type] || type.toUpperCase();
  };

  const getDifficultyBadgeClass = (difficulty) => {
    if (theme === "dark") {
      switch (difficulty) {
        case "easy":
          return "bg-green-900 text-green-300 border-green-700";
        case "medium":
          return "bg-yellow-900 text-yellow-300 border-yellow-700";
        case "hard":
          return "bg-red-900 text-red-300 border-red-700";
        default:
          return "bg-gray-800 text-gray-300 border-gray-600";
      }
    } else {
      switch (difficulty) {
        case "easy":
          return "bg-green-100 text-green-800 border-green-200";
        case "medium":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "hard":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div
            className={`animate-spin rounded-full h-16 w-16 border-4 ${
              theme === "dark"
                ? "border-indigo-400 border-t-transparent"
                : "border-indigo-600 border-t-transparent"
            } mx-auto mb-4`}
          ></div>
          <p
            className={`text-lg font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <div
          className={`max-w-md w-full mx-4 p-6 rounded-2xl shadow-xl ${
            theme === "dark"
              ? "bg-gray-900 border border-gray-800"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3
              className={`text-lg font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              } mb-2`}
            >
              Error Loading Results
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!resultData || !resultData.questions) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <div
          className={`text-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <svg
            className="mx-auto h-24 w-24 mb-4 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-xl font-medium">No result data found</p>
        </div>
      </div>
    );
  }

  const questions = transformQuestions(resultData.questions);
  const userAnswers = transformUserAnswers(
    resultData.wrongAnswers || [],
    resultData.questions
  );
  const filteredQuestions = getFilteredQuestions(questions, userAnswers);

  const calculateTotalMarks = (questions) => {
    return questions.reduce((sum, q) => {
      if (q.type === "comprehension" && Array.isArray(q.sub_questions)) {
        return (
          sum +
          q.sub_questions.reduce(
            (subSum, sub) => subSum + (Number(sub.positive_marks) || 0),
            0
          )
        );
      }
      return sum + (Number(q.positive_marks) || 0);
    }, 0);
  };

  const totalQuestions = questions.length;
  const totalMarks = calculateTotalMarks(questions);
  const scoredMarks = resultData.marks || 0;
  const percentage =
    totalMarks > 0 ? ((scoredMarks / totalMarks) * 100).toFixed(2) : "N/A";

  // Calculate statistics
  const correctCount = questions.filter(
    (q) => getQuestionResult(q, userAnswers).status === "correct"
  ).length;
  const incorrectCount = questions.filter(
    (q) => getQuestionResult(q, userAnswers).status === "incorrect"
  ).length;
  const unansweredCount = questions.filter(
    (q) => getQuestionResult(q, userAnswers).status === "unanswered"
  ).length;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-950" : "bg-gray-50"
      } transition-colors duration-200`}
    >
      {/* Header */}
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        } border-b sticky top-0 z-10 backdrop-blur-sm bg-opacity-95`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl ${
                    theme === "dark" ? "bg-indigo-900" : "bg-indigo-100"
                  } flex items-center justify-center mr-4`}
                >
                  <svg
                    className={`w-6 h-6 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h1
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {examName || "Exam Results"}
                  </h1>
                  <div
                    className={`flex items-center text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } mt-1`}
                  >
                    <span>ID: {examId}</span>
                    <span className="mx-2">•</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        theme === "dark"
                          ? "bg-gray-800 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {resultData.status}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {new Date(resultData.resultDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            } rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg ${
                  theme === "dark" ? "bg-indigo-900" : "bg-indigo-100"
                } flex items-center justify-center`}
              >
                <svg
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Score
                </p>
                <p
                  className={`text-2xl font-bold ${
                    scoredMarks >= 0
                      ? theme === "dark"
                        ? "text-green-400"
                        : "text-green-600"
                      : theme === "dark"
                      ? "text-red-400"
                      : "text-red-600"
                  }`}
                >
                  {scoredMarks}/{totalMarks}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            } rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg ${
                  theme === "dark" ? "bg-blue-900" : "bg-blue-100"
                } flex items-center justify-center`}
              >
                <svg
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Percentage
                </p>
                <p
                  className={`text-2xl font-bold ${
                    percentage >= 33
                      ? theme === "dark"
                        ? "text-green-400"
                        : "text-green-600"
                      : theme === "dark"
                      ? "text-red-400"
                      : "text-red-600"
                  }`}
                >
                  {percentage}%
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            } rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg ${
                  theme === "dark" ? "bg-purple-900" : "bg-purple-100"
                } flex items-center justify-center`}
              >
                <svg
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Rank
                </p>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  #{resultData.rank}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            } rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg ${
                  theme === "dark" ? "bg-orange-900" : "bg-orange-100"
                } flex items-center justify-center`}
              >
                <svg
                  className={`w-5 h-5 ${
                    theme === "dark" ? "text-orange-400" : "text-orange-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Questions
                </p>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {totalQuestions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Status Overview */}
        <div
          className={`${
            theme === "dark"
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-200"
          } rounded-2xl border p-6 mb-8 shadow-sm`}
        >
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            Question Status Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  theme === "dark" ? "bg-green-500" : "bg-green-500"
                } mr-3`}
              ></div>
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Incorrect: {incorrectCount}
              </span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  theme === "dark" ? "bg-gray-500" : "bg-gray-500"
                } mr-3`}
              ></div>
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Unanswered: {unansweredCount}
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          className={`${
            theme === "dark"
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-200"
          } rounded-2xl border p-6 mb-8 shadow-sm`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search questions, subjects, or chapters..."
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    theme === "dark"
                      ? "border-gray-700 bg-gray-800 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <label
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Type:
                </label>
                <select
                  className={`px-3 py-2 border ${
                    theme === "dark"
                      ? "border-gray-700 bg-gray-800 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="mcq">Multiple Choice</option>
                  <option value="msq">Multiple Select</option>
                  <option value="fill">Fill in the Blank</option>
                  <option value="tf">True/False</option>
                  <option value="numerical">Numerical</option>
                  <option value="code">Coding</option>
                  <option value="match">Match the Following</option>
                  <option value="comprehension">Comprehension</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Result:
                </label>
                <select
                  className={`px-3 py-2 border ${
                    theme === "dark"
                      ? "border-gray-700 bg-gray-800 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  value={filterResult}
                  onChange={(e) => setFilterResult(e.target.value)}
                >
                  <option value="all">All Results</option>
                  <option value="correct">Correct</option>
                  <option value="incorrect">Incorrect</option>
                  <option value="unanswered">Unanswered</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  View:
                </label>
                <select
                  className={`px-3 py-2 border ${
                    theme === "dark"
                      ? "border-gray-700 bg-gray-800 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                >
                  <option value="detailed">Detailed</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <div
              className={`${
                theme === "dark"
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-gray-200"
              } rounded-2xl border p-12 text-center shadow-sm`}
            >
              <svg
                className={`mx-auto h-16 w-16 ${
                  theme === "dark" ? "text-gray-600" : "text-gray-400"
                } mb-4`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3
                className={`text-lg font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-900"
                } mb-2`}
              >
                No questions found
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-500" : "text-gray-600"
                }`}
              >
                Try adjusting your search terms or filters to find more
                questions.
              </p>
            </div>
          ) : (
            filteredQuestions.map((question, index) => {
              const result = getQuestionResult(question, userAnswers);
              const isExpanded = expandedQuestion === question.id;

              return (
                <div
                  key={question.id}
                  className={`${
                    theme === "dark"
                      ? "bg-gray-900 border-gray-800"
                      : "bg-white border-gray-200"
                  } rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  {/* Question Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.class}`}
                          >
                            <span className="mr-1">{result.icon}</span>
                            {result.label}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyBadgeClass(
                              question.difficulty
                            )}`}
                          >
                            {question.difficulty?.charAt(0).toUpperCase() +
                              question.difficulty?.slice(1)}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              theme === "dark"
                                ? "bg-indigo-900 text-indigo-300 border-indigo-700"
                                : "bg-indigo-100 text-indigo-800 border-indigo-200"
                            } border`}
                          >
                            {getQuestionTypeLabel(question.type)}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              theme === "dark"
                                ? "bg-gray-800 text-gray-300 border-gray-600"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            } border`}
                          >
                            +{question.positive_marks} / -
                            {question.negative_marks}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <span className="font-medium">Q{index + 1}.</span>
                          {question.subject && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{question.subject}</span>
                            </>
                          )}
                          {question.chapter && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{question.chapter}</span>
                            </>
                          )}
                        </div>

                        {/* Question Content Preview */}
                        {viewMode === "detailed" && (
                          <div
                            className={`${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            } mb-4`}
                          >
                            {question.type === "comprehension" &&
                              question.passage && (
                                <div
                                  className={`p-4 rounded-lg ${
                                    theme === "dark"
                                      ? "bg-gray-800"
                                      : "bg-gray-50"
                                  } mb-4`}
                                >
                                  <h4
                                    className={`text-sm font-medium ${
                                      theme === "dark"
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    } mb-2`}
                                  >
                                    Passage:
                                  </h4>
                                  <div className="prose prose-sm max-w-none">
                                    {question.passage.length > 200 &&
                                    !isExpanded
                                      ? `${question.passage.substring(
                                          0,
                                          200
                                        )}...`
                                      : question.passage}
                                  </div>
                                </div>
                              )}
                            {question.question_text && (
                              <div className="prose prose-sm max-w-none">
                                {question.question_text.length > 150 &&
                                !isExpanded
                                  ? `${question.question_text.substring(
                                      0,
                                      150
                                    )}...`
                                  : question.question_text}
                              </div>
                            )}
                          </div>
                        )}

                        {viewMode === "compact" && (
                          <div
                            className={`${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            } text-sm`}
                          >
                            {question.type === "comprehension"
                              ? "Comprehension passage with multiple questions"
                              : question.question_text?.substring(0, 100) +
                                (question.question_text?.length > 100
                                  ? "..."
                                  : "")}
                          </div>
                        )}
                      </div>

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() => toggleExpand(question.id)}
                        className={`ml-4 p-2 rounded-lg ${
                          theme === "dark"
                            ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                            : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        } transition-colors duration-200`}
                      >
                        <svg
                          className={`w-5 h-5 transform transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div
                      className={`border-t ${
                        theme === "dark" ? "border-gray-800" : "border-gray-200"
                      } p-6`}
                    >
                      {/* Question Details */}
                      {question.type === "comprehension" &&
                        question.passage && (
                          <div
                            className={`p-4 rounded-lg ${
                              theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                            } mb-6`}
                          >
                            <h4
                              className={`text-sm font-medium ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-700"
                              } mb-2`}
                            >
                              Passage:
                            </h4>
                            <div
                              className={`prose prose-sm max-w-none ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-700"
                              }`}
                            >
                              {question.passage}
                            </div>
                          </div>
                        )}

                      {question.question_text && (
                        <div className="mb-6">
                          <h4
                            className={`text-sm font-medium ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            } mb-2`}
                          >
                            Question:
                          </h4>
                          <div
                            className={`prose prose-sm max-w-none ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            {question.question_text}
                          </div>
                        </div>
                      )}

                      {/* Sub-questions for comprehension */}
                      {question.type === "comprehension" &&
                        Array.isArray(question.sub_questions) && (
                          <div className="space-y-4">
                            {question.sub_questions.map(
                              (subQuestion, subIndex) => {
                                const subResult = getQuestionResult(
                                  subQuestion,
                                  userAnswers
                                );
                                const userAnswer = userAnswers[subQuestion.id];

                                return (
                                  <div
                                    key={subQuestion.id}
                                    className={`p-4 rounded-lg ${
                                      theme === "dark"
                                        ? "bg-gray-800"
                                        : "bg-gray-50"
                                    } border-l-4 ${
                                      subResult.status === "correct"
                                        ? "border-green-500"
                                        : subResult.status === "incorrect"
                                        ? "border-red-500"
                                        : "border-gray-400"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${subResult.class}`}
                                        >
                                          <span className="mr-1">
                                            {subResult.icon}
                                          </span>
                                          {subResult.label}
                                        </span>
                                        <span
                                          className={`text-sm font-medium ${
                                            theme === "dark"
                                              ? "text-gray-300"
                                              : "text-gray-700"
                                          }`}
                                        >
                                          Q{index + 1}.{subIndex + 1}
                                        </span>
                                        <span
                                          className={`text-xs ${
                                            theme === "dark"
                                              ? "text-gray-500"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          (
                                          {getQuestionTypeLabel(
                                            subQuestion.type
                                          )}
                                          )
                                        </span>
                                      </div>
                                      <span
                                        className={`text-xs ${
                                          theme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        +{subQuestion.positive_marks} / -
                                        {subQuestion.negative_marks}
                                      </span>
                                    </div>

                                    <div
                                      className={`${
                                        theme === "dark"
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      } mb-3`}
                                    >
                                      {subQuestion.question_text}
                                    </div>

                                    {/* Sub-question options and answers */}
                                    <QuestionContent
                                      question={subQuestion}
                                      userAnswer={userAnswer}
                                      result={subResult}
                                      theme={theme}
                                    />
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}

                      {/* Main question content (for non-comprehension) */}
                      {question.type !== "comprehension" && (
                        <QuestionContent
                          question={question}
                          userAnswer={userAnswers[question.id]}
                          result={result}
                          theme={theme}
                        />
                      )}

                      {/* Explanation */}
                      {question.explanation && (
                        <div
                          className={`mt-6 p-4 rounded-lg ${
                            theme === "dark"
                              ? "bg-blue-900 bg-opacity-20 border border-blue-800"
                              : "bg-blue-50 border border-blue-200"
                          }`}
                        >
                          <h4
                            className={`text-sm font-medium ${
                              theme === "dark"
                                ? "text-blue-300"
                                : "text-blue-800"
                            } mb-2 flex items-center`}
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Explanation
                          </h4>
                          <div
                            className={`prose prose-sm max-w-none ${
                              theme === "dark"
                                ? "text-blue-200"
                                : "text-blue-800"
                            }`}
                          >
                            {question.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for rendering question content
const QuestionContent = ({ question, userAnswer, result, theme }) => {
  //   const renderAnswer = (answer) => {
  //     if (answer === null || answer === undefined)
  //       return (
  //         <span
  //           className={`${
  //             theme === "dark" ? "text-gray-500" : "text-gray-500"
  //           } italic`}
  //         >
  //           Not answered
  //         </span>
  //       );
  //     if (typeof answer === "boolean") return answer ? "True" : "False";
  //     if (Array.isArray(answer)) return answer.join(", ");
  //     if (typeof answer === "object") return JSON.stringify(answer);
  //     return answer.toString();
  //   };

  const renderAnswer = (answer, question = null) => {
    if (answer === null || answer === undefined || answer === "") {
      return <span className="italic">Not answered</span>;
    }

    // For MCQ - show the option text instead of index
    if (question?.type === "mcq") {
      if (question.options && question.options[answer]) {
        return question.options[answer];
      }
      return answer; // fallback to index if options not available
    }

    // For MSQ - show multiple option texts instead of indices
    if (question?.type === "msq") {
      if (Array.isArray(answer) && question.options) {
        return answer.map((index, i) => (
          <span key={i}>
            {question.options[index] || index}
            {i < answer.length - 1 && ", "}
          </span>
        ));
      }
      return Array.isArray(answer) ? answer.join(", ") : answer;
    }

    // For True/False
    if (question?.type === "tf") {
      return answer === true ? "True" : answer === false ? "False" : answer;
    }

    // For Match type - show the pairs in a readable format
    if (question?.type === "match") {
      if (typeof answer === "object" && answer !== null) {
        return Object.entries(answer)
          .map(([left, right]) => `${left} → ${right}`)
          .join(", ");
      }
    }

    // For other types (fill, numerical, etc.)
    return answer.toString();
  };
  return (
    <div className="space-y-4">
      {/* Options for MCQ/MSQ */}
      {(question.type === "mcq" || question.type === "msq") &&
        question.options && (
          <div className="space-y-2">
            <h5
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Options:
            </h5>
            {question.options.map((option, optIndex) => {
              const optionLetter = String.fromCharCode(65 + optIndex);
              const isCorrect =
                question.type === "mcq"
                  ? question.correct_option === optionLetter
                  : question.correct_options?.includes(optionLetter);
              const isSelected =
                question.type === "mcq"
                  ? userAnswer === optionLetter
                  : userAnswer?.includes(optionLetter);

              return (
                <div
                  key={optIndex}
                  className={`p-3 rounded-lg border ${
                    isCorrect
                      ? theme === "dark"
                        ? "bg-green-900 border-green-700 text-green-200"
                        : "bg-green-50 border-green-200 text-green-800"
                      : isSelected
                      ? theme === "dark"
                        ? "bg-red-900 border-red-700 text-red-200"
                        : "bg-red-50 border-red-200 text-red-800"
                      : theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-gray-300"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{optionLetter}.</span>
                    <span className="flex-1">{option}</span>
                    {isCorrect && (
                      <span className="text-green-500 ml-2">✓</span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="text-red-500 ml-2">✗</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* Match the Following */}
      {question.type === "match" &&
        question.left_items &&
        question.right_items && (
          <div className="space-y-4">
            <h5
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Items to Match:
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h6
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } mb-2`}
                >
                  Left Items:
                </h6>
                <div className="space-y-2">
                  {question.left_items.map((item, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <span className="font-medium">{item.id}.</span>{" "}
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h6
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } mb-2`}
                >
                  Right Items:
                </h6>
                <div className="space-y-2">
                  {question.right_items.map((item, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <span className="font-medium">{item.id}.</span>{" "}
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Answer Summary */}
      <div
        className={`p-4 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h6
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
              Your Answer:
            </h6>
            <div
              className={`text-sm ${
                userAnswer
                  ? theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-700"
                  : theme === "dark"
                  ? "text-gray-500"
                  : "text-gray-500"
              }`}
            >
              {/* {renderAnswer(userAnswer)} */}
              {renderAnswer(userAnswer, question)}
            </div>
          </div>
          <div>
            <h6
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
              Correct Answer:
            </h6>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-green-300" : "text-green-700"
              }`}
            >
              {/* {question.type === "mcq" && renderAnswer(question.correct_option)}
              {question.type === "msq" &&
                renderAnswer(question.correct_options)}
              {question.type === "tf" && renderAnswer(question.is_true)}
              {(question.type === "fill" || question.type === "numerical") &&
                renderAnswer(question.correct_answer)}
              {question.type === "match" &&
                renderAnswer(question.correct_pairs)} */}
              {question.type === "mcq" &&
                renderAnswer(question.correct_option, question)}
              {question.type === "msq" &&
                renderAnswer(question.correct_options, question)}
              {question.type === "tf" &&
                renderAnswer(question.is_true, question)}
              {(question.type === "fill" || question.type === "numerical") &&
                renderAnswer(question.correct_answer, question)}
              {question.type === "match" &&
                renderAnswer(question.correct_pairs, question)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
