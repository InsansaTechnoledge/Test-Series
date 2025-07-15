import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Code,
  Plus,
  Trophy,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { saveContestQuestion } from "../../../../utils/services/contestQuestionService";
// import { useSearchParams } from 'react-router-dom';
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../../../../hooks/useTheme";
import {
  fetchCodingQuestion,
  fetchCodingQuestions,
} from "../../../../utils/services/contestService";
import { ToastContainer, useToast } from "../../../../utils/Toaster";

export default function QuestionCreator() {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get("contestId");
  // const contestId = "demo-contest-id";

  const navigate = useNavigate();
  // const contestId = "demo-contest-id";

  const [difficulty, setDifficulty] = useState("Easy");
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [fullDetails, setFullDetails] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [cache, setCache] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const { toasts, showToast, removeToast } = useToast();

  const fetchQuestions = async () => {
    if (cache[difficulty] && cache[difficulty][page]) {
      const cachedData = cache[difficulty][page];
      setQuestions(cachedData.data || []);
      setTotalPages(cachedData.totalPages || 1);
      return;
    }

    const res = await fetchCodingQuestions(difficulty, page, limit);
    const questionData = res?.data?.data || [];
    const totalPages = res?.data?.totalPages || 1;

    setQuestions(questionData);
    setTotalPages(totalPages);

    setCache((prev) => ({
      ...prev,
      [difficulty]: {
        ...(prev[difficulty] || {}),
        [page]: {
          data: questionData,
          totalPages,
        },
      },
    }));
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const fetchFullQuestion = async (id) => {
    const res = await fetchCodingQuestion(id);
    setFullDetails(res?.data || null);
  };

  useEffect(() => {
    setPage(1);
    fetchQuestions();
  }, [difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  const submitContest = async () => {
    const payload = {
      contestId: contestId,
      questions: selectedQuestions.map(({ id, marks, difficulty }) => ({
        coding_question_id: id,
        marks,
        difficulty,
      })),
    };
    console.log("✅ Submit Contest Payload:", payload);
    const response = await saveContestQuestion(payload);
    if (response.status === 200) {
      showToast("Contest created successfully!");
      setSelectedQuestions([]);
      setFullDetails(null);
      navigate(`/institute/contest-list`);
    } else {
      showToast("Failed to create contest. Please try again.", "error");
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "Easy":
        return theme === "dark"
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-800";
      case "Medium":
        return theme === "dark"
          ? "bg-yellow-900 text-yellow-300"
          : "bg-yellow-100 text-yellow-800";
      case "Hard":
        return theme === "dark"
          ? "bg-red-900 text-red-300"
          : "bg-red-100 text-red-800";
      default:
        return theme === "dark"
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-800";
    }
  };

  const themeClasses = {
    bg: theme === "dark" ? "bg-gray-950" : "bg-gray-50",
    cardBg: theme === "dark" ? "bg-gray-900" : "bg-white",
    border: theme === "dark" ? "border-gray-700" : "border-gray-200",
    text: theme === "dark" ? "text-gray-100" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-300" : "text-gray-600",
    textMuted: theme === "dark" ? "text-gray-400" : "text-gray-500",
    primary: theme === "dark" ? "bg-indigo-400" : "bg-indigo-600",
    primaryHover:
      theme === "dark" ? "hover:bg-indigo-300" : "hover:bg-indigo-700",
    primaryText: theme === "dark" ? "text-indigo-400" : "text-indigo-600",
    button:
      theme === "dark"
        ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700",
    input:
      theme === "dark"
        ? "bg-gray-800 border-gray-600 text-gray-200"
        : "bg-white border-gray-300 text-gray-900",
    shadow:
      theme === "dark"
        ? "shadow-lg shadow-gray-900/20"
        : "shadow-lg shadow-gray-200/20",
  };

  return (
    <div
      className={`min-h-screen ${themeClasses.bg} transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div
          className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-6 mb-8 ${themeClasses.shadow}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className={`w-8 h-8 ${themeClasses.primaryText}`} />
            <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
              Contest Question Creator
            </h1>
          </div>
          <p className={`${themeClasses.textSecondary} text-lg`}>
            Browse and select coding questions to create your contest
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Question Browser */}
          <div className="xl:col-span-2 space-y-6">
            {/* Filter Section */}
            <div
              className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-xl p-6 ${themeClasses.shadow}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label
                    className={`${themeClasses.text} font-semibold text-lg`}
                  >
                    Difficulty Level:
                  </label>
                  <select
                    className={`${themeClasses.input} ${themeClasses.border} border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg ${themeClasses.button} font-medium`}
                >
                  {questions.length} Questions Available
                </div>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions?.map((q) => (
                <div
                  key={q.id}
                  className={`${themeClasses.cardBg} ${
                    themeClasses.border
                  } border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    themeClasses.shadow
                  } hover:shadow-xl ${
                    selectedId === q.id
                      ? `ring-2 ring-indigo-500 ${
                          theme === "dark" ? "bg-indigo-950" : "bg-indigo-50"
                        }`
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedId(q.id);
                    fetchFullQuestion(q.id);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className={`font-bold text-lg ${themeClasses.text} leading-tight`}
                    >
                      {q.title}
                    </h3>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(
                        q.difficulty
                      )}`}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                  <p className={`${themeClasses.textMuted} text-sm mb-3`}>
                    Slug: <span className="font-mono">{q.title_slug}</span>
                  </p>
                  <div className="flex items-center justify-between">
                    <Code className={`w-4 h-4 ${themeClasses.textMuted}`} />
                    {selectedQuestions.some((sq) => sq.id === q.id) && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div
              className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-xl p-4 ${themeClasses.shadow}`}
            >
              <div className="flex items-center justify-between">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${themeClasses.button} transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={handlePrevious}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  <span className={`${themeClasses.textSecondary} font-medium`}>
                    Page {page} of {totalPages}
                  </span>
                </div>

                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${themeClasses.button} transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={handleNext}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Selected Questions */}
          <div className="space-y-6">
            <div
              className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-xl p-6 ${themeClasses.shadow} sticky top-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Trophy className={`w-6 h-6 ${themeClasses.primaryText}`} />
                <h2 className={`text-xl font-bold ${themeClasses.text}`}>
                  Selected Questions
                </h2>
                <span
                  className={`px-3 py-1 text-sm font-bold rounded-full ${themeClasses.primary} text-white`}
                >
                  {selectedQuestions.length}
                </span>
              </div>

              {selectedQuestions.length === 0 ? (
                <div className={`text-center py-8 ${themeClasses.textMuted}`}>
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No questions selected yet.</p>
                  <p className="text-sm mt-1">
                    Click on questions to add them to your contest.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedQuestions.map((q, index) => (
                    <div
                      key={q.id}
                      className={`${themeClasses.border} border rounded-lg p-4 space-y-3`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className={`font-bold ${themeClasses.text} text-sm`}
                          >
                            {index + 1}. {q.title}
                          </h4>
                          <p
                            className={`text-xs ${themeClasses.textMuted} mt-1`}
                          >
                            Difficulty: {q.difficulty}
                          </p>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                          onClick={() =>
                            setSelectedQuestions((prev) =>
                              prev.filter((que) => que.id !== q.id)
                            )
                          }
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <label
                          className={`text-sm ${themeClasses.textSecondary} font-medium`}
                        >
                          Marks:
                        </label>
                        <input
                          type="number"
                          className={`${themeClasses.input} ${themeClasses.border} border px-2 py-1 rounded text-sm w-20 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          min={q.test_cases?.length || 1}
                          value={q.marks}
                          onChange={(e) => {
                            const updatedMarks = parseInt(e.target.value) || 0;
                            setSelectedQuestions((prev) =>
                              prev.map((item) =>
                                item.id === q.id
                                  ? { ...item, marks: updatedMarks }
                                  : item
                              )
                            );
                          }}
                        />
                      </div>

                      {q.test_cases?.length > 0 && (
                        <div
                          className={`text-xs ${themeClasses.textMuted} space-y-1`}
                        >
                          <p className="font-semibold">
                            Test Case Distribution:
                          </p>
                          <div className="space-y-1">
                            {q.test_cases.slice(0, 3).map((_, i) => {
                              const perCaseMark =
                                (q.marks || 0) / q.test_cases.length;
                              return (
                                <div key={i} className="flex justify-between">
                                  <span>Test Case {i + 1}:</span>
                                  <span className="font-mono">
                                    {perCaseMark.toFixed(2)} marks
                                  </span>
                                </div>
                              );
                            })}
                            {q.test_cases.length > 3 && (
                              <div
                                className={`text-xs ${themeClasses.textMuted}`}
                              >
                                +{q.test_cases.length - 3} more test cases...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedQuestions.length > 0 && (
                <button
                  className={`w-full mt-6 px-6 py-3 ${themeClasses.primary} ${themeClasses.primaryHover} text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2`}
                  onClick={submitContest}
                >
                  <Trophy className="w-5 h-5" />
                  Create Contest ({selectedQuestions.length} Questions)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Details Modal */}
        {fullDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`${themeClasses.cardBg} rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto ${themeClasses.shadow}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2
                    className={`text-2xl font-bold ${themeClasses.text} mb-2`}
                  >
                    {fullDetails.title}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(
                      fullDetails.difficulty
                    )}`}
                  >
                    {fullDetails.difficulty}
                  </span>
                </div>
                <button
                  className={`p-2 rounded-lg ${themeClasses.button} transition-colors duration-200`}
                  onClick={() => setFullDetails(null)}
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div
                className={`prose prose-sm max-w-none ${themeClasses.textSecondary} mb-8`}
                dangerouslySetInnerHTML={{ __html: fullDetails.content }}
              />

              <div className="flex gap-4">
                <button
                  className={`px-6 py-3 ${themeClasses.primary} ${themeClasses.primaryHover} text-white rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2`}
                  onClick={() => {
                    const alreadyAdded = selectedQuestions.some(
                      (q) => q.id === fullDetails.id
                    );
                    if (!alreadyAdded) {
                      setSelectedQuestions((prev) => [
                        ...prev,
                        {
                          id: fullDetails.id,
                          title: fullDetails.title,
                          difficulty: fullDetails.difficulty,
                          marks: fullDetails.test_cases?.length,
                          test_cases: fullDetails.test_cases || [],
                        },
                      ]);
                    }
                    setFullDetails(null);
                  }}
                  disabled={selectedQuestions.some(
                    (q) => q.id === fullDetails.id
                  )}
                >
                  <Plus className="w-5 h-5" />
                  {selectedQuestions.some((q) => q.id === fullDetails.id)
                    ? "Already Added"
                    : "Add to Contest"}
                </button>

                <button
                  className={`px-6 py-3 ${themeClasses.button} rounded-lg font-semibold transition-colors duration-200`}
                  onClick={() => setFullDetails(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
