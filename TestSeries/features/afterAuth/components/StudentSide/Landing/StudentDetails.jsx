import {
  BookOpen,
  Mail,
  NotepadText,
  Phone,
} from 'lucide-react';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useEffect, useState } from 'react';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../../../../../hooks/useTheme"

export default function StudentDetails() {
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

  return (

    <div className={` transition-colors duration-300`}>
      <div className="p-6">
        <div className={`max-w-sm rounded-3xl overflow-hidden shadow-2xl backdrop-blur-lg transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 ${theme === 'light'
            ? 'bg-white/95 border border-gray-200/50'
            : 'bg-gray-800/95 border border-gray-700/50'
          }`}>

          {/* Gradient Background */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-200 opacity-10"></div>

            {/* Profile Content */}
            <div className="relative p-4">
              {/* Profile Photo and Name */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">

                  <div className="relative p-1 bg-gradient-to-r from-indigo-400 to-indigo-800 rounded-full">
                    <img
                      src={student.profilePhoto}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-2 border-white shadow-xl object-cover"
                    />
                  </div>

                </div>

                <h2 className={`text-2xl font-bold mb-2 transition-all duration-300 ${theme === 'light'
                    ? 'text-gray-900 '
                    : 'text-gray-300'
                  }`}>
                  {student.name}
                </h2>

                <div className={`px-4 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${theme === 'light'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-blue-900/50 text-blue-300 border border-blue-700'
                  }`}>
                  Student Profile
                </div>
              </div>

              {/* Contact Information - Side by Side with labels underneath */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Email Section */}
                <div className={`group p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:rotate-1 ${theme === 'light'
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200'
                    : 'bg-gradient-to-br from-blue-900/30 to-blue-800/30 hover:from-blue-800/40 hover:to-blue-700/40 border border-blue-700/50'
                  }`}>
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`p-3 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 ${theme === 'light'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700'
                      }`}>
                      <Mail size={18} className="text-white" />
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${theme === 'light'
                          ? 'text-blue-700'
                          : 'text-blue-300'
                        }`}>
                        Email
                      </p>
                      <p className={`text-xs font-medium break-all transition-colors duration-300 ${theme === 'light'
                          ? 'text-gray-600'
                          : 'text-gray-400'
                        }`}>
                        {student.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone Section */}
                <div className={`group p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:-rotate-1 ${theme === 'light'
                    ? 'bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200'
                    : 'bg-gradient-to-br from-green-900/30 to-green-800/30 hover:from-green-800/40 hover:to-green-700/40 border border-green-700/50'
                  }`}>
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`p-3 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 ${theme === 'light'
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-green-600 to-green-700'
                      }`}>
                      <Phone size={18} className="text-white" />
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${theme === 'light'
                          ? 'text-green-700'
                          : 'text-green-300'
                        }`}>
                        Phone
                      </p>
                      <p className={`text-xs font-medium transition-colors duration-300 ${theme === 'light'
                          ? 'text-gray-600'
                          : 'text-gray-400'
                        }`}>
                        {student.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>









  );
}