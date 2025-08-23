import { ChevronRight } from "lucide-react";

const ExamCard = ({ exam, onSelect, theme = "light" }) => {
  // const progress = (exam.evaluatedCount / exam.totalStudents) * 100;
  
  return (
    <div 
      className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 ${
        theme === 'dark' 
          ? 'border-gray-700 bg-gray-800 hover:border-gray-600' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
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
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {exam.name}
          </h3>
          <div className="mt-2 space-y-2">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Date: {exam.date} | Duration: {exam.duration}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Marks: {exam.total_Marks}
            </p>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {/* Progress: {exam.evaluatedCount}/{exam.totalStudents} */}
              </span>
              <div className="flex-1 max-w-32">
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
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
              : (exam.status === 'live' 
                ? 'bg-yellow-100 text-yellow-800' 
                : theme === 'dark' 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 text-gray-800')
          }`}>
            {exam.status === 'published' ? 'Published' : (exam.status === 'live' ? 'Ongoing' : 'Upcoming')}
          </span>
          {(exam.status === 'live' || exam.status === 'published') && (
            <ChevronRight className={`w-5 h-5 mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamCard;