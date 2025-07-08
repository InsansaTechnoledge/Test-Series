import React from 'react';
import { Code, Play, Send } from 'lucide-react';
import { languages } from '../CodeEditor/Data/Language';
import CodeEditor from '../CodeEditor/components/CodeEditor';
import HorizontalDragHandle from '../CodeEditor/components/HorizontalDragHandle';
import OutputPanel from '../CodeEditor/components/OutPutPanel';
import { useResizable } from '../CodeEditor/hooks/useResizable';
import { useVerticalResizable } from '../CodeEditor/hooks/useVerticleResizable';
import ProblemDescription from '../CodeEditor/components/ProblemDescription';
import { useState } from 'react';
import { useEffect } from 'react';
import { runContestCode, runContestTestCases } from '../../../utils/services/contestQuestionService';

const CodeQuestion = ({ selectedQuestion, option, setOption }) => {
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [outputTab, setOutputTab] = useState('testcase');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState([]);

  const leftPanel = useResizable(50, 20, 80);
  const outputPanel = useVerticalResizable(200, 100, 500);
  console.log("Selected Question:", selectedQuestion);

  useEffect(() => {
    if (selectedQuestion && selectedQuestion.starter_code) {
      const starter_code = selectedQuestion.starter_code[language] || '';
      setCode(starter_code);
      setTestResults([]);
      setOutput('');
      setErrors([]);
    }
  }, [language, selectedQuestion]);


  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setErrors([]);

    try {
      if (!selectedQuestion || !selectedQuestion.starter_code) {
        setErrors(["No starter code available for this question."]);
        setIsRunning(false);
        return;
      }

      const currentLang = languages.find(lang => lang.value === language);

      if (!currentLang) {
        setErrors(["Invalid programming language selected."]);
        setIsRunning(false);
        return;
      }

      const response = await runContestCode(code,selectedQuestion, currentLang);
      if (response.status !== 200) {
        setErrors([response.statusText || "Failed to run code"]);
        setIsRunning(false);
        return;
      }

      const result = response.data;
      if(!result) {
        setErrors(["No output received from the server."]);
        setIsRunning(false);
        return;
      }

      if (result.compile && result.compile.stderr) {
        setErrors((prev) => [...prev, result.compile.stderr]);
      }
      if (result.run && result.run.stdout) {
        setOutput(result.run.stdout.trim());
      } else if (result.run && result.run.stderr) {
        setErrors((prev) => [...prev, result.run.stderr]);
      }
    }
    catch (error) {
      setErrors(['Network error: ' + error.message]);
    } finally {
      setIsRunning(false);
    }
  };

  const runTests =async  () => {
    setIsRunning(true);
    let results = [];
    setErrors([]);

    try{
      if (!selectedQuestion || !selectedQuestion.test_cases || selectedQuestion.test_cases.length === 0) {
       setErrors(["No test cases available for this question."]);
        setIsRunning(false);
        return;
      }
      const cureentlang=languages.find(lang => lang.value === language);

      if (!cureentlang) {
        setErrors(["Invalid programming language selected."]);
        setIsRunning(false);
        return;
      }

      const response=await runContestTestCases(code,problem,cureentlang);
      if( response.status === 200) {
        results = response.data.results;
        setErrors(response.data.errors || []);
      }
  
    }catch (error) {
      console.error("Error running tests:", error);
      setErrors([error.message]);
    }

    setTestResults(results);
    setIsRunning(false);
    setOutputTab('testcase');
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
    <div className="border-b bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-sm">
  <div className="p-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
    <div className="text-lg font-semibold">Question</div>

    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
      {/* Language Selector */}
      <div className="flex items-center space-x-2">
        <Code className="w-4 h-4 text-blue-600" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-blue-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Run Code Button */}
    <button
  onClick={runCode}
  disabled={isRunning}
  className="bg-green-600 text-white px-2 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 md:space-x-2 shadow-md transition"
>
  <Play className="w-4 h-4" />
  <span className="font-medium whitespace-nowrap">
    {isRunning ? 'Checking' : 'Run Code'}
  </span>
</button>

<button
  onClick={runTests}
  disabled={isRunning}
  className="bg-blue-600 text-white px-2 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 md:space-x-2 shadow-md transition"
>
  <Send className="w-4 h-4" />
  <span className="font-medium whitespace-nowrap">
    {isRunning ? 'Testing' : 'Run Test Cases'}
  </span>
</button>

    </div>
  </div>
</div>


      {/* Main Panels - Column layout */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Description */}
        <div className="bg-white border-b flex-shrink-0 max-h-[250px] overflow-y-auto">
          <div className="flex border-b bg-gray-50">
            <label className="px-4 py-2 border-b-2 border-blue-500 text-blue-600">
              Description
            </label>
          </div>
          <ProblemDescription problem={selectedQuestion} />
        </div>

        {/* Code Editor */}
        <div
          className="flex-1 overflow-hidden"
          style={{ height: `calc(100% - ${outputPanel.height}px)` }}
        >
          <CodeEditor code={code} onChange={setCode} language={language} />
        </div>

        {/* Horizontal Drag Handle */}
        <HorizontalDragHandle
          onMouseDown={outputPanel.startResize}
          isResizing={outputPanel.isResizing}
        />

        {/* Output Panel */}
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
  );
};

export default CodeQuestion;
