import { Award, Clock } from "lucide-react";

const ResultsOverview = ({ studentsData, handlePublishResult, status, theme = "light" }) => {
  console.log("Results Overview Data:", studentsData);
  const evaluatedCount = studentsData.filter(s => s.evaluated).length;
  const totalStudents = studentsData.length;
  const canPublish = evaluatedCount === totalStudents;

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 transition-colors duration-200`}>
      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
        Evaluation Overview
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`text-center p-4 rounded-lg transition-colors duration-200 ${
          theme === 'dark' ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'
        }`}>
          <div className="text-2xl font-bold text-blue-600">{evaluatedCount}</div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Evaluated</div>
        </div>
        <div className={`text-center p-4 rounded-lg transition-colors duration-200 ${
          theme === 'dark' ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-50'
        }`}>
          <div className="text-2xl font-bold text-yellow-600">{totalStudents - evaluatedCount}</div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Pending</div>
        </div>
        <div className={`text-center p-4 rounded-lg transition-colors duration-200 ${
          theme === 'dark' ? 'bg-green-900 bg-opacity-30' : 'bg-green-50'
        }`}>
          <div className="text-2xl font-bold text-green-600">{totalStudents}</div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</div>
        </div>
      </div>
      
      {canPublish ? (
        <button 
          className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
            status === 'published' 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
          disabled={!canPublish || status === 'published'}
          onClick={handlePublishResult}
        >
          <Award className="w-5 h-5 mr-2" />
          {status === 'published' ? "Results Published" : "Publish Results"}
        </button>
      ) : (
        <div className={`text-center p-4 rounded-lg transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <Clock className={`w-8 h-8 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Complete all evaluations to publish results
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultsOverview;