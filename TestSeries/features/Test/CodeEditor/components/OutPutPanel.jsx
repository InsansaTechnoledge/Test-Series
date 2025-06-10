import React from 'react';
import { Check, X } from 'lucide-react';

const OutputPanel = ({
  activeTab,
  setActiveTab,
  testResults = [],
  isRunning,
  output,
  errors = [],
  height
}) => {
  const passedTests = testResults.filter((r) => r.passed).length;
  const failedTests = testResults.length - passedTests;

  return (
    <div className="bg-gray-50 border-t flex flex-col" style={{ height: `${height}px` }}>
      {/* Tabs */}
      <div className="flex border-b flex-shrink-0">
        <button
          onClick={() => setActiveTab('testcase')}
          className={`relative px-4 py-2 border-b-2 ${
            activeTab === 'testcase' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent'
          }`}
        >
          Test Results
        </button>

        <button
          onClick={() => setActiveTab('output')}
          className={`relative px-4 py-2 border-b-2 ${
            activeTab === 'output' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent'
          }`}
        >
          Output
          {errors.length > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {errors.length}
            </span>
          )}
        </button>
      </div>

      {/* Content - Fixed: Made this scrollable */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'testcase' && (
          <div>
            <h3 className="font-semibold mb-3">Test Results</h3>

            {testResults.length > 0 && (
              <div className="flex space-x-4 mb-3 text-xs font-medium">
                <div className="text-green-600">Passed: {passedTests}</div>
                <div className="text-red-600">Failed: {failedTests}</div>
                <div className="text-gray-600">Total: {testResults.length}</div>
              </div>
            )}

            {isRunning ? (
              <div className="text-blue-600">Running tests...</div>
            ) : testResults.length === 0 ? (
              <div className="text-gray-500">No test results yet</div>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, i) => (
                  <div
                    key={i}
                    className={`flex items-start p-2 rounded ${
                      result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {result.passed ? (
                      <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div>
                        Test Case {i + 1}: {result.passed ? 'Passed' : 'Failed'}
                      </div>
                      {!result.passed && (
                        <div className="text-xs mt-1">
                          <div className="break-words">Expected: {result.expected}</div>
                          <div className="break-words">Got: {result.actual}</div>
                        </div>
                      )}
                      {result.explanation && (
                        <div className="text-xs mt-1 text-gray-600 break-words">{result.explanation}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'output' && (
          <div>
            <h3 className="font-semibold mb-3">Console Output</h3>
            {errors.length > 0 && (
              <div className="mb-4">
                <h4 className="text-red-600 font-medium mb-2">Errors:</h4>
                <div className="bg-red-50 border border-red-200 rounded p-2">
                  <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
                    {errors.join('\n')}
                  </pre>
                </div>
              </div>
            )}
            <div className="bg-gray-100 border rounded p-2 min-h-20">
              <pre className="text-sm whitespace-pre-wrap break-words">
                {output || 'No output yet. Run your code to see results.'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;