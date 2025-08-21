import { Award, Clock } from "lucide-react";

const ResultsOverview = ({studentsData}) => {
  console.log("Results Overview Data:", studentsData);
  const evaluatedCount = studentsData.filter(s => s.evaluated).length;
  const totalStudents = studentsData.length;
  const canPublish = evaluatedCount === totalStudents;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluation Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{evaluatedCount}</div>
          <div className="text-sm text-gray-600">Evaluated</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{totalStudents - evaluatedCount}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalStudents}</div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
      </div>
      
      {canPublish ? (
        <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
          <Award className="w-5 h-5 mr-2" />
          Publish Results
        </button>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Complete all evaluations to publish results</p>
        </div>
      )}
    </div>
  );
};

export default ResultsOverview;