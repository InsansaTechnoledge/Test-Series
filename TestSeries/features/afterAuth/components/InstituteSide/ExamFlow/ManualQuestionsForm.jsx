import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useEffect } from 'react';

const ManualQuestionForm = ({ setQuestions, organizationId }) => {
  const {user}=useUser();

  const [codeData, setCodeData] = useState({
    title: '',
    difficulty: 'easy',
    prompt: '',
    input_format: '',
    output_format: '',
    sample_input: '',
    sample_output: '',
    test_cases: [
      { input: '', expected_output: '', explanation: '' }
    ],
    description: '',
    examples: [
      { input: '', output: '', explanation: '' }
    ],
    constraints: [''],
    starter_code: {
      javascript: '',
      python: '',
      java: '',
      cpp: ''
    }
  });
  // Add code-specific properties if needed
  // newQuestion.test_cases = [];


  const initialFormState = {
    type: 'mcq',
    question_text: '',
    options: ['', '', '', ''],
    correct_option: 0,
    correct_options: [],
    correct_answer: '',
    left_items: ['', '', '', ''],
    right_items: ['', '', '', ''],
    correct_pairs_input: '',
    is_true: true,
    explanation: '',
    difficulty: 'easy',
    positive_marks: '',
    negative_marks: '0',
    subject: '',
    chapter: '',

    passage: '',
    sub_question_ids: [],
    sub_form: {
      type: 'mcq',
      question_text: '',
      options: ['', '', '', ''],
      correct_option: 0,
      correct_options: [],
      correct_answer: '',
      is_true: true,
      explanation: '',
      difficulty: 'easy',
      positive_marks: '',
      negative_marks: '0',
      subject: '',
      chapter: ''
    }

  };


  const [form, setForm] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionsChange = (index, value) => {
    const updatedOptions = [...form.options];
    updatedOptions[index] = value;
    setForm(prev => ({ ...prev, options: updatedOptions }));
  };


  const handleAdd = () => {
    // Basic validation
    if (!form.question_text.trim()) {
      alert("Please enter a question text");
      return;
    }

    const newQuestion = {
      id: uuidv4(),
      type: form.type,
      question_text: form.question_text,
      explanation: form.explanation,
      difficulty: form.difficulty,
      positive_marks: parseInt(form.positive_marks) || 1,
      negative_marks: parseInt(form.negative_marks) || 0,
      subject: form.subject,
      chapter: form.chapter,
      question_type: form.type,
      organization_id: organizationId,

    };

    if (form.type === 'mcq') {
      newQuestion.options = form.options;
      newQuestion.correct_option = parseInt(form.correct_option) || 0;
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

    if (form.type === 'match') {
      newQuestion.left_items = form.left_items;
      newQuestion.right_items = form.right_items;

      if (form.correct_pairs_input.trim() === '') {
        alert("Please enter matching pairs in JSON format.");
        return;
      }

      try {
        newQuestion.correct_pairs = JSON.parse(form.correct_pairs_input);
      } catch (err) {
        alert("Correct Pairs must be a valid JSON object (e.g., {\"1\": \"A\"})");
        return;
      }
    }



    if (form.type === 'comprehension') {
      newQuestion.passage = form.passage;
      newQuestion.sub_question_ids = form.sub_question_ids;

      // ✅ Calculate total marks from sub-questions
      const totalSubMarks = form.sub_question_ids.reduce((acc, sub) => acc + (Number(sub.positive_marks) || 0), 0);
      newQuestion.positive_marks = totalSubMarks;
      newQuestion.negative_marks = 0; // or compute if needed

    }



    if (form.type === 'code') {


      newQuestion.title = codeData.title;
      newQuestion.prompt = codeData.prompt;

      newQuestion.input_format = codeData.input_format;
      newQuestion.output_format = codeData.output_format;
      newQuestion.sample_input = codeData.sample_input;
      newQuestion.sample_output = codeData.sample_output;
      newQuestion.test_cases = codeData.test_cases;
      newQuestion.description = codeData.description;
      newQuestion.examples = codeData.examples;
      newQuestion.constraints = codeData.constraints;
      newQuestion.starter_code = codeData.starter_code;
      newQuestion.difficulty = codeData.difficulty;

    }

    setQuestions(prev => [...prev, newQuestion]);

    // Reset form after adding
    setForm(initialFormState);
    setCodeData({
      title: '',
      difficulty: 'easy',
      prompt: '',
      input_format: '',
      output_format: '',
      sample_input: '',
      sample_output: '',
      test_cases: [
        { input: '', expected_output: '', explanation: '' }
      ],
      description: '',
      examples: [
        { input: '', output: '', explanation: '' }
      ],
      constraints: [''],
      starter_code: {
        javascript: '',
        python: '',
        java: '',
        cpp: ''
      }
    });

  };
  useEffect(()=>{
    console.log("check"  ,user?.planFeatures?.coding_feature.isActive)
  },[user])

  return (
    <div className="bg-white/70 backdrop-blur-md shadow-md rounded-2xl p-6 space-y-6 border border-gray-200">
      {/* Question Type Dropdown */}
      <div>
        <label className="text-sm font-medium text-gray-700">Question Type</label>
        <select
          className="mt-1 w-full p-2.5 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 text-sm"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="mcq">MCQ</option>
          <option value="msq">MSQ</option>
          <option value="fill">Fill in the Blank</option>
          <option value="tf">True/False</option>
          <option value="numerical">Numerical</option>
          <option value="match">Match the Following</option>
          <option value="comprehension">Comprehension</option>
          {user?.planFeatures?.coding_feature?.isActive === true ||
            user?.planFeatures?.coding_feature?.isActive === "true" ? (
              <option value="code">Code</option>
            ) : null}
        </select>
      </div>

      {/* Question Text */}
      <div>
        <label className="text-sm font-medium text-gray-700">Question Text</label>
        <textarea
          className="mt-1 w-full p-3 bg-white border rounded-lg shadow-sm text-sm"
          rows={3}
          name="question_text"
          value={form.question_text}
          onChange={handleChange}
          placeholder="Enter question..."
        />
      </div>

      {/* MCQ / MSQ Options */}
      {(form.type === 'mcq' || form.type === 'msq') && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Options</label>
          {form.options.map((opt, i) => (
            <input
              key={i}
              className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => handleOptionsChange(i, e.target.value)}
            />
          ))}
        </div>
      )}

      {/* Correct Option(s) */}
      {form.type === 'mcq' && (
        <input
          className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
          type="number"
          name="correct_option"
          value={form.correct_option}
          onChange={handleChange}
          placeholder="Correct Option Index (0-based)"
          min={0}
          max={form.options.length - 1}
        />
      )}

      {form.type === 'msq' && (
        <input
          className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
          placeholder="Correct Option Indexes (comma-separated)"
          onChange={(e) => {
            const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setForm(prev => ({ ...prev, correct_options: values }));
          }}
        />
      )}

      {/* Fill / Numerical Answer */}
      {(form.type === 'fill' || form.type === 'numerical') && (
        <input
          className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
          name="correct_answer"
          value={form.correct_answer}
          onChange={handleChange}
          placeholder="Correct Answer"
        />
      )}

      {/* True / False */}
      {form.type === 'tf' && (
        <select
          className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
          name="is_true"
          value={form.is_true}
          onChange={handleChange}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      )}

      {/* Match the Following */}
      {form.type === 'match' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Enter <strong>Left</strong> and <strong>Right</strong> items at the same index for pairing.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Left Items</label>
              {form.left_items.map((item, i) => (
                <input
                  key={i}
                  className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm mb-1"
                  placeholder={`Left ${i + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...form.left_items];
                    updated[i] = e.target.value;
                    setForm(prev => ({ ...prev, left_items: updated }));
                  }}
                />
              ))}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Right Items</label>
              {form.right_items.map((item, i) => (
                <input
                  key={i}
                  className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm mb-1"
                  placeholder={`Right ${i + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...form.right_items];
                    updated[i] = e.target.value;
                    setForm(prev => ({ ...prev, right_items: updated }));
                  }}
                />
              ))}
            </div>
          </div>
          <input
            className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
            placeholder='Correct Pairs (e.g., {"India":"New Delhi"})'
            value={form.correct_pairs_input}
            onChange={(e) => setForm(prev => ({ ...prev, correct_pairs_input: e.target.value }))}
          />
          <button
            type="button"
            onClick={() => {
              const pairs = {};
              form.left_items.forEach((left, i) => {
                const right = form.right_items[i];
                if (left && right) pairs[left] = right;
              });
              setForm(prev => ({
                ...prev,
                correct_pairs_input: JSON.stringify(pairs, null, 2)
              }));
            }}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm transition"
          >
            Auto-generate Correct Pairs
          </button>
        </div>
      )}

      {/* Subject, Chapter, Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Subject"
        />
        <input
          className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
          name="chapter"
          value={form.chapter}
          onChange={handleChange}
          placeholder="Chapter"
        />
      </div>

      <textarea
        className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
        name="explanation"
        value={form.explanation}
        onChange={handleChange}
        rows={2}
        placeholder="Explanation (optional)"
      />

      {/* Difficulty & Marks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
            name="positive_marks"
            value={form.positive_marks}
            onChange={handleChange}
            placeholder="Positive Marks"
            min={1}
          />
          <input
            type="number"
            className="w-full p-2.5 bg-white border rounded-lg shadow-sm text-sm"
            name="negative_marks"
            value={form.negative_marks}
            onChange={handleChange}
            placeholder="Negative Marks"
            min={0}
          />
        </div>
      </div>

      {/* Add Question Button */}
      <button
        className="py-2.5 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-200"
        onClick={handleAdd}
      >
        Add Question
      </button>
    </div>

  );
};


export default ManualQuestionForm;
