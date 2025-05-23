import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getResultDetail } from '../../../../../utils/services/resultPage';
import { useSearchParams } from 'react-router-dom';
;

const ResultPage = () => {
    const { examId } = useParams();
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterResult, setFilterResult] = useState('all');

    const [searchParams] = useSearchParams();
    const examName = searchParams.get('name');

    console.log(examName)

    useEffect(() => {
        const fetchResultData = async () => {
            try {
                setLoading(true);
                const data = await getResultDetail(examId);
                console.log(data);
                setResultData(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch result data');
            } finally {
                setLoading(false);
            }
        };

        if (examId) {
            fetchResultData();
        }
    }, [examId]);

    // Transform API data to component format
    const transformQuestions = (questions) => {
        return questions.map(q => ({
            id: q.id,
            question_text: q.question_text || (q.question_type === 'tf' ? q.statement : ''),
            type: q.question_type, 
            difficulty: q.difficulty,
            positive_marks: q.positive_marks,
            negative_marks: q.negative_marks,
            subject: q.subject,
            chapter: q.chapter,
            options: q.options,
            correct_option: q.correct_option,
            correct_options: q.correct_options,
            correct_answer: q.correct_answer,
            is_true: q.is_true,
            explanation: q.explanation,
            left_items: q.left_items,
            right_items: q.right_items,
            correct_pairs: q.correct_pairs,
            passage: q.passage,
            sub_question_ids: q.sub_question_ids
        }));
    };

    

    const transformUserAnswers = (wrongAnswers, questions) => {
        const userAnswers = {};
        
        questions.forEach(q => {
            userAnswers[q.id] = null;
        });

        wrongAnswers.forEach(wrong => {
            userAnswers[wrong.questionId] = wrong.response;
        });

        questions.forEach(q => {
            if (!wrongAnswers.find(w => w.questionId === q.id) && 
                (!resultData.unattempted || !resultData.unattempted.includes(q.id))) {
                // This question was answered correctly, set the correct answer
                if (q.question_type === 'mcq') {
                    userAnswers[q.id] = q.correct_option;
                } else if (q.question_type === 'msq') {
                    userAnswers[q.id] = q.correct_options;
                } else if (q.question_type === 'tf') {
                    userAnswers[q.id] = q.is_true;
                } else if (q.question_type === 'fill' || q.question_type === 'numerical') {
                    userAnswers[q.id] = q.correct_answer;
                }
            }
        });

        return userAnswers;
    };

    // Filter questions based on search term, type, and result
    const getFilteredQuestions = (questions, userAnswers) => {
        return questions.filter(q => {
            const text = q.question_text || '';
            const subject = q.subject || '';
            const chapter = q.chapter || '';
          
            const matchesSearch =
              text.toLowerCase().includes(searchTerm.toLowerCase()) ||
              subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
              chapter.toLowerCase().includes(searchTerm.toLowerCase());
          
            const matchesType = filterType === 'all' || q.type === filterType;
            
            // Check result status
            const userAnswer = userAnswers[q.id];
            let isCorrect = false;
            let isAnswered = false;
            
            if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
                isAnswered = true;
                // Logic to determine if answer is correct based on question type
                if (q.type === 'mcq') {
                    isCorrect = userAnswer === q.correct_option;
                } else if (q.type === 'msq') {
                    isCorrect = JSON.stringify(userAnswer?.sort()) === JSON.stringify(q.correct_options?.sort());
                } else if (q.type === 'tf') {
                    isCorrect = userAnswer === q.is_true;
                } else if (q.type === 'fill' || q.type === 'numerical') {
                    isCorrect = userAnswer?.toString().toLowerCase().trim() === q.correct_answer?.toString().toLowerCase().trim();
                }
            }
            
            const matchesResult = filterResult === 'all' || 
                                (filterResult === 'correct' && isCorrect) ||
                                (filterResult === 'incorrect' && isAnswered && !isCorrect) ||
                                (filterResult === 'unanswered' && !isAnswered);
          
            return matchesSearch && matchesType && matchesResult;
        });
    };
    
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
        'comprehension' : 'comprehension'
      };
      return types[type] || type.toUpperCase();
    };
    
    // Get the difficulty badge class
    const getDifficultyBadgeClass = (difficulty) => {
      switch(difficulty) {
        case 'easy': return 'bg-green-100 text-green-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'hard': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
    
    // Get result status for a question
    const getQuestionResult = (question, userAnswers) => {
        const userAnswer = userAnswers[question.id];
        
        if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
            return { status: 'unanswered', class: 'bg-gray-100 text-gray-800', label: 'Not Answered' };
        }
        
        let isCorrect = false;
        
        if (question.type === 'mcq') {
            isCorrect = userAnswer === question.correct_option;
        } else if (question.type === 'msq') {
            isCorrect = JSON.stringify(userAnswer?.sort()) === JSON.stringify(question.correct_options?.sort());
        } else if (question.type === 'tf') {
            isCorrect = userAnswer === question.is_true;
        } else if (question.type === 'fill' || question.type === 'numerical') {
            isCorrect = userAnswer?.toString().toLowerCase().trim() === question.correct_answer?.toString().toLowerCase().trim();
        }
        
        if (isCorrect) {
            return { status: 'correct', class: 'bg-green-100 text-green-800', label: 'Correct' };
        } else {
            return { status: 'incorrect', class: 'bg-red-100 text-red-800', label: 'Incorrect' };
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading result...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-lg">Error: {error}</div>
            </div>
        );
    }

    if (!resultData || !resultData.questions) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-600 text-lg">No result data found</div>
            </div>
        );
    }

    const questions = transformQuestions(resultData.questions);
    const userAnswers = transformUserAnswers(resultData.wrongAnswers || [], resultData.questions);
    const filteredQuestions = getFilteredQuestions(questions, userAnswers);

    const totalQuestions = questions.length;
    const totalMarks = questions.reduce((sum, q) => sum + (Number(q.positive_marks) || 0), 0);
    const scoredMarks = resultData.marks || 0;
    const percentage = totalMarks > 0 ? ((scoredMarks / totalMarks) * 100).toFixed(2) : 'N/A';

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Exam Result for {examName}</h1>
                <div className="text-sm text-gray-600">
                    <span>Exam ID: {resultData.examId}</span>
                    <span className="mx-2">•</span>
                    <span>Status: {resultData.status}</span>
                    <span className="mx-2">•</span>
                    <span>Date: {new Date(resultData.resultDate).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Exam Results ({filteredQuestions.length} of {totalQuestions} questions)</h2>
                    <div className="text-sm text-gray-700 space-x-4">
                        <span>Scored: <strong className="text-green-600">{scoredMarks}</strong></span>
                        <span>Out of: <strong>{totalMarks}</strong></span>
                        <span>Percentage: <strong className={`${percentage >= 60 ? "text-green-600" : "text-red-600"}`}>{percentage}%</strong></span>
                    </div>
                </div>

                <div className="flex space-x-2 mb-4">
                    <select 
                      className="border rounded px-3 py-1 text-sm"
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
                    
                    <select 
                      className="border rounded px-3 py-1 text-sm"
                      value={filterResult}
                      onChange={(e) => setFilterResult(e.target.value)}
                    >
                      <option value="all">All Results</option>
                      <option value="correct">Correct</option>
                      <option value="incorrect">Incorrect</option>
                      <option value="unanswered">Not Answered</option>
                    </select>
                    
                    <input 
                      type="text"
                      placeholder="Search questions..."
                      className="border rounded px-3 py-1 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="space-y-4">
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((q, index) => {
                        const result = getQuestionResult(q, userAnswers);
                        const userAnswer = userAnswers[q.id];
                        
                        return (
                        <div key={q.id} className="border rounded-lg overflow-hidden bg-white">
                          <div 
                            className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
                            onClick={() => toggleExpand(q.id)}
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-500 font-medium">#{questions.findIndex(question => question.id === q.id) + 1}</span>
                                <span className="px-2 py-0.5 rounded text-xs uppercase font-medium bg-blue-100 text-blue-800">
                                  {getQuestionTypeLabel(q.type)}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs uppercase font-medium ${getDifficultyBadgeClass(q.difficulty)}`}>
                                  {q.difficulty}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs uppercase font-medium ${result.class}`}>
                                  {result.label}
                                </span>
                                <span className="text-gray-500 text-sm">
                                +{q.positive_marks} {q.negative_marks > 0 ? `/ -${q.negative_marks}` : ''} {q.positive_marks === 1 ? 'mark' : 'marks'}
                                </span>
                              </div>
                              <div className="mt-1 font-medium line-clamp-1">
                                {q.question_text}
                              </div>
                              {q.subject && (
                                <div className="mt-1 text-sm text-gray-500">
                                  {q.subject} {q.chapter ? `• ${q.chapter}` : ''}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
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
                          </div>
                          
                          {expandedQuestion === q.id && (
                            <div className="p-4">
                              <div className="mb-4">
                                <h3 className="font-medium text-gray-700 mb-2">Question:</h3>
                                <div className="pl-2 border-l-4 border-gray-200 py-1">
                                  {q.question_text}
                                </div>
                              </div>
                              
                              {/* Show user's answer first */}
                              <div className="mb-4">
                                <h3 className="font-medium text-gray-700 mb-2">Your Answer:</h3>
                                <div className={`pl-2 border-l-4 py-1 ${result.status === 'correct' ? 'border-green-300 bg-green-50' : result.status === 'incorrect' ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
                                  {userAnswer !== undefined && userAnswer !== null && userAnswer !== '' ? (
                                    <>
                                      {q.type === 'mcq' && q.options ? q.options[userAnswer] : ''}
                                      {q.type === 'msq' && q.options && Array.isArray(userAnswer) ? 
                                        userAnswer.map(idx => q.options[idx]).join(', ') : ''}
                                      {q.type === 'tf' ? (userAnswer ? 'True' : 'False') : ''}
                                      {(q.type === 'fill' || q.type === 'numerical') ? userAnswer : ''}
                                    </>
                                  ) : (
                                    <span className="text-gray-500 italic">Not answered</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Show options for MCQ and MSQ with correct answers highlighted */}
                              {(q.type === 'mcq' || q.type === 'msq') && q.options && q.options.length > 0 && (
                                <div className="mb-4">
                                  <h3 className="font-medium text-gray-700 mb-2">Options:</h3>
                                  <div className="space-y-2 pl-2">
                                    {q.options.map((option, i) => {
                                      const isCorrect = q.type === 'mcq' ? q.correct_option === i : q.correct_options?.includes(i);
                                      const isUserAnswer = q.type === 'mcq' ? userAnswer === i : Array.isArray(userAnswer) && userAnswer.includes(i);
                                      
                                      return (
                                        <div 
                                          key={i} 
                                          className={`flex items-center p-2 rounded ${
                                            isCorrect ? 'bg-green-50 border border-green-200' : 
                                            (isUserAnswer && !isCorrect ? 'bg-red-50 border border-red-200' : '')
                                          }`}
                                        >
                                          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 mr-3 flex-shrink-0">
                                            {String.fromCharCode(65 + i)}
                                          </div>
                                          <div className="flex-1">{option}</div>
                                          {isCorrect && (
                                            <div className="ml-auto text-green-600 font-medium text-sm">✓ Correct</div>
                                          )}
                                          {isUserAnswer && !isCorrect && (
                                            <div className="ml-auto text-red-600 font-medium text-sm">✗ Your Choice</div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              {/* Show correct answer for fill-in-the-blank and numerical */}
                              {(q.type === 'fill' || q.type === 'numerical') && (
                                <div className="mb-4">
                                  <h3 className="font-medium text-gray-700 mb-2">Correct Answer:</h3>
                                  <div className="pl-2 border-l-4 border-green-300 py-1 bg-green-50">
                                    {q.correct_answer}
                                  </div>
                                </div>
                              )}
                              
                              {/* Show true/false answer */}
                              {q.type === 'tf' && (
                                <div className="mb-4">
                                  <h3 className="font-medium text-gray-700 mb-2">Correct Answer:</h3>
                                  <div className="pl-2 border-l-4 border-green-300 py-1 bg-green-50">
                                    {q.is_true ? 'True' : 'False'}
                                  </div>
                                </div>
                              )}

                              {/* Show explanation if available */}
                              {q.explanation && (
                                <div className="mb-4">
                                  <h3 className="font-medium text-gray-700 mb-2">Explanation:</h3>
                                  <div className="pl-2 border-l-4 border-blue-200 py-1 text-gray-600 bg-blue-50">
                                    {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        );
                      })
                    ) : (
                      <div className="bg-gray-100 p-6 rounded text-gray-500 text-center">
                        No matching questions found. Try adjusting your search or filters.
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultPage;