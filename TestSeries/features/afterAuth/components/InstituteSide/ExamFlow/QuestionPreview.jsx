import React from 'react';

const QuestionPreview = ({ questions }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Question Preview ({questions.length})</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm max-h-[400px]">{JSON.stringify(questions, null, 2)}</pre>
    </div>
  );
};

export default QuestionPreview;
