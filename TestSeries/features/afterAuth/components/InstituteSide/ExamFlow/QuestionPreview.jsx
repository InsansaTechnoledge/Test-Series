import React, {useState} from 'react';

const QuestionPreview = ({ questions , setQuestions , examDetails}) => {
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    
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

    const totalMarks = filteredQuestions.reduce((sum, q) => sum + (Number(q.positive_marks) || 0), 0);
    const examTotalMarks = Number(examDetails?.total_marks) || 0;
    const percentage = examTotalMarks > 0 ? ((totalMarks / examTotalMarks) * 100).toFixed(2) : 'N/A';
    
    
    return (
      <div className="mt-6 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Question Preview ({filteredQuestions.length})</h2>
            <div className="text-sm mx-30 text-gray-700 space-x-4">
                <span>Total Marks: <strong>{totalMarks}</strong></span>
                <span>Out of: <strong>{examTotalMarks}</strong></span>
                <span className={` ${percentage > 100 ? "text-red-600" : "text-gray-800"}`}>Coverage: <strong className='text-green-600'>{percentage}%</strong></span>
            </div>

        </div>

          <div className="flex space-x-2">
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
            
            <input 
              type="text"
              placeholder="Search questions..."
              className="border rounded px-3 py-1 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {questions.length > 0 ? (
          <div className="space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q, index) => (
                
                <div key={q.id} className="border rounded-lg overflow-hidden bg-white">
                  <div 
                    className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(q.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 font-medium">#{index + 1}</span>
                        <span className="px-2 py-0.5 rounded text-xs uppercase font-medium bg-blue-100 text-blue-800">
                          {getQuestionTypeLabel(q.type)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs uppercase font-medium ${getDifficultyBadgeClass(q.difficulty)}`}>
                          {q.difficulty}
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
                      
                      {/* Show options for MCQ and MSQ */}
                      {(q.type === 'mcq' || q.type === 'msq') && q.options && q.options.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-700 mb-2">Options:</h3>
                          <div className="space-y-2 pl-2">
                            {q.options.map((option, i) => (
                              <div 
                                key={i} 
                                className={`flex items-center p-2 rounded ${
                                  q.type === 'mcq' 
                                    ? (q.correct_option === i ? 'bg-green-50 border border-green-200' : '') 
                                    : (q.correct_options && q.correct_options.includes(i) ? 'bg-green-50 border border-green-200' : '')
                                }`}
                              >
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 mr-3 flex-shrink-0">
                                  {String.fromCharCode(65 + i)}
                                </div>
                                <div>{option}</div>
                                {q.type === 'mcq' && q.correct_option === i && (
                                  <div className="ml-auto text-green-600 font-medium text-sm">Correct</div>
                                )}
                                {q.type === 'msq' && q.correct_options && q.correct_options.includes(i) && (
                                  <div className="ml-auto text-green-600 font-medium text-sm">Correct</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Show correct answer for fill-in-the-blank and numerical */}
                      {(q.type === 'fill' || q.type === 'numerical') && (
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-700 mb-2">Correct Answer:</h3>
                          <div className="pl-2 border-l-4 border-green-300 py-1">
                            {q.correct_answer}
                          </div>
                        </div>
                      )}
                      
                      {/* Show true/false answer */}
                      {q.type === 'tf' && (
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-700 mb-2">Correct Answer:</h3>
                          <div className="pl-2 border-l-4 border-green-300 py-1">
                            {q.is_true ? 'True' : 'False'}
                          </div>
                        </div>
                      )}

                      {/* Show match the following pairs */}
                        {q.type === 'match' && (
                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Matching Pairs:</h3>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border">
                            <div>
                                <h4 className="font-semibold text-sm mb-2 text-gray-600">Left Items</h4>
                                {q.left_items?.map((item, i) => (
                                <div key={i} className="py-1">{`${i + 1}. ${item}`}</div>
                                ))}
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm mb-2 text-gray-600">Right Items</h4>
                                {q.right_items?.map((item, i) => (
                                <div key={i} className="py-1">{`${String.fromCharCode(65 + i)}. ${item}`}</div>
                                ))}
                            </div>
                            </div>

                            {q.correct_pairs && (
                            <div className="mt-4">
                                <h4 className="font-semibold text-sm mb-1 text-green-700">Correct Pairs:</h4>
                                <div className="text-sm text-gray-800 bg-green-50 border border-green-200 p-2 rounded">
                                {Object.entries(q.correct_pairs).map(([leftIdx, rightChar], i) => (
                                    <div key={i}>{`Left ${leftIdx} → Right ${rightChar}`}</div>
                                ))}
                                </div>
                            </div>
                            )}
                        </div>
                        )}

                        {q.type === 'comprehension' && (
                           
                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Comprehension Passage:</h3>
                            <div className="pl-2 border-l-4 border-gray-200 py-2 text-gray-800 whitespace-pre-line">
                            {q.passage || '❌ No passage found'}
                            </div>

                            {Array.isArray(q.sub_question_ids) && q.sub_question_ids.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                <h4 className="font-semibold text-sm text-gray-700">Sub-Questions:</h4>

                                {q.sub_question_ids.map((sub, subIndex) => (
                                <div key={sub.id} className="bg-gray-50 p-3 rounded border space-y-2">
                                    <div className="text-sm font-medium">
                                    {subIndex + 1}. {sub.question_text || '❌ No question text'} 
                                    <span className="ml-2 text-gray-500 text-xs">
                                    (+{Number(sub.positive_marks) || 0}
                                    {sub.negative_marks > 0 ? ` / -${sub.negative_marks}` : ''})
                                    </span>

                                    </div>

                                    {/* Options for MCQ / MSQ */}
                                    {(sub.type === 'mcq' || sub.type === 'msq') && Array.isArray(sub.options) && (
                                        <>
                                    <ul className="ml-4 list-disc text-sm">
                                        {sub.options.map((opt, i) => (
                                        <li
                                            key={i}
                                            className={
                                            (sub.type === 'mcq' && sub.correct_option === i) ||
                                            (sub.type === 'msq' && sub.correct_options?.includes(i))
                                                ? 'text-green-700 font-semibold'
                                                : ''
                                            }
                                        >
                                            {String.fromCharCode(65 + i)}. {opt}
                                        </li>
                                        ))}
                                        
                                    </ul>

                                    {/* <div className=" text-sm text-green-800 font-medium">
                                    Total Sub-question Marks: {q.sub_question_ids.reduce((sum, s) => sum + (Number(s.marks) || 0), 0)}
                                    </div> */}
                                
                                    </>

                                    )}

                                    {/* Fill / Numerical */}
                                    {(sub.type === 'fill' || sub.type === 'numerical') && (
                                    <div className="text-sm text-green-700">
                                        Answer: {sub.correct_answer}
                                    </div>
                                    )}

                                    {/* True / False */}
                                    {sub.type === 'tf' && (
                                    <div className="text-sm text-green-700">
                                        Answer: {sub.is_true ? 'True' : 'False'}
                                    </div>
                                    )}

                                    {/* Explanation if available */}
                                    {sub.explanation && (
                                    <div className="text-xs text-gray-600">
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
                          <h3 className="font-medium text-gray-700 mb-2">Explanation:</h3>
                          <div className="pl-2 border-l-4 border-blue-200 py-1 text-gray-600">
                            {q.explanation}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-4 pt-4 border-t">
                        <button 
                          className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
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
              <div className="bg-gray-100 p-6 rounded text-gray-500 text-center">
                No matching questions found. Try adjusting your search or filters.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 p-6 rounded text-gray-500 text-center">
            No questions added yet. Add questions manually or upload via Excel.
          </div>
        )}
      </div>
    );
  };

export default QuestionPreview