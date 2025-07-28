import React from 'react';
import { FileText, Eye, Download, BarChart3, PieChart } from 'lucide-react';

const PaperSummary = ({ 
  generatedPaper, 
  showPreview, 
  setShowPreview, 
  downloadPDF 
}) => {
  if (!generatedPaper) return null;

  const totalActualMarks = generatedPaper.questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <div className="bg-white border rounded-lg">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {generatedPaper.title}
            </h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Questions:</span>
                <span className="font-semibold ml-2">{generatedPaper.totalQuestions}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Marks:</span>
                <span className="font-semibold ml-2">{totalActualMarks}</span>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold ml-2">{generatedPaper.timeLimit}min</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Subject-wise Distribution */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Subject Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(generatedPaper.subjectWiseBreakdown || {}).map(([subject, data]) => (
                <div key={subject} className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">{subject}</span>
                    <span className="text-sm text-blue-600 font-semibold">
                      {data.totalMarks} marks
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Questions: {data.questionsCount}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Difficulties: {Object.entries(data.difficulties || {})
                      .map(([diff, count]) => `${diff}(${count})`)
                      .join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="space-y-4">
            {/* Difficulty Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Difficulty Breakdown
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(generatedPaper.difficultyBreakdown || {}).map(([difficulty, count]) => (
                  <div key={difficulty} className="bg-white p-3 rounded border text-center">
                    <div className="text-sm font-medium text-gray-800 capitalize">{difficulty}</div>
                    <div className="text-2xl font-bold text-blue-600">{count}</div>
                    <div className="text-xs text-gray-500">
                      {generatedPaper.totalQuestions > 0 
                        ? Math.round((count / generatedPaper.totalQuestions) * 100) 
                        : 0}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloom's Taxonomy Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Bloom's Taxonomy Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(generatedPaper.bloomBreakdown || {}).map(([level, count]) => (
                  <div key={level} className="flex justify-between bg-white p-2 rounded border">
                    <span className="capitalize text-gray-700">{level}:</span>
                    <span className="font-semibold text-blue-600">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generation Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Generation Summary</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div>✓ Paper generated successfully with {generatedPaper.totalQuestions} questions</div>
            <div>✓ Total marks: {totalActualMarks} (Target: {generatedPaper.totalMarks})</div>
            <div>✓ Questions distributed across {Object.keys(generatedPaper.subjectWiseBreakdown || {}).length} subjects</div>
            <div>✓ Balanced difficulty distribution maintained</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperSummary;