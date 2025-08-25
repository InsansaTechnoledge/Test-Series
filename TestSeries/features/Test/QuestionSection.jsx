import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
// import { useNavigate } from "react-router-dom"; // not required unless you use it

import MCQ from "./QuestionTypes/MCQ";
import MatchingQuestion from "./QuestionTypes/MatchingQuestion";
import MSQ from "./QuestionTypes/MSQ";
import TrueFalseQuestion from "./QuestionTypes/TrueFalseQuestion";
import CodeQuestion from "./QuestionTypes/CodeQuestion";
import NumericalQuestion from "./QuestionTypes/NumericQuestion";
import FillInTheBlankQuestion from "./QuestionTypes/FillInTheBlankQuestion";
import SubmitModal from "./utils/SubmitResultComponent";
import DescriptiveQuestion from "./QuestionTypes/DescriptiveQuestion";
import ComprehensionQuestion from "./QuestionTypes/ComprehensionQuestion";

const QuestionSection = ({
  setSelectedQuestion,
  selectedQuestion,
  // kept for compatibility; not used for navigation
  selectedSubject,
  subjectSpecificQuestions,
  setSubjectSpecificQuestions,
  handleSubmitTest,
}) => {
  const [option, setOption] = useState("");
  const { theme } = useTheme();
  const hasRestored = useRef(false);
  const isInitialLoad = useRef(true);
  const [submitCool, setSubmitCool] = useState(false);
  const lastSelectedQuestionId = useRef(null);
  const lastOptionValue = useRef(null);

  // ---------- Restore from storage on first load ----------
  useEffect(() => {
    if (hasRestored.current || !isInitialLoad.current) return;
    hasRestored.current = true;
    isInitialLoad.current = false;

    const savedData = sessionStorage.getItem("subjectSpecificQuestions");
    const savedQuestionId = localStorage.getItem("selectedQuestionId");

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setSubjectSpecificQuestions(parsed);

      let restored = null;
      if (savedQuestionId) {
        for (const subj of Object.keys(parsed)) {
          const found = parsed[subj]?.find((q) => q.id === savedQuestionId);
          if (found) {
            restored = { ...found, subject: subj, originalSubject: subj };
            break;
          }
        }
      }
      // Fallback to very first question overall
      if (!restored) {
        const subs = Object.keys(parsed).sort((a, b) => a.localeCompare(b));
        if (subs.length) {
          const firstSubj = subs[0];
          const firstQ = parsed[firstSubj]?.[0];
          if (firstQ) restored = { ...firstQ, subject: firstSubj, originalSubject: firstSubj };
        }
      }
      if (restored) setSelectedQuestion(restored);
    }
  }, [setSelectedQuestion, setSubjectSpecificQuestions]);

  // ---------- Persist subjectSpecificQuestions whenever they change ----------
  useEffect(() => {
    if (subjectSpecificQuestions) {
      sessionStorage.setItem(
        "subjectSpecificQuestions",
        JSON.stringify(subjectSpecificQuestions)
      );
    }
  }, [subjectSpecificQuestions]);

  // ---------- Persist selected question id ----------
  useEffect(() => {
    if (selectedQuestion) {
      localStorage.setItem("selectedQuestionId", selectedQuestion.id);
    }
  }, [selectedQuestion]);

  // ---------- Build deterministic subject and question order (subject cosmetic only) ----------
  const subjectOrder = useMemo(() => {
    if (!subjectSpecificQuestions) return [];
    // stable, deterministic order
    return Object.keys(subjectSpecificQuestions).sort((a, b) => a.localeCompare(b));
  }, [subjectSpecificQuestions]);

  const allQuestions = useMemo(() => {
    if (!subjectSpecificQuestions) return [];
    const list = [];
    let displayNum = 1;
    subjectOrder.forEach((subj) => {
      (subjectSpecificQuestions[subj] || []).forEach((q, idx) => {
        list.push({
          ...q,
          displayNumber: displayNum++,
          subject: subj,
          originalSubject: subj,
          originalIndex: idx,
        });
      });
    });
    return list;
  }, [subjectSpecificQuestions, subjectOrder]);

  const totalQuestions = allQuestions.length;

  // ---------- Current overall index ----------
  const currentOverallIndex = useMemo(() => {
    if (!selectedQuestion) return -1;
    return allQuestions.findIndex(
      (q) =>
        q.id === selectedQuestion.id &&
        (q.originalSubject || q.subject) ===
          (selectedQuestion.originalSubject || selectedQuestion.subject)
    );
  }, [allQuestions, selectedQuestion]);

  // ---------- Answered checker ----------
  const isAnswered = useMemo(() => {
    if (!selectedQuestion) return false;
    const { question_type, sub_questions } = selectedQuestion;

    switch (question_type) {
      case "mcq":
        return typeof option === "number";
      case "msq":
        return Array.isArray(option) && option.length > 0;
      case "fill":
        return typeof option === "string" && option.trim() !== "";
      case "tf":
        return typeof option === "boolean";
      case "numerical":
        return typeof option === "string" && option.trim() !== "" && !isNaN(option);
      case "match":
        return option && typeof option === "object" && Object.keys(option).length > 0;
      case "descriptive":
        return typeof option === "string" && option.trim() !== "";
      case "comprehension":
        return (
          option &&
          typeof option === "object" &&
          sub_questions?.every((subQ) => {
            const subOption = option?.[subQ.id];
            switch (subQ.question_type) {
              case "mcq":
                return typeof subOption === "number";
              case "msq":
                return Array.isArray(subOption) && subOption.length > 0;
              case "fill":
                return typeof subOption === "string" && subOption.trim() !== "";
              case "tf":
                return typeof subOption === "boolean";
              case "numerical":
                return (
                  typeof subOption === "string" &&
                  subOption.trim() !== "" &&
                  !isNaN(subOption)
                );
              default:
                return false;
            }
          })
        );
      case "code":
        return typeof option === "string" && option.trim() !== "";
      default:
        return false;
    }
  }, [option, selectedQuestion]);

  // ---------- Clear response factory ----------
  const handleClearResponse = (q) => {
    const { question_type, sub_questions } = q || {};
    switch (question_type) {
      case "mcq":
      case "numerical":
      case "tf":
        return null;
      case "msq":
        return [];
      case "fill":
      case "descriptive":
      case "code":
        return "";
      case "match":
        return {};
      case "comprehension":
        return (
          sub_questions?.reduce((acc, subQ) => {
            acc[subQ.id] = handleClearResponse(subQ);
            return acc;
          }, {}) || {}
        );
      default:
        return null;
    }
  };

  // ---------- FIXED: Persist response/status only when option or selectedQuestion changes ----------
  useEffect(() => {
    if (!selectedQuestion || !subjectSpecificQuestions) return;
    
    const currentQuestionId = selectedQuestion.id;
    const currentOptionValue = JSON.stringify(option);
    
    // Only update if the question changed OR the option value changed
    if (
      lastSelectedQuestionId.current === currentQuestionId && 
      lastOptionValue.current === currentOptionValue
    ) {
      return; // No changes, skip update
    }
    
    // Update refs to track current values
    lastSelectedQuestionId.current = currentQuestionId;
    lastOptionValue.current = currentOptionValue;

    const current = selectedQuestion;
    const originalSubject = current.originalSubject || current.subject;

    setSubjectSpecificQuestions((prev) => ({
      ...prev,
      [originalSubject]: prev[originalSubject].map((q) =>
        q.id === current.id
          ? {
              ...q,
              response: option,
              ...(isAnswered
                ? q.status === "markedForReview"
                  ? { status: "markedForReview" }
                  : { status: "answered" }
                : { status: "unanswered" }),
            }
          : q
      ),
    }));
  }, [option, isAnswered, selectedQuestion, setSubjectSpecificQuestions]);

  // ---------- Load response (or clear) when selected question changes ----------
  useEffect(() => {
    if (!selectedQuestion) return;
    if (selectedQuestion.response !== undefined) {
      setOption(selectedQuestion.response);
    } else {
      setOption(handleClearResponse(selectedQuestion));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestion?.id]);

  // ---------- Helpers for nav by overall index ----------
  const selectByOverallIndex = (idx) => {
    const next = allQuestions[idx];
    if (!next) return;
    const withSubject = { ...next, originalSubject: next.originalSubject || next.subject };
    setSelectedQuestion(withSubject);
    setOption(next.response !== undefined ? next.response : handleClearResponse(next));
  };

  const updateCurrentQuestionResponse = () => {
    if (!selectedQuestion) return;
    const current = selectedQuestion;
    const originalSubject = current.originalSubject || current.subject;

    setSubjectSpecificQuestions((prev) => ({
      ...prev,
      [originalSubject]: prev[originalSubject].map((q) =>
        q.id === current.id
          ? {
              ...q,
              response: option,
              ...(isAnswered
                ? q.status === "markedForReview"
                  ? { status: "markedForReview" }
                  : { status: "answered" }
                : { status: "unanswered" }),
            }
          : q
      ),
    }));
  };

  // ---------- Navigation (seamless across subjects) ----------
  const handleNext = () => {
    updateCurrentQuestionResponse();
    if (currentOverallIndex < totalQuestions - 1) {
      selectByOverallIndex(currentOverallIndex + 1);
    } else {
      setSubmitCool(true); // at absolute last question
    }
  };

  const handlePrevious = () => {
    updateCurrentQuestionResponse();
    if (currentOverallIndex > 0) {
      selectByOverallIndex(currentOverallIndex - 1);
    }
  };

  if (!selectedQuestion || !subjectSpecificQuestions) {
    return <div>Loading...</div>;
  }

  const isAtAbsoluteFirst = currentOverallIndex <= 0;
  const isAtAbsoluteLast = currentOverallIndex >= totalQuestions - 1;

  const questionNumber = allQuestions[currentOverallIndex]?.displayNumber || 1;
  const questionSubject = allQuestions[currentOverallIndex]?.subject || "Unknown";

  return (
    <div
      className={`relative w-full flex flex-col justify-between gap-6 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header (subject is purely cosmetic) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 py-1">
        <div className="flex items-center gap-4">
          <div
            className={`px-5 py-1 rounded-full text-sm font-medium m-1 ${
              theme === "dark"
                ? "bg-indigo-900 text-blue-200 border border-indigo-700"
                : "bg-indigo-100 text-indigo-800 border border-indigo-300"
            }`}
          >
            {questionSubject}
          </div>
        </div>
        <div
          className={`text-sm ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {questionNumber} of {totalQuestions}
        </div>
      </div>

      {/* Body */}
      <div
        className={`flex-1 ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-50"
        } rounded-lg`}
      >
        {(() => {
          switch (selectedQuestion.question_type) {
            case "mcq":
              return <MCQ selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
            case "msq":
              return <MSQ selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
            case "fill":
              return (
                <FillInTheBlankQuestion
                  selectedQuestion={selectedQuestion}
                  option={option}
                  setOption={setOption}
                />
              );
            case "tf":
              return (
                <TrueFalseQuestion
                  selectedQuestion={selectedQuestion}
                  option={option}
                  setOption={setOption}
                />
              );
            case "match":
              return (
                <MatchingQuestion
                  selectedQuestion={selectedQuestion}
                  option={option}
                  setOption={setOption}
                />
              );
            case "numerical":
              return (
                <NumericalQuestion
                  selectedQuestion={selectedQuestion}
                  option={option}
                  setOption={setOption}
                />
              );
            case "descriptive":
              return (
                <DescriptiveQuestion
                  selectedQuestion={selectedQuestion}
                  option={option}
                  setOption={setOption}
                />
              );
            case "code":
              return <CodeQuestion selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
            case "comprehension":
              return <ComprehensionQuestion selectedQuestion={selectedQuestion} option={option} setOption={setOption} />;
            default:
              return null;
          }
        })()}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 text-base sm:text-lg p-8">
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 items-center order-2 sm:order-1">
          <button
            onClick={handlePrevious}
            disabled={isAtAbsoluteFirst}
            className={`px-4 py-2 rounded-md font-semibold border transition-all duration-200
              ${
                theme === "light"
                  ? isAtAbsoluteFirst
                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                  : isAtAbsoluteFirst
                  ? "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed"
                  : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
              }`}
          >
            Previous
          </button>

          <button
            onClick={() => setOption(handleClearResponse(selectedQuestion))}
            className={`px-4 py-2 rounded-md font-semibold border transition-all duration-200
              ${
                theme === "light"
                  ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                  : "bg-blue-950 text-blue-200 border-blue-800 hover:bg-blue-900"
              }`}
          >
            Clear Response
          </button>

          {selectedQuestion.status === "markedForReview" ? (
            <button
              onClick={() => {
                const curr = selectedQuestion;
                const originalSubject = curr.originalSubject || curr.subject;
                setSubjectSpecificQuestions((prev) => ({
                  ...prev,
                  [originalSubject]: prev[originalSubject].map((q) =>
                    q.id === curr.id
                      ? {
                          ...q,
                          ...(isAnswered ? { status: "answered" } : { status: "unanswered" }),
                        }
                      : q
                  ),
                }));
                handleNext();
              }}
              className={`px-4 py-2 rounded-md font-semibold transition-all duration-200
                ${
                  theme === "light"
                    ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                }`}
            >
              Unmark for Review & Next
            </button>
          ) : (
            <button
              onClick={() => {
                const curr = selectedQuestion;
                const originalSubject = curr.originalSubject || curr.subject;
                setSubjectSpecificQuestions((prev) => ({
                  ...prev,
                  [originalSubject]: prev[originalSubject].map((q) =>
                    q.id === curr.id
                      ? {
                          ...q,
                          response: isAnswered ? option : null,
                          status: "markedForReview",
                        }
                      : q
                  ),
                }));
                handleNext();
              }}
              className={`px-4 py-2 rounded-md font-semibold transition-all duration-200
                ${
                  theme === "light"
                    ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                }`}
            >
              Mark for Review & Next
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={isAtAbsoluteLast}
            className={`px-4 py-2 rounded-md font-semibold border transition-all duration-200
              ${
                theme === "light"
                  ? isAtAbsoluteLast
                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                  : isAtAbsoluteLast
                  ? "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed"
                  : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Optional submit-on-last */}
      {submitCool && (
        <SubmitModal
          isOpen={submitCool}
          onClose={() => setSubmitCool(false)}
          onSubmit={handleSubmitTest}
        />
      )}
    </div>
  );
};

export default QuestionSection;