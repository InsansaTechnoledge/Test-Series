
import { CheckCircle, ChevronRight, Clock, UserRoundX, Save } from "lucide-react";

const StudentCard = ({ student, onSelect, result, status, theme = "light" }) => (
  <div
    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
      theme === 'dark' 
        ? 'border-gray-700 bg-gray-800 hover:border-gray-600' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}
    onClick={() => {
      if (!result) return; // Prevent selection if no result
      onSelect(student);
    }}
  >
    <div className="flex items-center space-x-4">
      <img 
        src={student.profilePhoto} 
        alt={student.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {student.name}
        </h3>
        {/* <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Roll No: {student.rollNo}
        </p> */}
      </div>

      {result ? (
        <div className="flex items-center space-x-2">
          {status === 'locked' ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                Completed
              </span>
            </>
          ) : status === 'unsaved-changes' ? (
            <>
              <Save className="w-5 h-5 text-yellow-500" />
              <span className={`text-sm ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                Unsaved
              </span>
            </>
          ) : (
            <>
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className={`text-sm ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                Pending
              </span>
            </>
          )}
          <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <UserRoundX className="w-5 h-5 text-red-500" />
          <span className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
            Did not appear
          </span>
        </div>
      )}
    </div>
  </div>
);

export default StudentCard;