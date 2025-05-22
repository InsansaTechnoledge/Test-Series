import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ManualQuestionForm = ({ questions, setQuestions }) => {
  const [form, setForm] = useState({
    type: 'mcq',
    question_text: '',
    options: ['', '', '', ''],
    correct_option: 0,
    correct_options: [],
    correct_answer: '',
    is_true: null,
    explanation: '',
    difficulty: 'easy',
    marks: 1,
    subject: '',
    chapter: ''
  });

  const handleAdd = () => {
    let newQuestion = {
      id: uuidv4(),
      type: form.type,
      question_text: form.question_text,
      explanation: form.explanation,
      difficulty: form.difficulty,
      marks: form.marks,
      subject: form.subject,
      chapter: form.chapter,
    };
  
    if (form.type === 'mcq') {
      newQuestion.options = form.options;
      newQuestion.correct_option = Number(form.correct_option);
    }
  
    if (form.type === 'msq') {
      newQuestion.options = form.options;
      newQuestion.correct_options = form.correct_options;
    }
  
    if (form.type === 'fill' || form.type === 'numerical') {
      newQuestion.correct_answer = form.correct_answer;
    }
  
    if (form.type === 'tf') {
      newQuestion.is_true = form.is_true === 'true' || form.is_true === true;
    }
  
    setQuestions(prev => {
        const updated = [...prev, newQuestion];
        console.log("✅ Question just added:", newQuestion);
        console.log("📝 Updated Questions Preview:", updated);
        return updated;
      });
      
  
    // console.log("✅ Added Question:", newQuestion);
  
    // Reset form (optional)
    setForm({
      type: 'mcq',
      question_text: '',
      options: ['', '', '', ''],
      correct_option: 0,
      correct_options: [],
      correct_answer: '',
      is_true: null,
      explanation: '',
      difficulty: 'easy',
      marks: 1,
      subject: '',
      chapter: ''
    });
  };
  
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Add Question Manually</h2>
      <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
        <option value="mcq">MCQ</option>
        <option value="msq">MSQ</option>
        <option value="fill">Fill in the Blank</option>
        <option value="tf">True/False</option>
        <option value="numerical">Numerical</option>
        <option value="code">Code</option>
      </select>

      <textarea className="input" placeholder="Question Text" value={form.question_text} onChange={e => setForm({ ...form, question_text: e.target.value })} />

      {form.type === 'mcq' || form.type === 'msq' ? (
        <>
          {form.options.map((opt, i) => (
            <input key={i} className="input" placeholder={`Option ${i + 1}`} value={opt}
              onChange={(e) => {
                const options = [...form.options];
                options[i] = e.target.value;
                setForm({ ...form, options });
              }} />
          ))}
        </>
      ) : null}

      {form.type === 'mcq' && (
        <input className="input" placeholder="Correct Option Index (0-based)" type="number"
          onChange={(e) => setForm({ ...form, correct_option: + parseInt(e.target.value )})} />
      )}

      {form.type === 'msq' && ( 
        <input className="input" placeholder="Correct Option Indexes (comma-separated)"
          onChange={(e) => setForm({ ...form, correct_options: e.target.value.split(',').map(Number) })} />
      )}

      {form.type === 'fill' || form.type === 'numerical' ? (
        <input className="input" placeholder="Correct Answer" onChange={(e) => setForm({ ...form, correct_answer: e.target.value })} />
      ) : null}

      {form.type === 'tf' && (
        <select className="input" onChange={(e) => setForm({ ...form, is_true: e.target.value === 'true' })}>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      )}

      <input className="input" placeholder="Subject" onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      <input className="input" placeholder="Chapter" onChange={(e) => setForm({ ...form, chapter: e.target.value })} />
      <input className="input" placeholder="Explanation" onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
      <select className="input" onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button className="bg-green-600 text-white px-4 py-2 mt-2 rounded" onClick={handleAdd}>Add Question</button>
    </div>
  );
};

export default ManualQuestionForm;
