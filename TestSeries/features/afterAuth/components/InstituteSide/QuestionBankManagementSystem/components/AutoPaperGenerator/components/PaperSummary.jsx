import { BarChart3, Download, Eye, PieChart } from 'lucide-react';
import React from 'react'

const PaperSummary = ({ generatedPaper, showPreview, setShowPreview, downloadPDF }) => {
    if (!generatedPaper) return null;
  
    return (
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{generatedPaper.title}</h2>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-gray-600">Questions:</span> <span className="font-semibold ml-1">{generatedPaper.totalQuestions}</span></div>
                <div><span className="text-gray-600">Marks:</span> <span className="font-semibold ml-1">{generatedPaper.totalMarks}</span></div>
                <div><span className="text-gray-600">Time:</span> <span className="font-semibold ml-1">{generatedPaper.timeLimit}min</span></div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Generated on: {new Date(generatedPaper.generatedAt).toLocaleString()}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide' : 'Preview'}
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
  
        <div className="p-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                Subject Distribution
              </h3>
              <div className="space-y-2">
                {Object.entries(generatedPaper.subjectWiseBreakdown || {}).map(([subject, data]) => (
                  <div key={subject} className="bg-white p-2 rounded border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800 text-sm">{subject}</span>
                      <span className="text-xs text-blue-600 font-semibold">{data.totalMarks} marks</span>
                    </div>
                    <div className="text-xs text-gray-600">Questions: {data.questionsCount}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Difficulties: {Object.entries(data.difficulties || {}).map(([diff, count]) => `${diff}: ${count}`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="bg-gray-50 p-3 rounded">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                <PieChart className="w-4 h-4" />
                {generatedPaper.mode === 'bloom' ? 'Bloom Level Breakdown' : 'Difficulty Breakdown'}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {generatedPaper.mode === 'bloom' ? 
                  Object.entries(generatedPaper.bloomBreakdown || {}).map(([bloom, count]) => (
                    <div key={bloom} className="bg-white p-2 rounded border text-center">
                      <div className="text-xs font-medium text-gray-800 capitalize">{bloom}</div>
                      <div className="text-lg font-bold text-purple-600">{count}</div>
                      <div className="text-xs text-gray-500">
                        {generatedPaper.totalQuestions > 0 
                          ? Math.round((count / generatedPaper.totalQuestions) * 100) 
                          : 0}%
                      </div>
                    </div>
                  )) :
                  Object.entries(generatedPaper.difficultyBreakdown || {}).map(([difficulty, count]) => (
                    <div key={difficulty} className="bg-white p-2 rounded border text-center">
                      <div className="text-xs font-medium text-gray-800 capitalize">{difficulty}</div>
                      <div className="text-lg font-bold text-blue-600">{count}</div>
                      <div className="text-xs text-gray-500">
                        {generatedPaper.totalQuestions > 0 
                          ? Math.round((count / generatedPaper.totalQuestions) * 100) 
                          : 0}%
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default PaperSummary
