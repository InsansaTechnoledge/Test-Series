import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CodeCreatorForm from '../../../../Test/CodeEditor/codeCreator/codeCreatorForm';

const ManualQuestionForm = ({ setQuestions, organizationId }) => {

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

      console.log("Code Question Data:", JSON.stringify(newQuestion, null, 2));


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

  return (
    <div className="space-y-4">
      <select
        className="input w-full p-2 border rounded"
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
        <option value="comprehension">comprehension</option>
        <option value="code">Code</option>
      </select>

      <textarea
        className="input w-full p-2 border rounded"
        placeholder="Question Text"
        name="question_text"
        value={form.question_text}
        onChange={handleChange}
        rows={3}
      />

      {(form.type === 'mcq' || form.type === 'msq') && (
        <div className="space-y-2">
          {form.options.map((opt, i) => (
            <input
              key={i}
              className="input w-full p-2 border rounded"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => handleOptionsChange(i, e.target.value)}
            />
          ))}
        </div>
      )}

      {form.type === 'mcq' && (
        <input
          className="input w-full p-2 border rounded"
          placeholder="Correct Option Index (0-based)"
          type="number"
          name="correct_option"
          value={form.correct_option}
          onChange={handleChange}
          min={0}
          max={form.options.length - 1}
        />
      )}

      {form.type === 'msq' && (
        <input
          className="input w-full p-2 border rounded"
          placeholder="Correct Option Indexes (comma-separated)"
          name="correct_options_input"
          onChange={(e) => {
            const values = e.target.value.split(',')
              .map(val => val.trim())
              .filter(val => val !== '')
              .map(Number);
            setForm(prev => ({ ...prev, correct_options: values }));
          }}
        />
      )}

      {(form.type === 'fill' || form.type === 'numerical') && (
        <input
          className="input w-full p-2 border rounded"
          placeholder="Correct Answer"
          name="correct_answer"
          value={form.correct_answer}
          onChange={handleChange}
        />
      )}

      {form.type === 'tf' && (
        <select
          className="input w-full p-2 border rounded"
          name="is_true"
          value={form.is_true}
          onChange={handleChange}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      )}

      {form.type === 'match' && (
        <>
          <p className="text-sm text-gray-600 mt-1">
            For able to auto-generate the required answer ,
            Please enter matching <strong>Left</strong> and <strong>Right</strong> items in the same order.
            For example, if "India" matches with "New Delhi", make sure they are at the same index in both lists.

          </p>
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-semibold">Left Items</label>
              {form.left_items.map((item, i) => (
                <input
                  key={i}
                  className="input w-full p-2 border rounded mb-1"
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
              <label className="text-sm font-semibold">Right Items</label>
              {form.right_items.map((item, i) => (
                <input
                  key={i}
                  className="input w-full p-2 border rounded mb-1"
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
            className="input w-full p-2 border rounded"
            placeholder='Correct Pairs (e.g., {"India":"New Delhi"})'
            value={form.correct_pairs_input}
            onChange={(e) => setForm(prev => ({ ...prev, correct_pairs_input: e.target.value }))}
          />

          <button
            type="button"
            className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              const pairs = {};
              form.left_items.forEach((left, i) => {
                const right = form.right_items[i];
                if (left && right) {
                  pairs[left] = right;
                }
              });
              setForm(prev => ({
                ...prev,
                correct_pairs_input: JSON.stringify(pairs, null, 2)
              }));
            }}
          >
            Auto-generate correct pairs (value → value)
          </button>

        </>
      )}

      {form.type === 'code' && (
        <div className="bg-gray-100 border rounded p-4 space-y-3">

          <h4 className="font-semibold">Code Question Builder</h4>
          <CodeCreatorForm
            setFormData={setCodeData}
            formData={codeData}

          />
        </div>

      )}

      {form.type === 'comprehension' && (
        <>
          {/* Comprehension Passage */}
          <textarea
            className="input w-full p-2 border rounded mb-2"
            rows={4}
            placeholder="Enter comprehension passage"
            value={form.passage}
            onChange={(e) => setForm(prev => ({ ...prev, passage: e.target.value }))}
          />

          <input
            className="input w-full border rounded p-2"
            placeholder="Positive Marks"
            type="number"
            value={form.sub_form.positive_marks}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                sub_form: {
                  ...prev.sub_form,
                  positive_marks: parseInt(e.target.value)
                }
              }))
            }
          />

          <input
            className="input w-full border rounded p-2"
            placeholder="Negative Marks"
            type="number"
            value={form.sub_form.negative_marks}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                sub_form: {
                  ...prev.sub_form,
                  negative_marks: parseInt(e.target.value)
                }
              }))
            }
          />


          {/* Sub-question builder */}
          <div className="bg-gray-100 border rounded p-4 space-y-3">
            <h4 className="font-semibold">Add Sub-Question</h4>

            <select
              className="input w-full border rounded p-2"
              value={form.sub_form.type}
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  sub_form: { ...prev.sub_form, type: e.target.value }
                }))
              }
            >
              <option value="mcq">MCQ</option>
              <option value="msq">MSQ</option>
              <option value="fill">Fill in the Blank</option>
              <option value="tf">True/False</option>
              <option value="numerical">Numerical</option>
            </select>

            <input
              className="input w-full border rounded p-2"
              placeholder="Sub-question text"
              value={form.sub_form.question_text}
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  sub_form: { ...prev.sub_form, question_text: e.target.value }
                }))
              }
            />

            {/* Options */}
            {(form.sub_form.type === 'mcq' || form.sub_form.type === 'msq') && (
              <>
                {form.sub_form.options.map((opt, i) => (
                  <input
                    key={i}
                    className="input w-full border rounded p-2 mb-1"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...form.sub_form.options];
                      updated[i] = e.target.value;
                      setForm(prev => ({
                        ...prev,
                        sub_form: { ...prev.sub_form, options: updated }
                      }));
                    }}
                  />
                ))}
              </>
            )}

            {/* MCQ correct index */}
            {form.sub_form.type === 'mcq' && (
              <input
                type="number"
                className="input w-full border rounded p-2"
                placeholder="Correct option index (0-based)"
                value={form.sub_form.correct_option}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    sub_form: {
                      ...prev.sub_form,
                      correct_option: parseInt(e.target.value)
                    }
                  }))
                }
              />
            )}

            {/* MSQ correct options */}
            {form.sub_form.type === 'msq' && (
              <input
                className="input w-full border rounded p-2"
                placeholder="Correct options (comma-separated)"
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    sub_form: {
                      ...prev.sub_form,
                      correct_options: e.target.value
                        .split(',')
                        .map(val => parseInt(val.trim()))
                    }
                  }))
                }
              />
            )}

            {/* Fill / Numerical */}
            {(form.sub_form.type === 'fill' || form.sub_form.type === 'numerical') && (
              <input
                className="input w-full border rounded p-2"
                placeholder="Correct answer"
                value={form.sub_form.correct_answer}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    sub_form: { ...prev.sub_form, correct_answer: e.target.value }
                  }))
                }
              />
            )}

            {/* True/False */}
            {form.sub_form.type === 'tf' && (
              <select
                className="input w-full border rounded p-2"
                value={form.sub_form.is_true}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    sub_form: {
                      ...prev.sub_form,
                      is_true: e.target.value === 'true'
                    }
                  }))
                }
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            )}

            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setForm(prev => ({
                  ...prev,
                  sub_question_ids: [...prev.sub_question_ids, { ...prev.sub_form, id: uuidv4() }],
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
                }));
              }}
            >
              ➕ Add Sub-question
            </button>

            {/* Preview sub-questions */}
            {form.sub_question_ids.length > 0 && (
              <div className="mt-2 text-sm text-gray-700">
                <strong>Sub-questions added:</strong> {form.sub_question_ids.length}
              </div>
            )}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="input w-full p-2 border rounded"
          placeholder="Subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
        />

        <input
          className="input w-full p-2 border rounded"
          placeholder="Chapter"
          name="chapter"
          value={form.chapter}
          onChange={handleChange}
        />
      </div>

      <textarea
        className="input w-full p-2 border rounded"
        placeholder="Explanation"
        name="explanation"
        value={form.explanation}
        onChange={handleChange}
        rows={2}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="input w-full p-2 border rounded"
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input w-full p-2 border rounded"
            placeholder="Positive Marks"
            type="number"
            name="positive_marks"
            value={form.positive_marks}
            onChange={handleChange}
            min={1}
          />

          <input
            className="input w-full p-2 border rounded"
            placeholder="Negative Marks"
            type="number"
            name="negative_marks"
            value={form.negative_marks}
            onChange={handleChange}
            min={0}
          />
        </div>

      </div>

      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        onClick={handleAdd}
      >
        Add Question
      </button>
    </div>
  );
};


export default ManualQuestionForm;
