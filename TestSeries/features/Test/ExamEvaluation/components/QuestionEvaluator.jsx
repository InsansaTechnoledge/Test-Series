import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const QuestionEvaluation = ({ question, result, onUpdateMarks, onSave }) => {
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

  const renderStudentResponse = () => {
    if (responseStatus === 'unattempted') {
      return (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">Question Not Attempted</h4>
            <p className="text-sm text-gray-500">Student did not provide any response for this question</p>
          </div>
        </div>
      );
    }

    if (question.question_type === 'mcq') {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            {responseStatus === 'correct' ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-lg font-medium text-green-700">Correct Answer</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-500" />
                <span className="text-lg font-medium text-red-700">Incorrect Answer</span>
                {studentResponse && (
                  <span className="text-sm text-gray-600">Selected: {studentResponse}</span>
                )}
              </>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, index) => {
              const isSelected = studentResponse === option || studentResponse === index;
              const isCorrect = question.correct_option === index;
              
              let className = "p-3 rounded-lg border-2 ";
              if (isSelected && isCorrect) {
                className += "border-green-500 bg-green-50 text-green-800";
              } else if (isSelected && !isCorrect) {
                className += "border-red-500 bg-red-50 text-red-800";
              } else if (!isSelected && isCorrect) {
                className += "border-green-300 bg-green-25 text-green-600";
              } else {
                className += "border-gray-200 bg-gray-50 text-gray-700";
              }
              
              return (
                <div key={index} className={className}>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                    <div className="ml-auto flex space-x-2">
                      {isSelected && (
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          Selected
                        </span>
                      )}
                      {isCorrect && (
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                          Correct
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {question.explanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Explanation:</h5>
              <p className="text-blue-800">{question.explanation}</p>
            </div>
          )}
        </div>
      );
    }

    if (question.question_type === 'descriptive') {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-medium text-blue-700">Descriptive Answer - Requires Manual Evaluation</span>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Student's Answer:</h5>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                {studentResponse || 'No response provided'}
              </pre>
            </div>
            <div className="mt-2 text-sm text-gray-500">
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
              <h5 className="font-medium text-gray-900 mb-3">Reference Answer:</h5>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <pre className="whitespace-pre-wrap font-mono text-sm text-blue-800">
                  {question.reference_answer}
                </pre>
              </div>
            </div>
          )}
          
          {question.rubric && (
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Evaluation Rubric:</h5>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">{question.rubric}</p>
              </div>
            </div>
          )}
          
          {question.keywords && question.keywords.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Key Points to Look For:</h5>
              <div className="flex flex-wrap gap-2">
                {question.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
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

    if (responseStatus === 'wrong') {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <XCircle className="w-6 h-6 text-red-500" />
            <span className="text-lg font-medium text-red-700">Incorrect Answer</span>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h5 className="font-medium text-red-900 mb-2">Student's Response:</h5>
            <p className="text-red-800">{studentResponse}</p>
          </div>
          
          {question.explanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Explanation:</h5>
              <p className="text-blue-800">{question.explanation}</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <span className="text-lg font-medium text-green-700">Correct Answer</span>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-800">Student answered this question correctly</p>
        </div>
      </div>
    );
  };

  const shouldShowMarkingSection = () => {
    return question.question_type === 'descriptive';
  };

  const getAutoMarks = () => {
    if (responseStatus === 'unattempted') return 0;
    
    if (question.question_type === 'mcq') {
      if (responseStatus === 'correct') return question.positive_marks;
      if (responseStatus === 'wrong') return question.negative_marks || 0;
    }
    
    if (question.question_type === 'descriptive') {
      return 0; 
    }

    if (responseStatus === 'correct') return question.positive_marks;
    if (responseStatus === 'wrong') return question.negative_marks || 0;
    
    return 0;
  };

  const autoMarks = getAutoMarks();

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Question Evaluation</h3>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-gray-600">Max Marks: {question.positive_marks}</span>
              <span className="text-sm text-gray-600">Type: {question.question_type.toUpperCase()}</span>
              <span className="text-sm text-gray-600">Difficulty: {question.difficulty}</span>
            </div>
          </div>
          {question.question_type !== 'descriptive' && (
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{autoMarks}</div>
              <div className="text-sm text-gray-600">Auto Marks</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Question:</h4>
          <div className="text-gray-700 bg-gray-50 p-4 rounded-lg">
            {question.question_text}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Student Response:</h4>
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
                  onChange={(e) => setMarks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Out of ${question.positive_marks}`}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide feedback for the student..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  console.log("Marks:", marks, "Feedback:", feedback);
                  onUpdateMarks && onUpdateMarks(question.id, parseInt(marks) || 0, feedback);
                  onSave && onSave();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Marks
              </button>
            </div>
          </>
        )}
        
        {question.question_type !== 'descriptive' && responseStatus !== 'unattempted' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                {responseStatus === 'correct' ? 'Automatically graded as correct' : 'Automatically graded as incorrect'}
              </span>
              <span className="font-medium text-gray-900">
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