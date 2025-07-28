import React from 'react';

const PaperPreview = ({ generatedPaper }) => {
  return (
    <div className="bg-white border rounded-lg">
      <div className="p-6 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-center">{generatedPaper.title}</h3>
        <div className="text-center text-sm text-gray-600 mt-2">
          Time: {generatedPaper.timeLimit} minutes | Total Questions: {generatedPaper.totalQuestions} | Total Marks: {generatedPaper.totalMarks}
        </div>
        
        <div className="bg-blue-50 p-4 rounded mt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            {generatedPaper.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-6 max-h-96 overflow-y-auto">
        {generatedPaper.questions.slice(0, 5).map((question, index) => (
          <div key={question.id} className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div className="font-semibold text-gray-800">
                Question {index + 1}:
              </div>
              <div className="text-sm text-blue-600 font-medium">
                [{question.marks || 2} marks]
              </div>
            </div>
            <div className="text-gray-700 mb-3">
              {question.question_text || question.title || 'Question text not available'}
            </div>
            {question.options && question.options.length > 0 && (
              <div className="ml-4 space-y-1">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="text-sm text-gray-600">
                    <span className="font-medium">{String.fromCharCode(65 + optIndex)})</span> {option.text || option}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-4">
              {question.subject && <span>Subject: {question.subject}</span>}
              {question.difficultyLevel && <span>Difficulty: {question.difficultyLevel}</span>}
              {question.bloomLevel && <span>Bloom: {question.bloomLevel}</span>}
            </div>
          </div>
        ))}
        
        {generatedPaper.questions.length > 5 && (
          <div className="text-center text-gray-500 text-sm py-4">
            ... and {generatedPaper.questions.length - 5} more questions
            <br />
            <span className="text-xs">Download PDF to view complete paper</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperPreview;