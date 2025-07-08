import React from "react";
import { useNavigate } from "react-router-dom";

const ContestResultComponent = ({ problems = [], studentResult, theme }) => {
    const navigate = useNavigate();
    
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
        <div className={`mt-12 py-12 max-w-4xl mx-auto rounded-xl shadow-lg border min-h-screen ${
            theme === 'light' 
                ? 'bg-white border-gray-200' 
                : 'bg-gray-950 border-gray-800'
        }`}>
            <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className={`text-2xl font-bold mb-2 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                        Contest Results
                    </h2>
                    <div className={`w-16 h-1 mx-auto rounded-full ${
                        theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'
                    }`}></div>
                </div>

                <div className="space-y-4 mb-8">
                    {mergedResults.map((res, i) => (
                        <div key={i} className={`flex justify-between items-center py-4 px-6 rounded-lg transition-colors ${
                            theme === 'light' 
                                ? 'bg-gray-50 hover:bg-gray-100' 
                                : 'bg-gray-900 hover:bg-gray-800'
                        }`}>
                            <span className={`font-medium ${
                                theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                            }`}>
                                {res.title}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className={`text-lg font-semibold ${
                                    theme === 'light' ? 'text-gray-900' : 'text-white'
                                }`}>
                                    {res.obtained}
                                </span>
                                <span className={`text-sm ${
                                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                    / {res.maxScore}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`border-t pt-6 ${
                    theme === 'light' ? 'border-gray-200' : 'border-gray-800'
                }`}>
                    <div className="text-center space-y-4">
                        <div className={`text-xl font-bold ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                            Total Score: {totalObtained} / {totalMarks}
                        </div>
                        <div className={`text-lg font-semibold ${
                            theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                        }`}>
                            Percentage: {percentage}%
                        </div>
                        <div className={`w-full rounded-full h-3 ${
                            theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                        }`}>
                            <div 
                                className={`h-3 rounded-full transition-all duration-500 ${
                                    theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate("/")}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                            theme === 'light' 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200' 
                                : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg hover:shadow-indigo-900/30'
                        }`}
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContestResultComponent;