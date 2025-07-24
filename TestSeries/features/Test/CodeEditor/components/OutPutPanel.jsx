import React from 'react';
import { Check, X } from 'lucide-react';
import { useTheme } from '../../../../hooks/useTheme';

const OutputPanel = ({
  activeTab,
  setActiveTab,
  testResults = [],
  isRunning,
  output,
  errors = [],
  height,
  testInput,
  showTestResults,
  toggleTestResults,
}) => {
  const { theme } = useTheme();
  const passedTests = testResults.passedCount
  const failedTests = testResults.total - passedTests;

  // Theme-aware classes
  const containerClass = theme === 'light'
    ? 'bg-gray-50 border-t'
    : 'bg-gray-900 border-t border-gray-700';

  const tabContainerClass = theme === 'light'
    ? 'flex border-b border-gray-200 flex-shrink-0'
    : 'flex border-b border-gray-700 flex-shrink-0';

  const activeTabClass = theme === 'light'
    ? 'border-blue-500 text-blue-600 bg-white'
    : 'border-blue-400 text-blue-400 bg-gray-800';

  const inactiveTabClass = theme === 'light'
    ? 'border-transparent text-gray-600 hover:text-gray-800'
    : 'border-transparent text-gray-400 hover:text-gray-200';

  const contentClass = theme === 'light'
    ? 'flex-1 p-4 overflow-y-auto bg-white'
    : 'flex-1 p-4 overflow-y-auto bg-gray-900';

  const headingClass = theme === 'light'
    ? 'font-semibold mb-3 text-gray-900'
    : 'font-semibold mb-3 text-gray-100';

  const labelClass = theme === 'light'
    ? 'text-gray-500 text-sm'
    : 'text-gray-400 text-sm';

  const inputClass = theme === 'light'
    ? 'border border-gray-300 rounded p-2 w-full bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
    : 'border border-gray-600 rounded p-2 w-full bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400';

  const runningTextClass = theme === 'light'
    ? 'text-blue-600'
    : 'text-blue-400';

  const noResultsClass = theme === 'light'
    ? 'text-gray-500'
    : 'text-gray-400';

  const passedTestClass = theme === 'light'
    ? 'bg-green-100 text-green-700'
    : 'bg-green-900/50 text-green-400 border border-green-800';

  const failedTestClass = theme === 'light'
    ? 'bg-red-100 text-red-700'
    : 'bg-red-900/50 text-red-400 border border-red-800';

  const errorContainerClass = theme === 'light'
    ? 'bg-red-50 border border-red-200 rounded p-2'
    : 'bg-red-900/20 border border-red-800 rounded p-2';

  const errorTextClass = theme === 'light'
    ? 'text-sm text-red-700 whitespace-pre-wrap break-words'
    : 'text-sm text-red-400 whitespace-pre-wrap break-words';

  const outputContainerClass = theme === 'light'
    ? 'bg-gray-100 border border-gray-300 rounded p-2 min-h-20'
    : 'bg-gray-800 border border-gray-600 rounded p-2 min-h-20';

  const outputTextClass = theme === 'light'
    ? 'text-sm whitespace-pre-wrap break-words text-gray-900'
    : 'text-sm whitespace-pre-wrap break-words text-gray-100';

  const placeholderTextClass = theme === 'light'
    ? 'text-gray-500'
    : 'text-gray-400';

  return (
    <div className={`${containerClass} flex flex-col -mt-1`} style={{ height: `${height}px` }}>
      {/* Tabs */}
      <div className={tabContainerClass}>
        <button
          onClick={() => setActiveTab('testcase')}
          className={`relative px-4 py-2 border-b-2 transition-colors duration-200 ${activeTab === 'testcase' ? activeTabClass : inactiveTabClass
            }`}
        >
          Test Results
        </button>

        <button
          onClick={() => setActiveTab('output')}
          className={`relative px-4 py-2 border-b-2 transition-colors duration-200 ${activeTab === 'output' ? activeTabClass : inactiveTabClass
            }`}
        >
          Output
          {errors.length > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {errors.length}
            </span>
          )}
        </button>
        <button
          onClick={toggleTestResults}
          className="ml-2 text-sm text-gray-500 hover:text-gray-700 transition-transform"
        >
          <span className={`inline-block transform transition-transform duration-200 ${showTestResults ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Content - Fixed: Made this scrollable */}
      <div className={contentClass}>
        {activeTab === 'testcase'  && showTestResults && (
          <div>
            <h3 className={headingClass}>Test Results</h3>



            <div className="mb-3">
              <span className={labelClass}>
                Output:
              </span>
              {testResults.length > 0 ? (
                <div className="flex space-x-4 mb-3 text-xs font-medium">
                  <div className={theme === 'light' ? 'text-green-600' : 'text-green-400'}>
                    Passed: {passedTests}
                  </div>
                  <div className={theme === 'light' ? 'text-red-600' : 'text-red-400'}>
                    Failed: {failedTests}
                  </div>
                  <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                    Total: {testResults.total}
                  </div>
                </div>
              )
                : (
                  <span className={placeholderTextClass}>
                    No test results available.
                  </span>
                )}

              {isRunning ? (
                <div className={runningTextClass}>
                  <div>Using sample test case as default input.</div>
                  Running tests...
                </div>
              ) : testResults.length === 0 ? (
                <div className={noResultsClass}>No test results yet</div>
              ) : (
                <div className="space-y-2">
                  {testResults.results?.map((result, i) => (
                    <div
                      key={i}
                      className={`flex items-start p-2 rounded transition-colors duration-200 ${result?.passed ? passedTestClass : failedTestClass
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
                          <div className={`text-xs mt-1 break-words ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                            {result.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'output' && (
          <div>
            {console.log("🎀🎀🎀🎀11,", testInput)}
            <h3 className={headingClass}>Console Output</h3>
            {errors.length > 0 && (
              <div className="mb-4">
                <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
                  Errors:
                </h4>
                <div className={errorContainerClass}>
                  <pre className={errorTextClass}>
                    {errors.join('\n')}
                  </pre>
                </div>
              </div>
            )}
            <div className={outputContainerClass}>
              <pre className={outputTextClass}>
                {output ? (
                  <>
                    {console.log("🎀🎀🎀🎀22,", output)}

                    {testInput.length === output.length
                      ? testInput?.map((input, index) => (
                        <div key={index} className="mb-4">
                          <div className="mb-2">
                            <span className={labelClass}>Input:</span>
                            <div className={inputClass}>
                              {JSON.stringify(input)}
                            </div>
                          </div>
                          <div className="mb-2">
                            <span className={labelClass}>Output:</span>
                            <div className={outputTextClass}>
                              {typeof output === 'string' ? output : JSON.stringify(output[index])}

                            </div>
                          </div>
                        </div>
                      ))
                      : testInput?.map((input, index) => {
                        let rawValue = input;
                        let cleaned = '';
                        if (typeof rawValue === 'object') {
                          cleaned = JSON.stringify(rawValue);
                        } else if (typeof rawValue === 'string') {
                          cleaned = rawValue;
                        } else {
                          cleaned = JSON.parse(rawValue);
                        }
                        return (
                          <div key={index} className="mb-4">
                            <div className="mb-2">
                              <span className={labelClass}>Input:</span>
                              <div className={inputClass}>
                                {cleaned}
                              </div>
                            </div>
                            <div className="mb-2">
                              <span className={labelClass}>Output:</span>
                              <div className={outputTextClass}>
                                {typeof output === 'string' ? output : JSON.stringify(output[index])}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </>

                ) : (
                  <span className={placeholderTextClass}>
                    No output yet. Run your code to see results.
                  </span>
                )}

              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;