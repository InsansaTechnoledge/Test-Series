import React from 'react'
import { useUser } from '../../../../../contexts/currentUserContext';
import { useEffect, useState } from 'react';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../../../../../hooks/useTheme"

const Certificates = () => {
    const { user } = useUser();
    const [student, setStudent] = useState(user);
    const { batchMap } = useCachedBatches();
    const navigate = useNavigate();
    const { theme } = useTheme()
    useEffect(() => {
      if (user) {
        setStudent(user);
      }
    }, [user])
  return (


    <div className={`transition-all duration-500 rounded-xl ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      } rounded-xl border ${
        theme === 'light' ? 'border-gray-200' : 'border-gray-700'
      } shadow-lg hover:shadow-xl p-6`}>
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          
          <h3 className={`text-lg font-semibold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Certifications
          </h3>
        </div>
  
        {/* Certifications Content */}
        {student.certifications && student.certifications.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {student.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-md ${
                    theme === 'light' 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300' 
                      : 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-700 hover:border-blue-600'
                  }`}
                >
                  {/* Certificate Card */}
                  <div className="px-4 py-3 relative">
                    {/* Decorative corner */}
                    <div className={`absolute top-0 right-0 w-3 h-3 ${
                      theme === 'light' ? 'bg-blue-400' : 'bg-blue-500'
                    } rounded-bl-full opacity-20`}></div>
                    
                    {/* Certificate Icon */}
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'
                      } animate-pulse`}></div>
                      <span className={`text-sm font-medium ${
                        theme === 'light' ? 'text-blue-800' : 'text-blue-200'
                      } group-hover:text-blue-600 transition-colors`}>
                        {cert}
                      </span>
                    </div>
                    
                    {/* Hover effect border */}
                    <div className={`absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 transition-all duration-300 ${
                      theme === 'light' ? 'group-hover:border-blue-400' : 'group-hover:border-blue-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Stats */}
            <div className={`flex items-center gap-2 pt-2 border-t ${
              theme === 'light' ? 'border-gray-200' : 'border-gray-700'
            }`}>
              <span className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Total Certifications:
              </span>
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                theme === 'light' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-green-900/30 text-green-400'
              }`}>
                {student.certifications.length}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
            }`}>
              <svg className={`w-8 h-8 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className={`text-lg font-medium mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              No Certifications Yet
            </h4>
            <p className={`text-sm italic ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              No certifications at present
            </p>
          </div>
        )}
      </div>
  )
}

export default Certificates
