import React from "react";
import { useNavigate } from "react-router-dom";

const ContestResultComponent = ({ problems = [], studentResult }) => {
    const navigate=useNavigate();
  const resultMap = {};
  studentResult?.results?.forEach((r) => {
    resultMap[r.questionId] = r.obtainedMarks;
  });

  const mergedResults = problems.map((prob) => ({
    title: prob.title,
    maxScore: prob.maxScore || 0,
    obtained: resultMap[prob.id] ?? 0,
  }));

  const totalObtained = studentResult.totalObtainedMarks || 0;
  const totalMarks = studentResult.totalMarks || 0;
  const percentage = totalMarks > 0 ? ((totalObtained / totalMarks) * 100).toFixed(2) : 0;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Contest Results</h2>

      <div className="space-y-3">
        {mergedResults.map((res, i) => (
          <div key={i} className="flex justify-between border-b pb-2">
            <span className="text-gray-700 font-medium">{res.title}</span>
            <span className="text-gray-900">{res.obtained} / {res.maxScore}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <p className="text-lg font-semibold text-gray-700">
          Total Score: {totalObtained} / {totalMarks}
        </p>
        <p className="text-md text-blue-600 font-medium">Percentage: {percentage}%</p>
      </div>
      <>
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go home
      </button>
      </>
    </div>
  );
};

export default ContestResultComponent;
