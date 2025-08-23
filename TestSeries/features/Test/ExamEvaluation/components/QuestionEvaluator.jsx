import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { QuestionContent } from '../../../afterAuth/components/StudentSide/CompletedExams/DetailedResultComponents/QuestionContent'; // Import the module
import { useState } from 'react';

const QuestionEvaluation = ({ question, result, onSave, theme = "light" }) => {
  const [marks, setMarks] = useState(question.marksObtained || '');
  const [feedback, setFeedback] = useState(question.feedback || '');

  const getResponseStatus = () => {
    if (result.unattempted.includes(question.id)) {
      return { status: 'unattempted', response: null };
    }

    const wrongAnswer = result.wrongAnswers.find(w => w.questionId === question.id);
    if (wrongAnswer) {
      return { status: 'wrong', response: wrongAnswer.response };
    }

    if (question.question_type === 'descriptive') {
      const descriptiveResponse = result.descriptiveResponses.find(r => r.questionId === question.id);

      if (descriptiveResponse) {
        return { status: 'descriptive', response: descriptiveResponse.response };
      }
    }

    return { status: 'correct', response: null };
  };

  const responseData = getResponseStatus();
  const responseStatus = responseData.status;
  const studentResponse = responseData.response;

  // Create userAnswers object in the format expected by QuestionContent
  const createUserAnswers = () => {
    const userAnswers = {};
    
    if (responseStatus === 'unattempted') {
      return userAnswers;
    }
    
    if (responseStatus === 'wrong' || responseStatus === 'correct') {
      userAnswers[question.id] = studentResponse;
    }
    
    return userAnswers;
  };

  // Convert question format to match QuestionContent expectations
  const convertQuestionFormat = () => {
    return {
      ...question,
      type: question.question_type, // Map question_type to type
      id: question.id
    };
  };

  const renderStudentResponse = () => {
    if (responseStatus === 'unattempted') {
      return (
        <div className={`flex items-center justify-center p-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg border-2 border-dashed ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} transition-colors duration-200`}>
          <div className="text-center">
            <Clock className={`w-12 h-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mx-auto mb-3`} />
            <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Question Not Attempted</h4>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Student did not provide any response for this question</p>
          </div>
        </div>
      );
    }

    // For non-descriptive questions, use QuestionContent
    if (question.question_type !== 'descriptive') {
      const convertedQuestion = convertQuestionFormat();
      const userAnswers = createUserAnswers();
      
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            {responseStatus === 'correct' ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-lg font-medium text-green-700">
                  {responseStatus === 'correct' ? 'Correct Answer' : 'Answer Submitted'}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-500" />
                <span className="text-lg font-medium text-red-700">Incorrect Answer</span>
              </>
            )}
          </div>

          {/* Use QuestionContent for rendering */}
          <QuestionContent
            question={convertedQuestion}
            userAnswers={userAnswers}
            result={result}
            theme={theme}
            descriptiveResponses={result.descriptiveResponses}
          />
        </div>
      );
    }

    // Keep existing descriptive question rendering
    if (question.question_type === 'descriptive') {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-medium text-blue-700">Descriptive Answer - Requires Manual Evaluation</span>
          </div>

          <div>
            <h5 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Student's Answer:</h5>
            <div className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border transition-colors duration-200`}>
              <pre className={`whitespace-pre-wrap font-mono text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {studentResponse || 'No response provided'}
              </pre>
            </div>
            <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Word count: {studentResponse ? studentResponse.split(' ').filter(word => word.length > 0).length : 0} words
              {question.min_words && question.max_words && (
                <span className="ml-2">
                  (Required: {question.min_words}-{question.max_words} words)
                </span>
              )}
            </div>
          </div>

          {question.reference_answer && (
            <div>
              <h5 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Reference Answer:</h5>
              <div className={`${theme === 'dark' ? 'bg-blue-900 bg-opacity-30 border-blue-700' : 'bg-blue-50 border-blue-200'} p-4 rounded-lg border transition-colors duration-200`}>
                <pre className={`whitespace-pre-wrap font-mono text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                  {question.reference_answer}
                </pre>
              </div>
            </div>
          )}

          {question.rubric && (
            <div>
              <h5 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Evaluation Rubric:</h5>
              <div className={`${theme === 'dark' ? 'bg-yellow-900 bg-opacity-30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} p-4 rounded-lg border transition-colors duration-200`}>
                <div className="mb-3">
                  <span className={`${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-900'} font-medium`}>Total Marks: {question.rubric.total_marks}</span>
                </div>
                <div className="space-y-3">
                  {question.rubric.criteria.map((criterion) => (
                    <div key={criterion.id} className={`${theme === 'dark' ? 'bg-gray-800 border-yellow-600' : 'bg-white border-yellow-200'} p-3 rounded border transition-colors duration-200`}>
                      <div className="flex justify-between items-start mb-2">
                        <h6 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{criterion.name}</h6>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-yellow-200 bg-yellow-800' : 'text-yellow-800 bg-yellow-100'} px-2 py-1 rounded transition-colors duration-200`}>
                          {criterion.max_marks} marks
                        </span>
                      </div>
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{criterion.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {question.keywords && question.keywords.length > 0 && (
            <div>
              <h5 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Key Points to Look For:</h5>
              <div className="flex flex-wrap gap-2">
                {question.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'bg-purple-800 text-purple-200' 
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const shouldShowMarkingSection = () => {
    return question.question_type === 'descriptive' && !result.evaluated;
  };

  const getAutoMarks = () => {
    if (responseStatus === 'unattempted') return 0;

    if (question.question_type !== 'descriptive') {
      if (responseStatus === 'correct') return question.positive_marks;
      if (responseStatus === 'wrong') return question.negative_marks || 0;
    } else {
      return result.descriptiveResponses.find(r => r.questionId === question.id)?.obtainedMarks || 0;
    }
  };

  const autoMarks = getAutoMarks();

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border transition-colors duration-200`}>
      <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Question Evaluation</h3>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Max Marks: {question.positive_marks}</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Type: {question.question_type.toUpperCase()}</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Difficulty: {question.difficulty}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{autoMarks}</div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {question.question_type !== 'descriptive' ? <span>Auto Marks</span> : <span>Given Marks</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Question:</h4>
          <div className={`${theme === 'dark' ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-50'} p-4 rounded-lg transition-colors duration-200`}>
            {question.question_text}
          </div>
        </div>

        <div>
          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Student Response:</h4>
          {renderStudentResponse()}
        </div>

        {shouldShowMarkingSection() && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks Awarded
                </label>
                <input
                  type="number"
                  min="0"
                  max={question.positive_marks}
                  value={marks}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > question.positive_marks) {
                      setMarks(question.positive_marks);
                    } else if (val < 0) {
                      setMarks(0);
                    } else {
                      setMarks(val);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Out of ${question.positive_marks}`}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  console.log("Marks:", marks, "Feedback:", feedback);
                  onSave && onSave(question.id, parseInt(marks) || 0, feedback);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Marks
              </button>
            </div>
          </>
        )}

        {responseStatus !== 'unattempted' && (
          <div className={`bg-gray-50 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {result.descriptiveResponses.find(r => r.questionId === question.id) ? (
                  <span>Marks Given : </span>
                ) : (
                  responseStatus === 'correct' ? 'Automatically graded as correct' : 'Automatically graded as incorrect'
                )}
              </span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Marks: {autoMarks}/{question.positive_marks}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionEvaluation;