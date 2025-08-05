import React, { useEffect, useMemo, useState } from "react";
import { languages } from "./Data/Language";
import { useResizable } from "./hooks/useResizable";
import { useVerticalResizable } from "./hooks/useVerticleResizable";
import ProblemDescription from "./components/ProblemDescription";
import VerticalDragHandle from "./components/VerticleDragHandle";
import CodeEditor from "./components/CodeEditor";
import HorizontalDragHandle from "./components/HorizontalDragHandle";
import OutputPanel from "./components/OutPutPanel";
import HeaderComponent from "./components/HeaderComponent";
import {
  getContestQuestions,
  runContestCode,
  runContestTestCases,
} from "../../../utils/services/contestQuestionService";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import { VITE_SECRET_KEY_FOR_CONTEST } from "../../constants/env";
import { useTheme } from "../../../hooks/useTheme";
import { submitContestService } from "../../../utils/services/contestService";
import ContestResultComponent from "../../afterAuth/components/StudentSide/Coding-Contests/contestResult/contestResultComponent";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Save } from "lucide-react";
import { useToast, ToastContainer } from "../../../utils/Toaster";

const CodingPlatform = () => {
  const { contestId } = useParams();
  const decodedId = decodeURIComponent(contestId);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [outputTab, setOutputTab] = useState("testcase");
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testinput, setTestInput] = useState([]);
  const [showResultPage, setShowResultPage] = useState(false);
  const [resultPageData, setResultPageData] = useState(null);
  const { toasts, showToast, removeToast } = useToast();
  const [isOutputVisible, setIsOutputVisible] = useState(true);
  const [showTestResults, setShowTestResults] = useState(true);

  const [editorTheme, setEditorTheme] = useState("vs-dark");

  const SECRET_KEY_CONTEST =
    import.meta.env.VITE_SECRET_KEY_FOR_CONTEST || VITE_SECRET_KEY_FOR_CONTEST;

  const contestData = useMemo(() => {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        decodedId,
        SECRET_KEY_CONTEST
      ).toString(CryptoJS.enc.Utf8);

      if (!decrypted) throw new Error("Empty decrypted string");

      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Error decrypting contest data:", error);
      return null;
    }
  }, [decodedId, SECRET_KEY_CONTEST]);

  const contest_id = contestData?.contest_id;
  const duration = contestData?.duration;


  useEffect(() => {
    if (!contestData) {
      showToast("Invalid contest data. Please check your link.", "error");
    }
  }, [contestData]);


  useEffect(() => {
    if (!contest_id) {
      setErrors((prev) => [...prev, "Invalid or missing contest ID"]);
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [contest_id]);

  const getCodeQuestions = async (contest_id) => {
    const response = await getContestQuestions(contest_id);
    if (!response || !response.data) return [];
    return response.status === 200 ? response.data : [];
  };

  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const data = await getCodeQuestions(contest_id);
      setProblems(data);
    };
    fetchProblems();
  }, [contest_id]);

  const leftPanel = useResizable(50, 20, 80);
  const rightPanel = useVerticalResizable(200, 100, 500);
  const outputPanel = useVerticalResizable(200, 100, 500);
  const problem = problems[currentProblem];

  useEffect(() => {
    if (problem && problem.code_snippets) {
      const snippetObj = problem.code_snippets.find(
        (snip) => snip.langSlug === language
      );
      const starter_code = snippetObj?.code || "";
      setCode(starter_code);
      setTestResults([]);
      setOutput("");
      setErrors([]);
    }
  }, [currentProblem, language, problem]);

  const { theme } = useTheme();

  // Auto-sync editor theme with app theme (optional)
  useEffect(() => {
    if (theme === "light") {
      setEditorTheme("vs-light");
    } else {
      setEditorTheme("vs-dark");
    }
  }, [theme]);

  const runCode = async () => {
    if (code.trim() === "") {
      setErrors(["Code cannot be empty!"]);
      return;
    }
    //  setTestInput([]);
    setIsRunning(true);
    setOutput("");
    setErrors([]);
    try {
      const currentLang = languages.find((l) => l.value === language);

      const response = await runContestCode(code, problem, currentLang);

      if (response.status !== 200) {
        setErrors(["Failed to run code: " + response.statusText]);
        setIsRunning(false);
        return;
      }
      const { result, testInput } = response.data;
      console.log("Run Result:", result);
      setTestInput(testInput || []);
      if (!result) {
        setErrors(["No response from server"]);
        setIsRunning(false);
        return;
      }
      if (result.compile?.stderr) {
        setErrors((prev) => [...prev, result.compile.stderr]);
      }
      if (result.run?.stdout) {
        setOutput(
          typeof result.run.stdout === "string"
            ? (() => {
              try {
                return JSON.parse(result.run.stdout);
              } catch {
                try {
                  return eval(result.run.stdout);
                } catch {
                  return result.run.stdout;
                }
              }
            })()
            : result.run.stdout
        );
      }
      if (result.run?.stderr) setErrors((prev) => [...prev, result.run.stderr]);
    } catch (error) {
      setErrors(["Network error: " + error.message]);
    } finally {
      const currentLang = languages.find((l) => l.value === language);
      if (!currentLang) {
        setErrors(["Unsupported language selected!"]);
        setIsRunning(false);
        return;
      }
      localStorage.setItem(
        `contest_${contest_id}_problem_${problem.question_id}_language_${language}_code_`,
        code
      );
      setIsRunning(false);
    }
  };

  const runTests = async () => {
    setTestInput([]);
    if (code.trim() === "") {
      setErrors(["Code cannot be empty!"]);
      return;
    }
    setTestInput([]);
    setIsRunning(true);
    let results = [];
    setErrors([]);
    try {
      if (!problem || !problem.test_cases?.length) {
        setErrors(["No problem or test cases defined!"]);
        setIsRunning(false);
        return;
      }
      const currentLang = languages.find((l) => l.value === language);
      if (!currentLang) {
        setErrors(["Unsupported language selected!"]);
        setIsRunning(false);
        return;
      }
      console.log(
        "Running tests for problem:",
        problem.title,
        "in language:",
        currentLang.value
      );

      const response = await runContestTestCases(code, problem, currentLang);

      if (response.status === 200) {
        results = response.data.results;
        console.log("Test Results:", results);
        setTestInput(response.data.testInput || []);
        setOutput(results.fullOutput || "");
        setTestResults(results);
        setOutput(results.fullOutput || "");
        setErrors(response.data.errors || []);
      }
    } catch (error) {
      console.error("runTests error:", error);
      setErrors([
        "Test execution failed: " + error.response?.data?.message ||
        error.message,
      ]);
      setOutput("");
      setTestResults([]);
      console.error("runTests error:", error);
      setErrors(["Test execution failed: " + error.message]);
    } finally {
      const marksForEachTestCase = problem.marks / problem.test_cases.length;

      localStorage.setItem(
        `contest_${contest_id}_problem_${problem.question_id}_testResults`,
        results.passedCount * marksForEachTestCase || 0
      );
    }
    setIsRunning(false);
    setOutputTab("testcase");
  };


  const submitContest = async () => {
    const studentResult = {
      results: problems.map((problem) => ({
        questionId: problem.question_id,
        obtainedMarks:
          parseFloat(
            localStorage.getItem(
              `contest_${contest_id}_problem_${problem.question_id}_testResults`
            )
          ) || 0,
      })),
      totalMarks: problems.reduce((total, problem) => total + problem.marks, 0),
      totalObtainedMarks: problems.reduce(
        (total, problem) =>
          total +
          (parseFloat(
            localStorage.getItem(
              `contest_${contest_id}_problem_${problem.question_id}_testResults`
            )
          ) || 0),
        0
      ),
    };

    const response = await submitContestService(contest_id, studentResult);
    if (response.status === 200) {
      setResultPageData({ problems, studentResult });
      showToast("Contest submitted successfully!");
      setShowResultPage(true);
      localStorage.removeItem(`contest_${contest_id}_problem_${problem.question_id}_language_${language}_code_`);
      localStorage.removeItem(`contest_${contest_id}_problem_${problem.question_id}_testResults`);
      localStorage.removeItem(`encryptedTimeLeft_${contest_id}`);
      localStorage.removeItem("totalInitialTime")

    } else {
      showToast(`Failed to submit contest:   ${response.statusText}`, "error");
    }
  };

  const resetCode = () => {
    localStorage.removeItem(`contest_${contest_id}_problem_${problem.question_id}_language_${language}_code_`);
    setCode(problem?.code_snippets?.find(snip => snip.langSlug === language)?.code || "");
    setOutput("");
    setTestResults([]);
    setErrors([]);
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${theme === "light" ? "bg-gray-100" : "bg-gray-900"
          }`}
      >
        <div
          className={`text-lg ${theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      {showResultPage && resultPageData && (
        <ContestResultComponent
          problems={resultPageData.problems}
          studentResult={resultPageData.studentResult}
        />
      )}

      {!showResultPage && !resultPageData && (
        <div
          className={`flex flex-col m-6 ${theme === "light" ? "" : "bg-gray-700"
            }`}
        >
          <HeaderComponent
            contest_id={contest_id}
            duration={duration}
            problems={problems}
            language={language}
            setCurrentProblem={setCurrentProblem}
            setLanguage={setLanguage}
            currentProblem={currentProblem}
            languages={languages}
            runCode={runCode}
            isRunning={isRunning}
            runTests={runTests}
            editorTheme={editorTheme}
            setEditorTheme={setEditorTheme}
            submitContest={submitContest}
            resetCode={resetCode}
          />

          <div className="flex-1 flex overflow-hidden">
            <div
              ref={leftPanel.containerRef}
              className={`border-r flex flex-col ${theme === "light"
                ? "bg-white border-gray-200"
                : "bg-gray-800 border-gray-700"
                }`}
              style={{ width: `${leftPanel.width}%`, height: "5%" }}
            >
              <div
                className={`flex border-b flex-shrink-0 ${theme === "light" ? "border-gray-200" : "border-gray-700"
                  }`}
              >
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-4 py-2 border-b-2 transition-all duration-300 ${activeTab === "description"
                    ? theme === "light"
                      ? "border-blue-500 text-blue-600 bg-gray-50"
                      : "border-blue-400 text-blue-300 bg-gray-700"
                    : theme === "light"
                      ? "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                    }`}
                >
                  Description
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === "description" && (
                  <ProblemDescription problem={problem} />
                )}
              </div>
            </div>

            <VerticalDragHandle
              onMouseDown={leftPanel.startResize}
              isResizing={leftPanel.isResizing}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Code Editor */}
              <div
                style={{
                  height: showTestResults
                    ? `calc(100% - ${outputPanel.height + 40}px)` // 40px = tab bar height
                    : '100%',
                  transition: 'height 0.3s ease',
                }}
                className="overflow-hidden"
              >
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  language={language}
                  theme={editorTheme}
                  contest_id={contest_id}
                  question_id={problem?.question_id || ""}
                />
              </div>

              {/* Tab Bar (absolute at bottom or above panel) */}
              <div
                className="absolute left-0 right-0 flex items-center justify-between px-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600"
                style={{
                  height: '40px',
                  bottom: showTestResults ? `${outputPanel.height}px` : '10%',
                  transition: 'bottom 0.3s ease',
                  zIndex: 30,
                }}
              >
                {/* Tab Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setOutputTab("testResults")}
                    className={`text-sm font-medium ${outputTab === "testResults" ? "text-blue-600" : ""}`}
                  >
                    Test Results
                  </button>
                  <button
                    onClick={() => setOutputTab("output")}
                    className={`text-sm font-medium ${outputTab === "output" ? "text-blue-600" : ""}`}
                  >
                    Output
                  </button>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => setShowTestResults((prev) => !prev)}
                  className="text-sm flex items-center gap-1"
                >
                  {showTestResults ? "Hide ▼" : "Show ▲"}
                </button>
              </div>

              {/* Resize Handle (only when open) */}
              {showTestResults && (
                <HorizontalDragHandle
                  onMouseDown={outputPanel.startResize}
                  isResizing={outputPanel.isResizing}
                />
              )}

              {/* Output Panel */}
              {showTestResults && (
                <div
                  style={{
                    height: `${outputPanel.height}px`,
                    transition: 'height 0.3s ease',
                  }}
                >
                  <OutputPanel
                    activeTab={outputTab}
                    setActiveTab={setOutputTab}
                    testResults={testResults}
                    isRunning={isRunning}
                    output={output}
                    errors={errors}
                    height={outputPanel.height}
                    testInput={testinput}
                    showTestResults={showTestResults}
                    toggleTestResults={() => setShowTestResults((prev) => !prev)}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default CodingPlatform;
