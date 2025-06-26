import React, { useState } from 'react';
import { useTheme } from '../../../../../hooks/useTheme';

const QuestionPreview = ({ questions, setQuestions, examDetails }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const {theme} = useTheme()

  // Filter questions based on search term and type
  const filteredQuestions = questions.filter(q => {
    const text = q.question_text || '';
    const subject = q.subject || '';
    const chapter = q.chapter || '';

    const matchesSearch =
      text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || q.type === filterType;

    return matchesSearch && matchesType;
  });


  // Get the question type as a readable string
  const getQuestionTypeLabel = (type) => {
    const types = {
      'mcq': 'Multiple Choice',
      'msq': 'Multiple Select',
      'fill': 'Fill in the Blank',
      'tf': 'True/False',
      'numerical': 'Numerical',
      'code': 'Coding',
      'match': 'match the following',
      'comprehension': 'comprehension'
    };
    return types[type] || type.toUpperCase();
  };

  // Get the difficulty badge class
  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Toggle expanded state for a question
  const toggleExpand = (id) => {
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(id);
    }
  };

  // Delete a question (placeholder function)
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this question?")) {
      // Filter out the question with the given id
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };
  const inputCommon = `p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${
    theme === 'light'
      ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
      : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
  }`;
const LabelCommon =`text-lg font-bold ${
  theme === 'light' ? 'text-gray-700' : 'text-indigo-200'
}`
  const totalMarks = filteredQuestions.reduce((sum, q) => sum + (Number(q.positive_marks) || 0), 0);
  const examTotalMarks = Number(examDetails?.total_marks) || 0;
  const percentage = examTotalMarks > 0 ? ((totalMarks / examTotalMarks) * 100).toFixed(2) : 'N/A';


  return (
    <>
  
 
<div className="mt-6 border-t pt-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
    <div>

      <h2   className={`font-semibold text-xl  ${theme == 'light' ?"text-gray-900" : "text-gray-300"} `}>Questions ({filteredQuestions.length})</h2>
      <div className="text-sm text-gray-600 space-x-4 mt-1">
        <span className={`  ${theme == 'light' ?"text-gray-900" : "text-gray-300"} `}>Total Marks: <strong>{totalMarks}</strong></span>
        <span className={`  ${theme == 'light' ?"text-gray-900" : "text-gray-300"} `}>Out of: <strong>{examTotalMarks}</strong></span>
        <span className={`percentage > 100 ? "text-red-600" : "text-gray-800"   ${theme == 'light' ?"text-gray-900" : "text-gray-300"} `}>
          Coverage: <strong className='text-green-600'>{percentage}%</strong>
        </span>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
      <select
        className={inputCommon}
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="mcq">Multiple Choice</option>
        <option value="msq">Multiple Select</option>
        <option value="fill">Fill in the Blank</option>
        <option value="tf">True/False</option>
        <option value="numerical">Numerical</option>
        <option value="match">Match</option>
        <option value="comprehension">Comprehension</option>
        <option value="code">Coding</option>
      </select>

      <input
        type="text"
        placeholder="Search questions..."
        className={inputCommon}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </div>

 











{questions.length > 0 ? (
    <div className="space-y-4">
      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((q, index) => (
          <div
            key={q.id}
            className={`rounded-xl border shadow-sm hover:shadow-md transition duration-200 overflow-hidden ${
              theme == 'light' 
                ? "border-gray-200 bg-white" 
                : "border-gray-600 bg-gray-800"
            }`}
          >
            <div
              className={`p-4 border-b flex justify-between items-center cursor-pointer ${
                theme == 'light' 
                  ? "border-gray-200 bg-white" 
                  : "border-gray-600 bg-gray-700"
              }`}
              onClick={() => toggleExpand(q.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`font-medium ${
                    theme == 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>#{index + 1}</span>
                  <span className={`px-2 py-0.5 rounded text-xs uppercase font-medium ${
                    theme == 'light' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'bg-indigo-900 text-indigo-300'
                  }`}>
                    {getQuestionTypeLabel(q.type)}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs uppercase font-medium ${getDifficultyBadgeClass(q.difficulty)}`}>
                    {q.difficulty}
                  </span>
                  <span className={`text-sm ${
                    theme == 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    +{q.positive_marks} {q.negative_marks > 0 ? `/ -${q.negative_marks}` : ''} mark{q.positive_marks !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className={`mt-2 font-medium line-clamp-1 ${
                  theme == 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  {q.question_text}
                </div>
                {q.subject && (
                  <div className={`mt-1 text-sm ${
                    theme == 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {q.subject} {q.chapter ? `• ${q.chapter}` : ''}
                  </div>
                )}
              </div>
              <button className={`transition-colors duration-200 ${
                theme == 'light' 
                  ? 'text-indigo-600 hover:text-indigo-800' 
                  : 'text-indigo-400 hover:text-indigo-300'
              }`}>
                {expandedQuestion === q.id ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>

            {expandedQuestion === q.id && (
              <div className={`p-4 ${
                theme == 'light' ? 'bg-white' : 'bg-gray-800'
              }`}>
                <div className="mb-4">
                  <h3 className={`font-medium mb-2 ${
                    theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>Question:</h3>
                  <div className={`pl-2 border-l-4 py-1 ${
                    theme == 'light' 
                      ? 'border-gray-200 text-gray-800' 
                      : 'border-gray-600 text-gray-200'
                  }`}>
                    {q.question_text}
                  </div>
                </div>

                {/* Show options for MCQ and MSQ */}
                {(q.type === 'mcq' || q.type === 'msq') && q.options && q.options.length > 0 && (
                  <div className="mb-4">
                    <h3 className={`font-medium mb-2 ${
                      theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>Options:</h3>
                    <div className="space-y-2 pl-2">
                      {q.options.map((option, i) => (
                        <div
                          key={i}
                          className={`flex items-center p-2 rounded ${
                            q.type === 'mcq'
                              ? (q.correct_option === i ? (
                                  theme == 'light' 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-green-900 border border-green-600'
                                ) : (
                                  theme == 'light' ? '' : 'bg-gray-700'
                                ))
                              : (q.correct_options && q.correct_options.includes(i) ? (
                                  theme == 'light' 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-green-900 border border-green-600'
                                ) : (
                                  theme == 'light' ? '' : 'bg-gray-700'
                                ))
                          }`}
                        >
                          <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 flex-shrink-0 ${
                            theme == 'light' 
                              ? 'bg-gray-200 text-gray-700' 
                              : 'bg-gray-600 text-gray-300'
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div className={theme == 'light' ? 'text-gray-800' : 'text-gray-200'}>
                            {option}
                          </div>
                          {q.type === 'mcq' && q.correct_option === i && (
                            <div className={`ml-auto font-medium text-sm ${
                              theme == 'light' ? 'text-green-600' : 'text-green-400'
                            }`}>Correct</div>
                          )}
                          {q.type === 'msq' && q.correct_options && q.correct_options.includes(i) && (
                            <div className={`ml-auto font-medium text-sm ${
                              theme == 'light' ? 'text-green-600' : 'text-green-400'
                            }`}>Correct</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show correct answer for fill-in-the-blank and numerical */}
                {(q.type === 'fill' || q.type === 'numerical') && (
                  <div className="mb-4">
                    <h3 className={`font-medium mb-2 ${
                      theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>Correct Answer:</h3>
                    <div className={`pl-2 border-l-4 py-1 ${
                      theme == 'light' 
                        ? 'border-green-300 text-gray-800' 
                        : 'border-green-600 text-gray-200'
                    }`}>
                      {q.correct_answer}
                    </div>
                  </div>
                )}

                {/* Show true/false answer */}
                {q.type === 'tf' && (
                  <div className="mb-4">
                    <h3 className={`font-medium mb-2 ${
                      theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>Correct Answer:</h3>
                    <div className={`pl-2 border-l-4 py-1 ${
                      theme == 'light' 
                        ? 'border-green-300 text-gray-800' 
                        : 'border-green-600 text-gray-200'
                    }`}>
                      {q.is_true ? 'True' : 'False'}
                    </div>
                  </div>
                )}

                {/* Show code snippet if available */}
                {q.type === 'code' && (
                  <div className={`space-y-4 border rounded-lg p-6 shadow-sm ${
                    theme == 'light' 
                      ? 'bg-white border-blue-200' 
                      : 'bg-gray-700 border-blue-600'
                  }`}>
                    <h2 className={`text-2xl font-semibold ${
                      theme == 'light' ? 'text-blue-800' : 'text-blue-300'
                    }`}>{q.title}</h2>

                    <div className={theme == 'light' ? 'text-gray-600' : 'text-gray-300'}>
                      <span className="font-medium">Difficulty:</span> {q.difficulty}
                    </div>

                    <div>
                      <h3 className={`font-semibold mb-1 ${
                        theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>Prompt:</h3>
                      <p className={`whitespace-pre-wrap ${
                        theme == 'light' ? 'text-gray-800' : 'text-gray-200'
                      }`}>{q.prompt}</p>
                    </div>

                    {q.description && (
                      <div>
                        <h3 className={`font-semibold mb-1 ${
                          theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>Short Description:</h3>
                        <p className={theme == 'light' ? 'text-gray-800' : 'text-gray-200'}>
                          {q.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium ${
                          theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>Input Format</h4>
                        <p className={`whitespace-pre-wrap ${
                          theme == 'light' ? 'text-gray-800' : 'text-gray-200'
                        }`}>{q.input_format}</p>
                      </div>
                      <div>
                        <h4 className={`font-medium ${
                          theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>Output Format</h4>
                        <p className={`whitespace-pre-wrap ${
                          theme == 'light' ? 'text-gray-800' : 'text-gray-200'
                        }`}>{q.output_format}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium ${
                          theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>Sample Input</h4>
                        <pre className={`p-3 rounded text-sm ${
                          theme == 'light' 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-gray-800 text-gray-200'
                        }`}>{q.sample_input}</pre>
                      </div>
                      <div>
                        <h4 className={`font-medium ${
                          theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>Sample Output</h4>
                        <pre className={`p-3 rounded text-sm ${
                          theme == 'light' 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-gray-800 text-gray-200'
                        }`}>{q.sample_output}</pre>
                      </div>
                    </div>

                    {q.constraints?.length > 0 && (
                      <div>
                        <h4 className={`font-medium ${
                          theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>Constraints</h4>
                        <ul className={`list-disc pl-5 ${
                          theme == 'light' ? 'text-gray-800' : 'text-gray-200'
                        }`}>
                          {q.constraints.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {q.examples?.length > 0 && (
                      <div>
                        <h4 className={`font-medium ${
                          theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>Examples</h4>
                        {q.examples.map((ex, i) => (
                          <div key={i} className={`border rounded p-3 mb-2 ${
                            theme == 'light' 
                              ? 'border-blue-100 bg-blue-50 text-gray-800' 
                              : 'border-blue-700 bg-blue-900 text-gray-200'
                          }`}>
                            <p><strong>Input:</strong> {ex.input}</p>
                            <p><strong>Output:</strong> {ex.output}</p>
                            {ex.explanation && <p><strong>Explanation:</strong> {ex.explanation}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {q.test_cases?.length > 0 && (
                      <div>
                        <h4 className={`font-medium ${
                          theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>Test Cases</h4>
                        {q.test_cases.map((tc, i) => (
                          <div key={i} className={`border rounded p-3 mb-2 text-sm ${
                            theme == 'light' 
                              ? 'border-gray-200 bg-gray-50 text-gray-800' 
                              : 'border-gray-600 bg-gray-700 text-gray-200'
                          }`}>
                            <p><strong>Input:</strong> {tc.input}</p>
                            <p><strong>Expected Output:</strong> {tc.expected_output}</p>
                            {tc.explanation && <p><strong>Explanation:</strong> {tc.explanation}</p>}
                            {tc.passed_percentage !== undefined && (
                              <p><strong>Passed %:</strong> {tc.passed_percentage}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <h4 className={`font-medium mb-2 ${
                        theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>Starter Code</h4>
                      <div className="space-y-3">
                        {Object.entries(q.starter_code || {}).map(([lang, code]) => (
                          code && (
                            <div key={lang}>
                              <p className={`text-sm font-semibold capitalize ${
                                theme == 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {lang === 'cpp' ? 'C++' : lang}
                              </p>
                              <pre className={`p-3 rounded overflow-x-auto text-xs ${
                                theme == 'light' 
                                  ? 'bg-gray-100 text-gray-800' 
                                  : 'bg-gray-800 text-gray-200'
                              }`}>{code}</pre>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Show match the following pairs */}
                {q.type === 'match' && (
                  <div className="mb-4">
                    <h3 className={`font-medium mb-2 ${
                      theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>Matching Pairs:</h3>
                    <div className={`grid grid-cols-2 gap-4 p-3 rounded border ${
                      theme == 'light' 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-gray-700 border-gray-600'
                    }`}>
                      <div>
                        <h4 className={`font-semibold text-sm mb-2 ${
                          theme == 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>Left Items</h4>
                        {q.left_items?.map((item, i) => (
                          <div key={i} className={`py-1 ${
                            theme == 'light' ? 'text-gray-800' : 'text-gray-200'
                          }`}>{`${i + 1}. ${item}`}</div>
                        ))}
                      </div>
                      <div>
                        <h4 className={`font-semibold text-sm mb-2 ${
                          theme == 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>Right Items</h4>
                        {q.right_items?.map((item, i) => (
                          <div key={i} className={`py-1 ${
                            theme == 'light' ? 'text-gray-800' : 'text-gray-200'
                          }`}>{`${String.fromCharCode(65 + i)}. ${item}`}</div>
                        ))}
                      </div>
                    </div>

                    {q.correct_pairs && typeof q.correct_pairs === 'object' ? (
                      <div className="mt-4">
                        <h4 className={`font-semibold text-sm mb-1 ${
                          theme == 'light' ? 'text-green-700' : 'text-green-400'
                        }`}>Correct Pairs:</h4>
                        <div className={`text-sm p-2 rounded space-y-1 ${
                          theme == 'light' 
                            ? 'bg-green-50 border border-green-200 text-gray-800' 
                            : 'bg-green-900 border border-green-600 text-gray-200'
                        }`}>
                          {Object.entries(q.correct_pairs).map(([leftVal, rightVal], i) => (
                            <div key={i}>
                              <span className="font-medium">{leftVal}</span> → 
                              <span className={`font-semibold ml-1 ${
                                theme == 'light' ? 'text-green-700' : 'text-green-400'
                              }`}>{rightVal}</span>
                            </div>
                          ))}
                          <p className={`text-xs italic mt-1 ${
                            theme == 'light' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            Note: Right items will be shown in random order during the test.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-red-500 mt-2">❌ Correct pairs data missing or invalid</div>
                    )}
                  </div>
                )}

                {q.type === 'comprehension' && (
                  <div className="mb-4">
                    <h3 className={`font-medium mb-2 ${
                      theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>Comprehension Passage:</h3>
                    <div className={`pl-2 border-l-4 py-2 whitespace-pre-line ${
                      theme == 'light' 
                        ? 'border-gray-200 text-gray-800' 
                        : 'border-gray-600 text-gray-200'
                    }`}>
                      {q.passage || '❌ No passage found'}
                    </div>

                    {Array.isArray(q.sub_question_ids) && q.sub_question_ids.length > 0 ? (
                      <div className="mt-4 space-y-4">
                        <h4 className={`font-semibold text-sm ${
                          theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>Sub-Questions:</h4>

                        {q.sub_question_ids.map((sub, subIndex) => (
                          <div key={sub.id} className={`p-3 rounded border space-y-2 ${
                            theme == 'light' 
                              ? 'bg-gray-50 border-gray-200' 
                              : 'bg-gray-700 border-gray-600'
                          }`}>
                            <div className="text-sm font-medium">
                              <span className={theme == 'light' ? 'text-gray-800' : 'text-gray-200'}>
                                {subIndex + 1}. {sub.question_text || '❌ No question text'}
                              </span>
                              <span className={`ml-2 text-xs ${
                                theme == 'light' ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                (+{Number(sub.positive_marks) || 0}
                                {sub.negative_marks > 0 ? ` / -${sub.negative_marks}` : ''})
                              </span>
                            </div>

                            {/* Options for MCQ / MSQ */}
                            {(sub.type === 'mcq' || sub.type === 'msq') && Array.isArray(sub.options) && (
                              <ul className="ml-4 list-disc text-sm">
                                {sub.options.map((opt, i) => (
                                  <li
                                    key={i}
                                    className={
                                      (sub.type === 'mcq' && sub.correct_option === i) ||
                                      (sub.type === 'msq' && sub.correct_options?.includes(i))
                                        ? (theme == 'light' ? 'text-green-700 font-semibold' : 'text-green-400 font-semibold')
                                        : (theme == 'light' ? 'text-gray-800' : 'text-gray-200')
                                    }
                                  >
                                    {String.fromCharCode(65 + i)}. {opt}
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Fill / Numerical */}
                            {(sub.type === 'fill' || sub.type === 'numerical') && (
                              <div className={`text-sm ${
                                theme == 'light' ? 'text-green-700' : 'text-green-400'
                              }`}>
                                Answer: {sub.correct_answer}
                              </div>
                            )}

                            {/* True / False */}
                            {sub.type === 'tf' && (
                              <div className={`text-sm ${
                                theme == 'light' ? 'text-green-700' : 'text-green-400'
                              }`}>
                                Answer: {sub.is_true ? 'True' : 'False'}
                              </div>
                            )}

                            {/* Explanation if available */}
                            {sub.explanation && (
                              <div className={`text-xs ${
                                theme == 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                Explanation: {sub.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-red-600 mt-2 text-sm">❗ No sub-questions found or improperly formatted.</div>
                    )}
                  </div>
                )}

                {/* Show explanation if available */}
                {q.explanation && (
                  <div className="mb-4">
                    <h3 className={`font-medium mb-2 ${
                      theme == 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>Explanation:</h3>
                    <div className={`pl-2 border-l-4 py-1 ${
                      theme == 'light' 
                        ? 'border-blue-200 text-gray-600' 
                        : 'border-blue-600 text-gray-400'
                    }`}>
                      {q.explanation}
                    </div>
                  </div>
                )}

                <div className={`flex justify-end mt-4 pt-4 border-t ${
                  theme == 'light' ? 'border-gray-200' : 'border-gray-600'
                }`}>
                  <button
                    className={`px-3 py-1 border rounded transition-colors duration-200 ${
                      theme == 'light' 
                        ? 'border-red-300 text-red-600 hover:bg-red-50' 
                        : 'border-red-600 text-red-400 hover:bg-red-900'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(q.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className={`p-6 rounded text-center shadow ${
          theme == 'light' 
            ? 'bg-yellow-50 text-yellow-800' 
            : 'bg-yellow-900 text-yellow-200'
        }`}>
          No matching questions found. Try adjusting your search or filters.
        </div>
      )}
    </div>
  ) : (
    <div className={`p-6 rounded text-center shadow ${
      theme == 'light' 
        ? 'bg-yellow-50 text-yellow-800' 
        : 'bg-yellow-900 text-yellow-200'
    }`}>
      No questions added yet. Add questions manually or upload via Excel.
    </div>
  )}
</div>
</>


  );
};

export default QuestionPreview