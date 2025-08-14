import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../../../../../../contexts/currentUserContext";
import { useEffect } from "react";
import CodeCreatorForm from "../../../../../Test/CodeEditor/codeCreator/codeCreatorForm";
import { useTheme } from "../../../../../../hooks/useTheme";
// import { useToast, ToastContainer } from "../../../../../../utils/Toaster";
import { validateWithBloom } from "../../../../../../utils/validateWithBloom";
import { useToast_new } from "../../../../../../utils/Toaster_new";

 // adjust path if different


const ManualQuestionForm = ({ setQuestions, organizationId, examDetails }) => {
  console.log('sdvsz', examDetails?.subjects)
  const { user } = useUser();
  console.log("sdgv", user);
  //  const { toasts, showToast, removeToast } = useToast();
  const [bloomLevel, setBloomLevel] = useState("Remember");
  
  const { showToast_new } = useToast_new();

  const [codeData, setCodeData] = useState({
    title: "",
    difficulty: "easy",
    prompt: "",
    input_format: "",
    output_format: "",
    sample_input: "",
    sample_output: "",
    test_cases: [{ input: "", expected_output: "", explanation: "" }],
    description: "",
    examples: [{ input: "", output: "", explanation: "" }],
    constraints: [""],
    starter_code: {
      javascript: "",
      python: "",
      java: "",
      cpp: "",
    },
  });
  // Add code-specific properties if needed
  // newQuestion.test_cases = [];

  const initialFormState = {
    type: "mcq",
    question_text: "",
    options: ["", "", "", ""],
    correct_option: null,
    correct_options: [],
    correct_answer: "",
    left_items: ["", "", "", ""],
    right_items: ["", "", "", ""],
    correct_pairs_input: "",
    is_true: true,
    explanation: "",
    difficulty: "easy",
    positive_marks: "",
    negative_marks: "0",
    subject: "",
    chapter: "",

    passage: "",
    sub_question_ids: [],
    sub_form: {
      type: "mcq",
      question_text: "",
      options: ["", "", "", ""],
      correct_option: null,
      correct_options: [],
      correct_answer: "",
      is_true: true,
      explanation: "",
      difficulty: "easy",
      positive_marks: "",
      negative_marks: "0",
      subject: "",
      chapter: "",
    },
  };

  const { theme } = useTheme();
  const [form, setForm] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionsChange = (index, value) => {
    const updatedOptions = [...form.options];
    updatedOptions[index] = value;
    setForm((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleAdd = async () => {
    // Basic validation
    if (!form.question_text.trim()) {
      showToast_new("Please enter a question text", "warning");
      return;
    }
    const { isValid, matchedLevel } = await validateWithBloom(form.question_text, bloomLevel);

    console.log("✅ Bloom Match:", bloomLevel);
    console.log("✅ Detected Bloom Level:", matchedLevel);
    console.log("bloom level/////",bloomLevel);
    if (!isValid) {
      showToast_new(`❌ Incorrect Bloom level! ${bloomLevel}, correct ${matchedLevel}`, "error");
      return;
    }

    showToast_new(`✅ Question matches Bloom level: ${matchedLevel}`, "success");

    const newQuestion = {
      id: uuidv4(),
      type: form.type,
      bloom_level: bloomLevel,
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
  
   
    if (form.type === "mcq") {
      newQuestion.options = form.options;
      newQuestion.correct_option = parseInt(form.correct_option) || 0;
    }

    if (form.type === "msq") {
      newQuestion.options = form.options;
      newQuestion.correct_options = form.correct_options;
    }

    if (form.type === "fill" || form.type === "numerical") {
      newQuestion.correct_answer = form.correct_answer;
    }

    if (form.type === "tf") {
      newQuestion.is_true = form.is_true === "true" || form.is_true === true;
    }

    if (form.type === "match") {
      newQuestion.left_items = form.left_items;
      newQuestion.right_items = form.right_items;

      if (form.correct_pairs_input.trim() === "") {
        showToast("Please enter matching pairs in JSON format.", "warning");
        return;
      }

      try {
        newQuestion.correct_pairs = JSON.parse(form.correct_pairs_input);
      } catch (err) {
        showToast(
          'Correct Pairs must be a valid JSON object (e.g., {"1": "A"})',
          "warning"
        );
        return;
      }
    }

    if (form.type === "comprehension") {
      newQuestion.passage = form.passage;
      newQuestion.sub_question_ids = form.sub_question_ids;

      // ✅ Calculate total marks from sub-questions
      const totalSubMarks = form.sub_question_ids.reduce(
        (acc, sub) => acc + (Number(sub.positive_marks) || 0),
        0
      );
      newQuestion.positive_marks = totalSubMarks;
      newQuestion.negative_marks = 0; // or compute if needed
    }

    if (form.type === "code") {
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

    setQuestions((prev) => [...prev, newQuestion]);

    // Reset form after adding
    setForm(initialFormState);
    setCodeData({
      title: "",
      difficulty: "easy",
      prompt: "",
      input_format: "",
      output_format: "",
      sample_input: "",
      sample_output: "",
      test_cases: [{ input: "", expected_output: "", explanation: "" }],
      description: "",
      examples: [{ input: "", output: "", explanation: "" }],
      constraints: [""],
      starter_code: {
        javascript: "",
        python: "",
        java: "",
        cpp: "",
      },
    });
  };

  
  useEffect(() => {
    console.log("check", user?.planFeatures?.coding_feature?.isActive);
  }, [user]);
  const inputCommon = `p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${theme === "light"
    ? "bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400"
    : "bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300"
    }`;
  const LabelCommon = `text-lg font-bold ${theme === "light" ? "text-gray-700" : "text-indigo-200"
    }`;


  return (
    <>
      <div
        className={` backdrop-blur-md shadow-md rounded-2xl p-6 space-y-6  ${theme == "light" ? "border border-gray-200 bg-white/70" : "bg-gray-800"
          }`}
      >
        {/* Question Type Dropdown */}
        <div>
          <label className={LabelCommon}>Question Type</label>
          <select
            className={inputCommon}
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
          <label className={LabelCommon}>Question Text</label>
          <textarea
            className={inputCommon}
            rows={3}
            name="question_text"
            value={form.question_text}
            onChange={handleChange}
            placeholder="Enter question..."
          />
        </div>

        {/* MCQ / MSQ Options */}
        {(form.type === "mcq" || form.type === "msq") && (
          <div className="space-y-2">
            <label className={LabelCommon}>Options</label>
            <div className="mb-3">
              <p
                className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
              >
                Enter your options below, then click to select the correct
                answer(s)
              </p>
            </div>
            <div>
              <span
                className={`text-sm font-semibold ${theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
              >
                Select Correct Option
              </span>
            </div>

            {form.options.map((opt, i) => {
              const isChecked =
                form.type === "mcq"
                  ? form.correct_option === i
                  : form.correct_options.includes(i);

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${isChecked
                    ? theme === "light"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-blue-900/20 border-blue-700"
                    : theme === "light"
                      ? "bg-white border-gray-200 hover:border-gray-300"
                      : "bg-gray-800 border-gray-700 hover:border-gray-600"
                    }`}
                  onClick={() => {
                    if (form.type === "mcq") {
                      setForm((prev) => ({
                        ...prev,
                        correct_option: i,
                      }));
                    } else if (form.type === "msq") {
                      const newSelections = isChecked
                        ? form.correct_options.filter((index) => index !== i)
                        : [...form.correct_options, i];

                      setForm((prev) => ({
                        ...prev,
                        correct_options: newSelections,
                      }));
                    }
                  }}
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${isChecked
                      ? "bg-blue-500 border-blue-500"
                      : theme === "light"
                        ? "border-gray-300"
                        : "border-gray-600"
                      }`}
                  >
                    {isChecked && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  <span
                    className={`text-sm font-medium min-w-[20px] ${isChecked
                      ? theme === "light"
                        ? "text-blue-600"
                        : "text-blue-400"
                      : theme === "light"
                        ? "text-gray-500"
                        : "text-gray-400"
                      }`}
                  >
                    {String.fromCharCode(97 + i).toUpperCase()}.
                  </span>

                  <input
                    className={`${inputCommon} flex-1 py-1.5 px-2 rounded border transition-colors ${isChecked
                      ? theme === "light"
                        ? "bg-blue-50/50 border-blue-200"
                        : "bg-blue-900/10 border-blue-700"
                      : theme === "light"
                        ? "bg-gray-50 border-gray-200 focus:border-blue-400"
                        : "bg-gray-700 border-gray-600 focus:border-blue-500"
                      }`}
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleOptionsChange(i, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        )}
        <select
          className={inputCommon}
          value={bloomLevel}
          onChange={(e) => setBloomLevel(e.target.value)}
        >
          <option value="Remember">Remember</option>
          <option value="Understand">Understand</option>
          <option value="Apply">Apply</option>
          <option value="Analyze">Analyze</option>
          <option value="Evaluate">Evaluate</option>
          <option value="Create">Create</option>
        </select>

        {/* Correct Option(s) */}
        {/* {form.type === "mcq" && (
        <input
          className={inputCommon}
          type="number"
          name="correct_option"
          value={form.correct_option}
          onChange={handleChange}
          placeholder="Correct Option Index (0-based)"
          min={0}
          max={form.options.length - 1}
        />
      )} */}

        {/* {form.type === "msq" && (
        <input
          className={inputCommon}
          placeholder="Correct Option Indexes (comma-separated)"
          onChange={(e) => {
            const values = e.target.value
              .split(",")
              .map((v) => parseInt(v.trim()))
              .filter((v) => !isNaN(v));
            setForm((prev) => ({ ...prev, correct_options: values }));
          }}
        />
      )} */}

        {/* Fill / Numerical Answer */}
        {(form.type === "fill" || form.type === "numerical") && (
          <input
            className={inputCommon}
            name="correct_answer"
            value={form.correct_answer}
            onChange={handleChange}
            placeholder="Correct Answer"
          />
        )}

        {/* True / False */}
        {form.type === "tf" && (
          <select
            className={inputCommon}
            name="is_true"
            value={form.is_true}
            onChange={handleChange}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        )}

        {/* Match the Following */}
        {form.type === "match" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Enter <strong>Left</strong> and <strong>Right</strong> items at the
              same index for pairing.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LabelCommon}>Left Items</label>
                {form.left_items.map((item, i) => (
                  <input
                    key={i}
                    className={inputCommon}
                    placeholder={`Left ${i + 1}`}
                    value={item}
                    onChange={(e) => {
                      const updated = [...form.left_items];
                      updated[i] = e.target.value;
                      setForm((prev) => ({ ...prev, left_items: updated }));
                    }}
                  />
                ))}
              </div>
              <div>
                <label className={LabelCommon}>Right Items</label>
                {form.right_items.map((item, i) => (
                  <input
                    key={i}
                    className={inputCommon}
                    placeholder={`Right ${i + 1}`}
                    value={item}
                    onChange={(e) => {
                      const updated = [...form.right_items];
                      updated[i] = e.target.value;
                      setForm((prev) => ({ ...prev, right_items: updated }));
                    }}
                  />
                ))}
              </div>
            </div>
            <input
              className={inputCommon}
              placeholder='Correct Pairs (e.g., {"India":"New Delhi"})'
              value={form.correct_pairs_input}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  correct_pairs_input: e.target.value,
                }))
              }
            />
            <button
              type="button"
              onClick={() => {
                const pairs = {};
                form.left_items.forEach((left, i) => {
                  const right = form.right_items[i];
                  if (left && right) pairs[left] = right;
                });
                setForm((prev) => ({
                  ...prev,
                  correct_pairs_input: JSON.stringify(pairs, null, 2),
                }));
              }}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm transition"
            >
              Auto-generate Correct Pairs
            </button>
          </div>
        )}

        {form.type === "code" && (
          <div
            className={` border rounded p-4 space-y-3  ${theme == "light" ? "bg-white" : "bg-gray-700"
              } `}
          >
            <h3
              className={`text-lg font-medium mb-2  ${theme == "light" ? "text-black" : "text-gray-100"
                }`}
            >
              Code Question Builder
            </h3>
            <CodeCreatorForm setFormData={setCodeData} formData={codeData} />
          </div>
        )}

        {form.type === "comprehension" && (
          <>
            {/* Comprehension Passage */}
            <textarea
              className={inputCommon}
              rows={4}
              placeholder="Enter comprehension passage"
              value={form.passage}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, passage: e.target.value }))
              }
            />

            <input
              className={inputCommon}
              placeholder="Positive Marks"
              type="number"
              value={form.sub_form.positive_marks}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  sub_form: {
                    ...prev.sub_form,
                    positive_marks: parseInt(e.target.value),
                  },
                }))
              }
            />

            <input
              className={inputCommon}
              placeholder="Negative Marks"
              type="number"
              value={form.sub_form.negative_marks}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  sub_form: {
                    ...prev.sub_form,
                    negative_marks: parseInt(e.target.value),
                  },
                }))
              }
            />

            {/* Sub-question builder */}
            <div
              className={` border rounded p-4 space-y-3 ${theme === "light"
                ? "bg-gray-100"
                : "bg-gray-800 border border-gray-700"
                }`}
            >
              <h4
                className={` font-semibold ${theme === "light" ? "text-black" : "text-gray-300"
                  }`}
              >
                Add Sub-questions
              </h4>

              <select
                className={inputCommon}
                value={form.sub_form.type}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    sub_form: { ...prev.sub_form, type: e.target.value },
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
                className={inputCommon}
                placeholder="Sub-question text"
                value={form.sub_form.question_text}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    sub_form: { ...prev.sub_form, question_text: e.target.value },
                  }))
                }
              />

              {/* Options */}
          {(form.sub_form.type === "mcq" || form.sub_form.type === "msq") &&
  form.sub_form.options.map((opt, i) => {
    const isChecked =
      form.sub_form.type === "mcq"
        ? form.sub_form.correct_option === i
        : form.sub_form.correct_options.includes(i);

    const handleCheckChange = () => {
      if (form.sub_form.type === "mcq") {
        // Only one correct option
        setForm((prev) => ({
          ...prev,
          sub_form: {
            ...prev.sub_form,
            correct_option: i,
          },
        }));
      } else {
        // MSQ: multiple correct options
        const current = form.sub_form.correct_options || [];
        if (current.includes(i)) {
          // Remove this option
          setForm((prev) => ({
            ...prev,
            sub_form: {
              ...prev.sub_form,
              correct_options: current.filter((val) => val !== i),
            },
          }));
        } else {
          // Add this option
          setForm((prev) => ({
            ...prev,
            sub_form: {
              ...prev.sub_form,
              correct_options: [...current, i],
            },
          }));
        }
      }
    };

    return (
      <div key={i} className="flex items-center space-x-2">
        {form.sub_form.type === "mcq" ? (
          <input
            type="radio"
            name="correct-option"
            checked={isChecked}
            onChange={handleCheckChange}
          />
        ) : (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckChange}
          />
        )}
        <input
          className={inputCommon}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => {
            const updated = [...form.sub_form.options];
            updated[i] = e.target.value;
            setForm((prev) => ({
              ...prev,
              sub_form: { ...prev.sub_form, options: updated },
            }));
          }}
        />
      </div>
    );
  })}


              {/* MCQ correct index */}
              {/* {form.sub_form.type === "mcq" && (
              <input
                type="number"
                className={inputCommon}
                placeholder="Correct option index (0-based)"
                value={form.sub_form.correct_option}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    sub_form: {
                      ...prev.sub_form,
                      correct_option: parseInt(e.target.value),
                    },
                  }))
                }
              />
            )} */}

              {/* MSQ correct options */}
              {/* {form.sub_form.type === "msq" && (
              <input
                className={inputCommon}
                placeholder="Correct options (comma-separated)"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    sub_form: {
                      ...prev.sub_form,
                      correct_options: e.target.value
                        .split(",")
                        .map((val) => parseInt(val.trim())),
                    },
                  }))
                }
              />
            )} */}

              {/* Fill / Numerical */}
              {(form.sub_form.type === "fill" ||
                form.sub_form.type === "numerical") && (
                  <input
                    className={inputCommon}
                    placeholder="Correct answer"
                    value={form.sub_form.correct_answer}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        sub_form: {
                          ...prev.sub_form,
                          correct_answer: e.target.value,
                        },
                      }))
                    }
                  />
                )}

              {/* True/False */}
              {form.sub_form.type === "tf" && (
                <select
                  className={inputCommon}
                  value={form.sub_form.is_true}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      sub_form: {
                        ...prev.sub_form,
                        is_true: e.target.value === "true",
                      },
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

                   const currentSubForm = form.sub_form;

    // Debug: log the correct answer depending on question type
    if (currentSubForm.type === "mcq") {
      console.log("Adding MCQ - Correct option index:", currentSubForm.correct_option);
      console.log("Correct answer text:", currentSubForm.options[currentSubForm.correct_option]);
    } else if (currentSubForm.type === "msq") {
      console.log("Adding MSQ - Correct options indices:", currentSubForm.correct_options);
      console.log(
        "Correct answers text:",
        currentSubForm.correct_options.map((i) => currentSubForm.options[i])
      );
    } else if (currentSubForm.type === "fill" || currentSubForm.type === "numerical") {
      console.log("Correct answer:", currentSubForm.correct_answer);
    } else if (currentSubForm.type === "tf") {
      console.log("Correct answer (True/False):", currentSubForm.is_true);
    }
                  setForm((prev) => ({
                    ...prev,
                    sub_question_ids: [
                      ...prev.sub_question_ids,
                      { ...prev.sub_form, id: uuidv4() },
                    ],
                    sub_form: {
                      type: "mcq",
                      question_text: "",
                      options: ["", "", "", ""],
                      correct_option: 0,
                      correct_options: [],
                      correct_answer: "",
                      is_true: true,
                      explanation: "",
                      difficulty: "easy",
                      positive_marks: "",
                      negative_marks: "0",
                      subject: "",
                      chapter: "",
                    },
                  }));
                }}
              >
                Add Sub-question
              </button>
              {/* Preview sub-questions */}
              {form.sub_question_ids.length > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  <strong>Sub-questions added:</strong>{" "}
                  {form.sub_question_ids.length}
                </div>
              )}
            </div>
          </>
        )}

        {/* Subject, Chapter, Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className={inputCommon}
            name="subject"
            value={form.subject}
            onChange={handleChange}
          >
            <option value="">-- Select Subject --</option>
            {Array.isArray(examDetails?.subjects) &&
              examDetails.subjects.map((subj, idx) => (
                <option key={idx} value={subj}>
                  {subj}
                </option>
              ))}
          </select>

          <input
            className={inputCommon}
            name="chapter"
            value={form.chapter}
            onChange={handleChange}
            placeholder="Chapter"
          />
        </div>

        <textarea
          className={inputCommon}
          name="explanation"
          value={form.explanation}
          onChange={handleChange}
          rows={2}
          placeholder="Explanation (optional)"
        />

        {/* Difficulty & Marks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className={inputCommon}
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
              className={inputCommon}
              name="positive_marks"
              value={form.positive_marks}
              onChange={handleChange}
              placeholder="Positive Marks"
              min={1}
            />
            <input
              type="number"
              className={inputCommon}
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
      {/* <ToastContainer
        toasts={toasts}
        onRemove={removeToast}

      /> */}
    </>
  );
};

export default ManualQuestionForm;
