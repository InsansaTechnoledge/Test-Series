import React, { useEffect, useState } from 'react';
import { problems } from './Data/Problems';
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

  // Resizable hooks
  const leftPanel = useResizable(50, 20, 80);
  const outputPanel = useVerticalResizable(200, 100, 500);

  const problem = problems[currentProblem];

  useEffect(() => {
    if (problem && problem.starterCode) {
      const starterCode = problem.starterCode[language] || '';
      setCode(starterCode);
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
      <div className="border-b bg-white p-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentProblem(Math.max(0, currentProblem - 1))}
            disabled={currentProblem === 0}
            className="p-2 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-medium">
            Problem {currentProblem + 1} of {problems.length}
          </span>

          <button
            onClick={() => setCurrentProblem(Math.min(problems.length - 1, currentProblem + 1))}
            disabled={currentProblem === problems.length - 1}
            className="p-2 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>

          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Test
          </button>
        </div>
      </div>

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