import React, { useEffect, useState } from 'react';
// import { problems } from './Data/Problems';
import { languages } from './Data/Language';
import { useResizable } from './hooks/useResizable';
import { useVerticalResizable } from './hooks/useVerticleResizable';
import ProblemDescription from './components/ProblemDescription';
import DatabaseSchemaView from './components/DataBaseSchemaView';
import VerticalDragHandle from './components/VerticleDragHandle';
import CodeEditor from './components/CodeEditor';
import HorizontalDragHandle from './components/HorizontalDragHandle';
import OutputPanel from './components/OutPutPanel';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import HeaderComponent from './components/HeaderComponent';
import { getContestQuestions } from '../../../utils/services/contestQuestionService';

const CodingPlatform = () => {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [outputTab, setOutputTab] = useState('testcase');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState([]);

  const getCodeQuestions = async(contest_id) => {

    const response=await getContestQuestions(contest_id);
    if(response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch questions:", response.statusText);
      return [];
    }

  };

  const contest_id = '81f0d239-90d5-4f6d-8a1c-edc5fa931cb2'; // Replace with your actual contest ID
const [problems,setProblems] = useState([]);

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
    if (problem && problem.starter_code) {
      const starter_code = problem.starter_code[language] || '';
      setCode(starter_code);
      setTestResults([]);
      setOutput('');
      setErrors([]);
    }
  }, [currentProblem, language, problem]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setErrors([]);

    try {
      const currentLang = languages.find((l) => l.value === language);

      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: currentLang.pistonLang,
          version: currentLang.version,
          files: [{ name: getFileName(language), content: code }],
          stdin: problem.sample_input
        })
      });

      const result = await response.json();

      if (result.compile && result.compile.stderr) {
        setErrors((prev) => [...prev, result.compile.stderr]);
      }

      if (result.run) {
        if (result.run.stdout) {
          setOutput(result.run.stdout);
        }
        if (result.run.stderr) {
          setErrors((prev) => [...prev, result.run.stderr]);
        }
      }
    } catch (error) {
      setErrors(['Network error: ' + error.message]);
    } finally {
      setIsRunning(false);
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    const results = [];
    setErrors([]);

    try {
      if (!problem || !problem.test_cases || problem.test_cases.length === 0) {
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

      for (const testCase of problem.test_cases) {
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: currentLang.pistonLang,
            version: currentLang.version,
            files: [{ name: getFileName(language), content: code }],
            stdin: testCase.input
          })
        });

        const result = await response.json();

        const runOutput = result.run?.stdout?.trim() || '';
        const compileError = result.compile?.stderr || '';
        const runtimeError = result.run?.stderr || '';

        if (compileError) {
          setErrors((prev) => [...prev, compileError]);
        }
        if (runtimeError) {
          setErrors((prev) => [...prev, runtimeError]);
        }

        const passed = runOutput === testCase.expected_output;
        results.push({
          passed,
          expected: testCase.expected_output,
          actual: runOutput,
          explanation: testCase.explanation
        });
      }
    } catch (error) {
      console.error('runTests error:', error);
      setErrors(['Test execution failed: ' + error.message]);
    }

    setTestResults(results);
    setIsRunning(false);
    setOutputTab('testcase');
  };

  const getFileName = (lang) => {
    const files = { javascript: 'main.js', python: 'main.py', java: 'Main.java', cpp: 'main.cpp' };
    return files[lang] || 'main.txt';
  };

  return (
   
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      
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
        />
        
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div
          ref={leftPanel.containerRef}
          className="bg-white border-r flex flex-col"
          style={{ width: `${leftPanel.width}%` }}
        >
          <div className="flex border-b flex-shrink-0">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2 border-b-2 ${
                activeTab === 'description'
                  ? 'border-blue-500 text-blue-600 bg-gray-50'
                  : 'border-transparent'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-4 py-2 border-b-2 ${
                activeTab === 'schema'
                  ? 'border-blue-500 text-blue-600 bg-gray-50'
                  : 'border-transparent'
              }`}
            >
              DB Schema
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'description' && <ProblemDescription problem={problem} />}
            {activeTab === 'schema' && <DatabaseSchemaView problem={problem} />}
          </div>
        </div>

        {/* Vertical Drag Handle */}
        <VerticalDragHandle
          onMouseDown={leftPanel.startResize}
          isResizing={leftPanel.isResizing}
        />

        {/* Right Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor with dynamic height */}
          <div
            style={{ height: `calc(100% - ${outputPanel.height}px)` }}
            className="overflow-hidden"
          >
            <CodeEditor code={code} onChange={setCode} language={language} />
          </div>

          {/* Horizontal Drag Handle */}
          <HorizontalDragHandle
            onMouseDown={outputPanel.startResize}
            isResizing={outputPanel.isResizing}
          />

          {/* Output Panel - Fixed: Added height prop */}
          <div style={{ height: `${outputPanel.height}px` }}>
            <OutputPanel
              activeTab={outputTab}
              setActiveTab={setOutputTab}
              testResults={testResults}
              isRunning={isRunning}
              output={output}
              errors={errors}
              height={outputPanel.height}
            />
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default CodingPlatform;