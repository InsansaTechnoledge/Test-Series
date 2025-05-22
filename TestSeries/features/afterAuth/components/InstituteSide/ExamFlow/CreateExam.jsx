import React, { useState } from 'react';
import ExamForm from './ExamForm';
import ManualQuestionForm from './ManualQuestionsForm';
import BulkUpload from './BulkUpload';
import QuestionPreview from './QuestionPreview';

const CreateExam = () => {
  const [examDetails, setExamDetails] = useState(null);
  const [questions, setQuestions] = useState([]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Exam</h1>
      <ExamForm onSubmit={setExamDetails} />

      {examDetails && (
        <>
          <ManualQuestionForm questions={questions} setQuestions={setQuestions} />
          <BulkUpload setQuestions={setQuestions} />
          <QuestionPreview questions={questions} />
        </>
      )}

    <button
    onClick={() => {
        console.log("✅ Submitting Exam...");
        console.log("Exam Details:", examDetails);
        console.log("Questions:", questions);
        alert('✅ Check console for submitted payload!');
    }}
    className="mt-4 bg-purple-700 text-white px-6 py-2 rounded"
    >
    Submit Exam
    </button>

    </div>
  );
};

export default CreateExam;
