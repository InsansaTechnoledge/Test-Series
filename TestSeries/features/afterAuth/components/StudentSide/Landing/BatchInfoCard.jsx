import React from 'react'
import {
  BookOpen,
  Mail,
  NotepadText,
  Phone,
} from 'lucide-react';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useCachedUser } from '../../../../../hooks/useCachedUser';
import { useEffect, useState } from 'react';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../../../../../hooks/useTheme"
const BatchInfoCard = () => {
  const { user } = useUser();
  const [student, setStudent] = useState(user);
  const { batchMap } = useCachedBatches();
  const studentBatch = batchMap[user?.batch?.currentBatch];
  const navigate = useNavigate();
  const { theme } = useTheme()
  useEffect(() => {
    if (user) {
      setStudent(user);
    }
  }, [user])
  const { users } = useCachedUser();
  const [facultyData, setFacultyData] = useState([]);

  useEffect(() => {
    if (users) {
      setFacultyData(users);
    }
  }, [users]);
  return (


    <div className={`p-6 transition-all duration-500 `}>



      {/* Main Card */}
      <div className={`max-w-4xl  rounded-3xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${theme === 'light'
          ? 'bg-white border border-gray-200'
          : 'bg-gray-800 border border-gray-700'
        }`}>









        <div className={`p-8 ${theme === 'light'
            ? 'bg-white'
            : 'bg-gray-800'
          }`}>

          {/* Batch Name & Year */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
              {studentBatch?.name}
            </h1>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${theme === 'light'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-blue-900/30 text-blue-300 border border-blue-700'
              }`}>
              Academic Year: {studentBatch?.year}
            </div>
          </div>

          {/* Subjects Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'
              }`}>
              Subjects
            </h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {studentBatch?.subjects.slice(0, 4).map((subject, idx) => (
                  <span
                    key={idx}
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${theme === 'light'
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'bg-blue-900/50 text-blue-300 border border-blue-700 hover:bg-blue-900/70 '
                      }`}
                  >
                    {subject}
                  </span>
                ))}
                {studentBatch?.subjects.length > 4 && (
                  <button
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${theme === 'light'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    +{studentBatch?.subjects.length - 4} more
                  </button>
                )}
              </div>
              {studentBatch?.subjects.length > 4 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-gray-300">
                  {studentBatch?.subjects.slice(4).map((subject, idx) => (
                    <span
                      key={idx + 4}
                      className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${theme === 'light'
                          ? 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                          : 'bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700'
                        }`}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Syllabus Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                }`}>
                Course Syllabus
              </h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                {studentBatch?.syllabus_id ? "View detailed course curriculum and learning objectives" : "Syllabus will be available soon"}
              </p>
            </div>
            <button
              className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${theme === 'light'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
                } ${!studentBatch?.syllabus_id ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (studentBatch?.syllabus_id) {
                  navigate(`/syllabus/${studentBatch?.syllabus_id}`);
                }
              }}
              disabled={!studentBatch?.syllabus_id}
            >
              {studentBatch?.syllabus_id ? "View Syllabus" : "Coming Soon"}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-px ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
          }`}></div>

        {/* Faculty Section */}
        <div className="p-8">
          <h3 className={`text-xl font-semibold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
            Batch's Faculty
          </h3>
























          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facultyData.map((faculty, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${theme === 'light'
                    ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                  }`}
              >
                <img
                  src={faculty.profilePhoto}
                  alt={faculty.name}
                  className="w-16 h-16 rounded-xl object-cover shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-lg font-semibold truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                    {faculty.name}
                  </h4>
                  <p className={`text-sm mt-1 truncate ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                    }`}>
                    {faculty.email}
                  </p>
                </div>
              </div>
            ))}



          </div>
        </div>
      </div>
    </div>


  )
}

export default BatchInfoCard
