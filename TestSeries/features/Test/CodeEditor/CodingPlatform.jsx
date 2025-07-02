import React, { useEffect, useMemo, useState } from 'react';
import { languages } from './Data/Language';
import { useResizable } from './hooks/useResizable';
import { useVerticalResizable } from './hooks/useVerticleResizable';
import ProblemDescription from './components/ProblemDescription';
import DatabaseSchemaView from './components/DataBaseSchemaView';
import VerticalDragHandle from './components/VerticleDragHandle';
import CodeEditor from './components/CodeEditor';
import HorizontalDragHandle from './components/HorizontalDragHandle';
import OutputPanel from './components/OutPutPanel';
import HeaderComponent from './components/HeaderComponent';
import { getContestQuestions, runContestCode, runContestTestCases } from '../../../utils/services/contestQuestionService';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { VITE_SECRET_KEY_FOR_CONTEST } from '../../constants/env';
import { generateCodeTemplate, getFinalCodeForSubmission, getFinalCodeForTestRun } from './Data/starterCode';
import { useTheme } from '../../../hooks/useTheme';

const CodingPlatform = () => {
  const { contestId } = useParams();
  const decodedId = decodeURIComponent(contestId);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [outputTab, setOutputTab] = useState('testcase');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testinput, setTestInput] = useState('');
  
  
  const [editorTheme, setEditorTheme] = useState('vs-dark');

  const SECRET_KEY_CONTEST = import.meta.env.VITE_SECRET_KEY_FOR_CONTEST || VITE_SECRET_KEY_FOR_CONTEST;

  const contest_id = useMemo(() => {
    try {
      return CryptoJS.AES.decrypt(decodedId, SECRET_KEY_CONTEST).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Error decrypting contestId:", error);
      return null;
    }
  }, [decodedId, SECRET_KEY_CONTEST]);

  useEffect(() => {
    if (!contest_id) {
      setErrors(prev => [...prev, "Invalid or missing contest ID"]);
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
  const outputPanel = useVerticalResizable(200, 100, 500);
  const problem = problems[currentProblem];

  useEffect(() => {
    if (problem && problem.code_snippets) {
      const snippetObj = problem.code_snippets.find(snip => snip.langSlug === language);
      const starter_code = snippetObj?.code || '';
      setCode(starter_code);
      setTestResults([]);
      setOutput('');
      setErrors([]);
    }
  }, [currentProblem, language, problem]);

  const { theme } = useTheme();

  // Auto-sync editor theme with app theme (optional)
  useEffect(() => {
    if (theme === 'light') {
      setEditorTheme('vs-light');
    } else {
      setEditorTheme('vs-dark');
    }
  }, [theme]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setErrors([]);
    try {
      const currentLang = languages.find((l) => l.value === language);
      const answer=await getFinalCodeForTestRun(currentLang.langSlug, code, problem);
      const response = await runContestCode(answer, currentLang);
      if (response.status !== 200) {
        setErrors(['Failed to run code: ' + response.statusText]);
        setIsRunning(false);
        return;
      }
      const result = response.data;
      setTestInput('');
      if (!result) {
        setErrors(['No response from server']);
        setIsRunning(false);
        return;
      }
      if (result.compile?.stderr) {
        setErrors((prev) => [...prev, result.compile.stderr]);
      }
      if (result.run?.stdout) setOutput(result.run.stdout);
      if (result.run?.stderr) setErrors((prev) => [...prev, result.run.stderr]);
    } catch (error) {
      setErrors(['Network error: ' + error.message]);
    } finally {
      setIsRunning(false);
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    let results = [];
    setErrors([]);
    try {
      if (!problem || !problem.test_cases?.length) {
        setErrors(['No problem or test cases defined!']);
        setIsRunning(false);
        return;
      }
      const currentLang = languages.find((l) => l.value === language);
      if (!currentLang) {
        setErrors(['Unsupported language selected!']);
        setIsRunning(false);
        return;
      }
      const answer =await getFinalCodeForSubmission(currentLang.langSlug, code, problem);
      const response = await runContestTestCases(answer.finalCode, answer.output, currentLang);
      if (response.status === 200) {
        results = response.data.results;
        setErrors(response.data.errors || []);
      }
    } catch (error) {
      console.error('runTests error:', error);
      setErrors(['Test execution failed: ' + error.message]);
    }
    setTestResults(results);
    setIsRunning(false);
    setOutputTab('testcase');
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${
        theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'
      }`}>
        <div className={`text-lg ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${
      theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
    }`}>
      <HeaderComponent
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
      />
      <div className="flex-1 flex overflow-hidden">
        <div
          ref={leftPanel.containerRef}
          className={`border-r flex flex-col ${
            theme === 'light' 
              ? 'bg-white border-gray-200' 
              : 'bg-gray-800 border-gray-700'
          }`}
          style={{ width: `${leftPanel.width}%` }}
        >
          <div className={`flex border-b flex-shrink-0 ${
            theme === 'light' ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2 border-b-2 transition-all duration-300 ${
                activeTab === 'description' 
                  ? theme === 'light'
                    ? 'border-blue-500 text-blue-600 bg-gray-50'
                    : 'border-blue-400 text-blue-300 bg-gray-700'
                  : theme === 'light'
                    ? 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              Description
            </button>
           
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'description' && <ProblemDescription problem={problem} />}
           
          </div>
        </div>
        <VerticalDragHandle
          onMouseDown={leftPanel.startResize}
          isResizing={leftPanel.isResizing}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            style={{ height: `calc(100% - ${outputPanel.height}px)` }}
            className="overflow-hidden"
          >
            <CodeEditor 
              code={code} 
              onChange={setCode} 
              language={language}
              theme={editorTheme}
            />
          </div>
          <HorizontalDragHandle
            onMouseDown={outputPanel.startResize}
            isResizing={outputPanel.isResizing}
          />
          <div style={{ height: `${outputPanel.height}px` }}>
            <OutputPanel
              activeTab={outputTab}
              setActiveTab={setOutputTab}
              testResults={testResults}
              isRunning={isRunning}
              output={output}
              errors={errors}
              height={outputPanel.height}
              testinput={testinput}
              setTestInput={setTestInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPlatform;