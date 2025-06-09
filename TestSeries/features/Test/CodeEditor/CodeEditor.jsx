import React, { useEffect, useRef, useState } from 'react';
import { Play, Save, Download, Upload, Settings, Code, FileText, CheckCircle, XCircle, AlertCircle, Terminal, TestTube, Bug } from 'lucide-react';

const FullFeaturedCodeEditor = () => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [activeTab, setActiveTab] = useState('output');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const [code, setCode] = useState(`// JavaScript Example - Two Sum Problem
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    
    return [];
}

// Test cases will be run automatically
console.log("Running Two Sum tests...");`);

  const [testCases, setTestCases] = useState([
    { input: 'twoSum([2,7,11,15], 9)', expected: '[0,1]', description: 'Basic case' },
    { input: 'twoSum([3,2,4], 6)', expected: '[1,2]', description: 'Different indices' },
    { input: 'twoSum([3,3], 6)', expected: '[0,1]', description: 'Duplicate numbers' }
  ]);

  const languages = [
    { 
      value: 'javascript', 
      label: 'JavaScript',
      template: `// JavaScript Template
function solve() {
    // Your code here
    return "Hello World";
}

console.log(solve());`,
      runner: 'js'
    },
    { 
      value: 'python', 
      label: 'Python',
      template: `# Python Template
def solve():
    # Your code here
    return "Hello World"

print(solve())`,
      runner: 'python'
    },
    { 
      value: 'java', 
      label: 'Java',
      template: `// Java Template
public class Solution {
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.solve());
    }
    
    public String solve() {
        // Your code here
        return "Hello World";
    }
}`,
      runner: 'java'
    },
    { 
      value: 'cpp', 
      label: 'C++',
      template: `// C++ Template
#include <iostream>
#include <vector>
#include <string>
using namespace std;

string solve() {
    // Your code here
    return "Hello World";
}

int main() {
    cout << solve() << endl;
    return 0;
}`,
      runner: 'cpp'
    }
  ];

  const themes = [
    { value: 'vs', label: 'Light' },
    { value: 'vs-dark', label: 'Dark' },
    { value: 'hc-black', label: 'High Contrast' }
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/loader.min.js';
    script.onload = () => {
      window.require.config({ 
        paths: { 
          'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' 
        } 
      });
      
      window.require(['vs/editor/editor.main'], () => {
        if (containerRef.current) {
          const monacoEditor = window.monaco.editor.create(containerRef.current, {
            value: code,
            language: language,
            theme: theme,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            minimap: { enabled: true },
            wordWrap: 'on',
            contextmenu: true,
            selectOnLineNumbers: true,
            glyphMargin: true,
            folding: true,
            renderLineHighlight: 'all',
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            }
          });

          setEditor(monacoEditor);

          monacoEditor.onDidChangeModelContent(() => {
            setCode(monacoEditor.getValue());
          });

          // Add error markers
          monacoEditor.onDidChangeModelContent(() => {
            validateCode(monacoEditor.getValue());
          });
        }
      });
    };
    document.head.appendChild(script);

    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (editor) {
      window.monaco.editor.setModelLanguage(editor.getModel(), language);
    }
  }, [language, editor]);

  useEffect(() => {
    if (editor) {
      window.monaco.editor.setTheme(theme);
    }
  }, [theme, editor]);

  const validateCode = (code) => {
    const newErrors = [];
    
    if (language === 'javascript') {
      try {
        new Function(code);
      } catch (error) {
        newErrors.push({
          line: error.lineNumber || 1,
          column: error.columnNumber || 1,
          message: error.message,
          severity: 'error'
        });
      }
    }
    
    setErrors(newErrors);
    
    if (editor && window.monaco) {
      const model = editor.getModel();
      const markers = newErrors.map(error => ({
        startLineNumber: error.line,
        startColumn: error.column,
        endLineNumber: error.line,
        endColumn: error.column + 10,
        message: error.message,
        severity: window.monaco.MarkerSeverity.Error
      }));
      
      window.monaco.editor.setModelMarkers(model, 'owner', markers);
    }
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput('');
    setErrors([]);
    setTestResults([]);
    
    try {
      let result = '';
      let logs = [];
      
      if (language === 'javascript') {
        // Capture console output
        const originalLog = console.log;
        const originalError = console.error;
        
        console.log = (...args) => {
          logs.push({ type: 'log', content: args.join(' ') });
          originalLog(...args);
        };
        
        console.error = (...args) => {
          logs.push({ type: 'error', content: args.join(' ') });
          originalError(...args);
        };
        
        try {
          // Execute the code
          eval(code);
          
          // Run test cases if they exist
          if (testCases.length > 0) {
            await runTestCases();
          }
          
        } catch (error) {
          logs.push({ type: 'error', content: `Runtime Error: ${error.message}` });
          setErrors([{
            line: error.lineNumber || 1,
            column: error.columnNumber || 1,
            message: error.message,
            severity: 'error'
          }]);
        }
        
        console.log = originalLog;
        console.error = originalError;
        
        result = logs.map(log => `${log.type === 'error' ? '❌' : '✅'} ${log.content}`).join('\n');
        
      } else {
        // For other languages, simulate execution
        result = `🔄 ${languages.find(l => l.value === language)?.label} execution simulated.\nIn a real environment, this would compile and run your ${language} code.\n\nYour code:\n${code.substring(0, 200)}${code.length > 200 ? '...' : ''}`;
      }
      
      setOutput(result || 'Code executed successfully (no output)');
      
    } catch (error) {
      setOutput(`❌ Execution Error: ${error.message}`);
      setErrors([{
        line: 1,
        column: 1,
        message: error.message,
        severity: 'error'
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const runTestCases = async () => {
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      try {
        const actualResult = eval(testCase.input);
        const actualStr = JSON.stringify(actualResult);
        const expectedStr = testCase.expected;
        
        const passed = actualStr === expectedStr;
        results.push({
          id: i,
          description: testCase.description,
          input: testCase.input,
          expected: expectedStr,
          actual: actualStr,
          passed: passed
        });
      } catch (error) {
        results.push({
          id: i,
          description: testCase.description,
          input: testCase.input,
          expected: testCase.expected,
          actual: `Error: ${error.message}`,
          passed: false
        });
      }
    }
    
    setTestResults(results);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    const template = languages.find(l => l.value === newLanguage)?.template || '';
    setCode(template);
    if (editor) {
      editor.setValue(template);
    }
    
    // Update test cases based on language
    if (newLanguage === 'python') {
      setTestCases([
        { input: 'solve()', expected: '"Hello World"', description: 'Basic function test' }
      ]);
    } else if (newLanguage === 'javascript') {
      setTestCases([
        { input: 'twoSum([2,7,11,15], 9)', expected: '[0,1]', description: 'Basic case' },
        { input: 'twoSum([3,2,4], 6)', expected: '[1,2]', description: 'Different indices' },
        { input: 'twoSum([3,3], 6)', expected: '[0,1]', description: 'Duplicate numbers' }
      ]);
    } else {
      setTestCases([]);
    }
  };

  const addTestCase = () => {
    setTestCases([...testCases, {
      input: '',
      expected: '',
      description: 'New test case'
    }]);
  };

  const updateTestCase = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const removeTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-blue-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Advanced Code Editor</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-blue-900"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>

            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-blue-900"
            >
              {themes.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <button
              onClick={executeCode}
              disabled={isRunning}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                isRunning 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor Side */}
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 bg-white rounded-xl shadow-xl border border-blue-200 overflow-hidden">
            <div 
              ref={containerRef}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 flex flex-col p-4 pl-0">
          {/* Test Cases */}
          <div className="bg-white rounded-xl shadow-xl border border-blue-200 mb-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                <TestTube className="w-5 h-5 mr-2" />
                Test Cases
              </h3>
              <button
                onClick={addTestCase}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Add Test
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {testCases.map((testCase, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <input
                      type="text"
                      value={testCase.description}
                      onChange={(e) => updateTestCase(index, 'description', e.target.value)}
                      className="text-sm font-medium text-gray-700 border-none bg-transparent p-0 flex-1"
                      placeholder="Test description"
                    />
                    <button
                      onClick={() => removeTestCase(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={testCase.input}
                    onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded mb-2 font-mono"
                    placeholder="Input (e.g., solve([1,2,3]))"
                  />
                  <input
                    type="text"
                    value={testCase.expected}
                    onChange={(e) => updateTestCase(index, 'expected', e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded font-mono"
                    placeholder="Expected output"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-xl shadow-xl border border-blue-200 flex-1 flex flex-col">
            <div className="flex border-b border-blue-200">
              <button
                onClick={() => setActiveTab('output')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'output' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Terminal className="w-4 h-4 inline mr-2" />
                Output
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'tests' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Tests ({testResults.filter(r => r.passed).length}/{testResults.length})
              </button>
              <button
                onClick={() => setActiveTab('errors')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'errors' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Bug className="w-4 h-4 inline mr-2" />
                Errors ({errors.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'output' && (
                <div className="p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {output || 'No output yet. Run your code to see results.'}
                  </pre>
                </div>
              )}

              {activeTab === 'tests' && (
                <div className="p-4 space-y-3">
                  {testResults.length === 0 ? (
                    <p className="text-gray-500 text-sm">No test results yet. Run your code to see test outcomes.</p>
                  ) : (
                    testResults.map((result, index) => (
                      <div key={index} className={`border-l-4 p-3 rounded ${
                        result.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                      }`}>
                        <div className="flex items-center mb-2">
                          {result.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 mr-2" />
                          )}
                          <span className="text-sm font-medium">{result.description}</span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div><strong>Input:</strong> {result.input}</div>
                          <div><strong>Expected:</strong> {result.expected}</div>
                          <div><strong>Actual:</strong> {result.actual}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'errors' && (
                <div className="p-4 space-y-3">
                  {errors.length === 0 ? (
                    <p className="text-green-600 text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      No errors found. Your code looks good!
                    </p>
                  ) : (
                    errors.map((error, index) => (
                      <div key={index} className="border-l-4 border-red-500 bg-red-50 p-3 rounded">
                        <div className="flex items-start">
                          <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-red-800">
                              Line {error.line}, Column {error.column}
                            </div>
                            <div className="text-sm text-red-700 mt-1">
                              {error.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullFeaturedCodeEditor;