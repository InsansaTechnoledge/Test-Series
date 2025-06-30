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
  const [selectedQuestions, setSelectedQuestions] = useState({
    Easy: [],
    Medium: [],
    Hard: [],
  });
  const [cache, setCache] = useState({});
  const DIFFICULTIES = ["Easy", "Medium", "Hard"];


  const fetchQuestions = async () => {
    if (cache[difficulty] && cache[difficulty][page]) {
      setQuestions(cache[difficulty][page].data || []);
      setTotalPages(cache[difficulty][page].totalPages || 1);
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

  const fetchFullQuestion = async (id) => {
    const res = await fetchCodingQuestion(id);
    setFullDetails(res?.data || null);
  };

  const isSelected = (id) => {
    return selectedQuestions[difficulty].includes(id);
  };

  const handleToggleSelect = (id) => {
    setSelectedQuestions((prev) => {
      const currentList = prev[difficulty];
      const updatedList = currentList.includes(id)
        ? currentList.filter((qId) => qId !== id)
        : [...currentList, id];

      return {
        ...prev,
        [difficulty]: updatedList,
      };
    });
  };

  const handleCreateContest = () => {
    const allSelected = [...selectedQuestions.Easy, ...selectedQuestions.Medium, ...selectedQuestions.Hard];
    console.log("Submit to Contest:", { contestId, questionIds: allSelected });
    // 🔥 API call here to save contest questions
  };

  useEffect(() => {
    setPage(1);
    fetchQuestions();
  }, [difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [page]);




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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Contest Questions</h1>

        <div className="mb-4 flex items-center gap-4">
          <label className="text-gray-700 font-medium">Select Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Summary bar */}
        <div className="mb-6 p-4 rounded-xl bg-white shadow flex justify-between text-sm font-medium text-gray-700">
          {DIFFICULTIES.map((level) => (
            <span key={level}>
              {level}: {selectedQuestions[level].length}
            </span>
          ))}
          <button
            onClick={handleCreateContest}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Contest
          </button>
        </div>

        {/* Paginated list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className={`bg-white p-4 rounded-xl border shadow hover:shadow-md cursor-pointer transition`}
              onClick={() => fetchFullQuestion(q.id)}
            >
              <h3 className="font-semibold text-lg text-gray-800">{q.title}</h3>
              <p className="text-sm text-gray-500">Slug: {q.title_slug}</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                {q.difficulty}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Previous
          </button>
          <span className="text-sm font-medium">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>

        {/* Preview Panel */}
        {fullDetails && (
          <div className="mt-10 bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{fullDetails.title}</h2>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: fullDetails.content }}
            />
            <button
              onClick={() => handleToggleSelect(fullDetails.id)}
              className={`mt-6 px-4 py-2 rounded text-white ${
                isSelected(fullDetails.id) ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSelected(fullDetails.id) ? "❌ Remove from Contest" : "✅ Add to Contest"}
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  )


}