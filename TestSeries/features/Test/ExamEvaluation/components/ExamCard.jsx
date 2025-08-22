import { ChevronRight } from "lucide-react";

const ExamCard = ({ exam, onSelect }) => {
  // const progress = (exam.evaluatedCount / exam.totalStudents) * 100;
  
  return (
    <div 
      className="p-6 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
      onClick={() => {
        if(exam.status === 'live' || exam.status === 'published') {
          onSelect(exam);
        }
        return;
      }}
    >
      {console.log("Exam Card Data:", exam)}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-600">Date: {exam.date} | Duration: {exam.duration}</p>
            <p className="text-sm text-gray-600">Total Marks: {exam.total_Marks}</p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {/* Progress: {exam.evaluatedCount}/{exam.totalStudents} */}
              </span>
              <div className="flex-1 max-w-32">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    // style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            exam.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : (exam.status === 'live' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800')
          }`}>
            {exam.status === 'published' ? 'Published' : (exam.status === 'live' ? 'Ongoing' : 'Upcoming')}
          </span>
          {(exam.status === 'live' || exam.status === 'published') && (<ChevronRight className="w-5 h-5 text-gray-400 mt-2" />)}
        </div>
      </div>
    </div>
  );
};

export default ExamCard;