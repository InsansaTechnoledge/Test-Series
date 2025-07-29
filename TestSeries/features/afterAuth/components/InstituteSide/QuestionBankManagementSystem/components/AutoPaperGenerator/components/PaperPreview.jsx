import React from 'react'

const PaperPreview = ({ generatedPaper }) => {
    return (
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-center">{generatedPaper.title}</h3>
          <div className="text-center text-sm text-gray-600 mt-2">
            Time: {generatedPaper.timeLimit} minutes | Questions: {generatedPaper.totalQuestions} | Marks: {generatedPaper.totalMarks}
          </div>
          
          <div className="bg-blue-50 p-3 rounded mt-3">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Instructions:</h4>
            <ul className="text-xs text-gray-700 list-disc list-inside space-y-1">
              {generatedPaper.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="p-4 max-h-96 overflow-y-auto">
          {generatedPaper.questions.slice(0, 5).map((question, index) => (
            <div key={question.id} className="mb-4 pb-3 border-b border-gray-200 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-gray-800 text-sm">Question {index + 1}:</div>
                <div className="text-xs text-blue-600 font-medium">[{question.marks || 1} marks]</div>
              </div>
              <div className="text-gray-700 mb-2 text-sm">{question.question_text}</div>
              {question.options && question.options.length > 0 && (
                <div className="ml-3 space-y-1">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="text-xs text-gray-600">
                      <span className="font-medium">{String.fromCharCode(65 + optIndex)})</span> {option}
                    </div>
                  ))}
                </div>
              )}
              {/* {question.question_type === 'fill' && question.correct_answer && (
                <div className="ml-3 text-xs text-green-600 font-medium">
                  Answer: {question.correct_answer}
                </div>
              )} */}
              <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-3">
                {question.subject && <span>Subject: {question.subject}</span>}
                {question.difficulty && <span>Difficulty: {question.difficulty}</span>}
                {question.chapter && <span>Chapter: {question.chapter}</span>}
                {question.bloom_level && <span>Bloom: {question.bloom_level}</span>}
              </div>
            </div>
          ))}
          
          {generatedPaper.questions.length > 5 && (
            <div className="text-center text-gray-500 text-xs py-3">
              ... and {generatedPaper.questions.length - 5} more questions
              <br />
              <span>Download to view complete paper</span>
            </div>
          )}
        </div>
      </div>
    );
  };

export default PaperPreview
