import React, { useState } from 'react';
import { Plus, Trash2, Save, Code } from 'lucide-react';
import { saveContestQuestion } from '../../../../utils/services/contestQuestionService';
import CodeCreatorForm from './codeCreatorForm';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../../../../hooks/useTheme';
import { useEffect } from 'react';
import { fetchCodingQuestion, fetchCodingQuestions } from '../../../../utils/services/contestService';


export default function QuestionCreator() {

  const [searchParams] = useSearchParams();
  const contestId = searchParams.get("contestId");
  // const [formData, setFormData] = useState({
  //   title: '',
  //   difficulty: 'easy',
  //   prompt: '',
  //   input_format: '',
  //   output_format: '',
  //   sample_input: '',
  //   sample_output: '',
  //   test_cases: [
  //     { input: '', expected_output: '', explanation: '' }
  //   ],
  //   description: '',
  //   examples: [
  //     { input: '', output: '', explanation: '' }
  //   ],
  //   constraints: [''],
  //   starter_code: {
  //     javascript: '',
  //     python: '',
  //     java: '',
  //     cpp: ''
  //   }
  // });
  // const {theme} = useTheme()

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const questionData = formData;

  //   //have to add the contest id in the question data 

  //   questionData.contest_id = contestId;


  //   try {
  //     const response = await saveContestQuestion(questionData);

  //     if(response.status === 200) {
  //       alert("Question created successfully!");
  //       setFormData({
  //         title: '',
  //         difficulty: 'easy',
  //         prompt: '',
  //         input_format: '',
  //         output_format: '',
  //         sample_input: '',
  //         sample_output: '',
  //         test_cases: [{ input: '', expected_output: '', explanation: '' }],
  //         description: '',
  //         examples: [{ input: '', output: '', explanation: '' }],
  //         constraints: [''],
  //         starter_code: {
  //           javascript: '',
  //           python: '',
  //           java: '',
  //           cpp: ''
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.log("something went wrong while creating the contest questions!!", error);
  //     alert("Something went wrong!!!, try again later");
  //   }

  // };

 const [difficulty, setDifficulty] = useState("Easy");
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [fullDetails, setFullDetails] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [cache, setCache] = useState({});
  const [selectedId, setSelectedId] = useState(null);

 const fetchQuestions = async () => {
    if (cache[difficulty] && cache[difficulty][page]) {
      const cachedData = cache[difficulty][page];
      setQuestions(cachedData.data || []);
      setTotalPages(cachedData.totalPages || 1);
      return;
    }

    const res = await fetchCodingQuestions(difficulty, page, limit);
    const questionData = res?.data?.data || [];
    const totalPages = res?.data?.totalPages || 1;

    setQuestions(questionData);
    setTotalPages(totalPages);

    setCache((prev) => ({
      ...prev,
      [difficulty]: {
        ...(prev[difficulty] || {}),
        [page]: {
          data: questionData,
          totalPages,
        },
      },
    }));
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const fetchFullQuestion = async (id) => {
    const res = await fetchCodingQuestion(id);
    setFullDetails(res?.data || null);
  };

  useEffect(() => {
    setPage(1);
    fetchQuestions();
  }, [difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  const submitContest = async () => {
    
                // const payload = {
                //   contest_id: contestId,
                //   questions: selectedQuestions.map(({ id, marks }) => ({ question_id: id, marks }))
                // };
                const payload={
                  contestId: contestId,
                  questions:
                  selectedQuestions.map(({id, marks ,difficulty}) => ({ coding_question_id:id, marks ,difficulty}))
                }
                console.log("✅ Submit Contest Payload:", payload);
                const response = await saveContestQuestion(payload);
                if (response.status === 200) {
                  alert("Contest created successfully!");
                  setSelectedQuestions([]);
                  setFullDetails(null);
                }
                else {
                  alert("Failed to create contest. Please try again.");
                }
                

              
  }




  return (
    <>
      {/* <div className={`min-h-screen  ${theme == "light" ? "bg-white" :"bg-gray-700"}`}>
        <div className="container mx-auto px-4 py-8">
          <CodeCreatorForm
            setFormData={setFormData}
            formData={formData}
          />

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
              onClick={handleSubmit}
            >
              <Save className="w-5 h-5" />
              Create Question
            </button>
          </div>
        </div>
      </div > */}

     <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Contest Question</h1>

        <div className="mb-6 flex items-center gap-4">
          <label className="text-gray-700 font-medium">Choose Category:</label>
          <select
            className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions?.map((q) => (
            <div
              key={q.id}
              className="bg-white p-4 rounded-xl border shadow hover:shadow-md cursor-pointer transition"
              onClick={() => {
                setSelectedId(q.id);
                fetchFullQuestion(q.id);
              }}
            >
              <h3 className="font-semibold text-lg text-gray-800">{q.title}</h3>
              <p className="text-sm text-gray-500">Slug: {q.title_slug}</p>
              <span className="mt-1 inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                {q.difficulty}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={handlePrevious}
            disabled={page <= 1}
          >
            Previous
          </button>

          <span className="text-sm font-medium">Page {page} of {totalPages}</span>

          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={handleNext}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>

        {fullDetails && (
          <div className="mt-10 bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {fullDetails.title}
            </h2>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: fullDetails.content }}
            />
            <button
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => {
                const alreadyAdded = selectedQuestions.some((q) => q.id === fullDetails.id);
                if (!alreadyAdded) {
                  setSelectedQuestions((prev) => [
                    ...prev,
                    {
                      id: fullDetails.id,
                      title: fullDetails.title,
                      difficulty: fullDetails.difficulty,
                      marks: fullDetails.test_cases?.length,
                      test_cases: fullDetails.test_cases || [],
                    },
                  ]);
                }
              }}
            >
              ✅ Add to Contest
            </button>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3">📝 Selected Questions</h2>

          {selectedQuestions.length === 0 ? (
            <p className="text-gray-500">No questions selected yet.</p>
          ) : (
            <div className="space-y-4">
              {selectedQuestions.map((q, index) => (
                <div key={q.id} className="border p-4 rounded-md bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-bold">{index + 1}. {q.title}</h4>
                      <p className="text-sm text-gray-600">Difficulty: {q.difficulty}</p>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 text-sm"
                      onClick={() => setSelectedQuestions(prev => prev.filter(que => que.id !== q.id))}
                    >
                      ❌ Remove
                    </button>
                  </div>

                  <label className="text-sm text-gray-700">Marks:</label>
                  <input
                    type="number"
                    className="ml-2 border px-2 py-1 rounded w-24"
                    min={q.test_cases?.length || 1}
                    value={q.marks}
                    onChange={(e) => {
                      const updatedMarks = parseInt(e.target.value) || 0;
                      setSelectedQuestions(prev =>
                        prev.map(item =>
                          item.id === q.id ? { ...item, marks: updatedMarks } : item
                        )
                      );
                    }}
                  />

                  {q.test_cases?.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="mt-2 font-semibold">Test Case Distribution:</p>
                      <ul className="list-disc pl-5">
                        {q.test_cases.map((_, i) => {
                          const perCaseMark = (q.marks || 0) / q.test_cases.length;
                          return <li key={i}>Test Case {i + 1}: {perCaseMark.toFixed(2)} marks</li>;
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedQuestions.length > 0 && (
            <button
              className="mt-6 px-6 py-3 bg-blue-700 text-white rounded hover:bg-blue-800"
              onClick={submitContest}
            >
              🎯 Create Contest with {selectedQuestions.length} Questions
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  )


}