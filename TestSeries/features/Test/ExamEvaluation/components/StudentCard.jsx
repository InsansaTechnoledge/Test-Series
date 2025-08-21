import { CheckCircle, ChevronRight, Clock, UserRoundX } from "lucide-react";

const StudentCard = ({ student, onSelect, result }) => (
  <div
    className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
    onClick={() => {
      result ? onSelect(student) : null
    }}
  >
    <div className="flex items-center space-x-4">
      <img 
        src={student.profilePhoto} 
        alt={student.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{student.name}</h3>
        {/* <p className="text-sm text-gray-600">Roll No: {student.rollNo}</p> */}
      </div>
      {console.log("Student Result:", result)}
      {result ? (<div className="flex items-center space-x-2">
        {result?.evaluated ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-700">{result.marks}/100</span>
          </>
        ) : (
          <>
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-yellow-700">Pending</span>
          </>
        )}
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>)
      :(
        <div className="flex items-center space-x-2">
          <UserRoundX className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-700">Student had not appeared in the exam</span>
        </div>
      )}

    </div>
  </div>
);

export default StudentCard;