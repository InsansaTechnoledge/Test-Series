import React from 'react';
import { 
  Award, 
  BookOpen, 
  BookOpenCheck, 
  Hexagon, 
  Mail, 
  Medal, 
  NotepadText, 
  Phone, 
  UsersRound 
} from 'lucide-react';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useState } from 'react';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';

const subjects = ["Physics", "Chemistry", "Maths", "English", "Computer science"];

export default function StudentDetails() {
    const {user}=useUser();
    const [student,setStudent]=useState(user);
    const {batchMap}=useCachedBatches();
    const studentBatch=batchMap[user?.batchId];

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl  overflow-hidden">

      <div className="p-1 bg-gradient-to-r from-blue-300 to-blue-600"></div>
      
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
        {/* Student Profile Section */}
        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <img 
              src={student.profilePhoto}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-indigo-100 shadow-md"
            />
          </div>
          
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900">{student.name}</h1>
            
            <div className="space-y-2 sm:space-y-3 text-gray-700">
              <div className="flex sm:flex-row items-center sm:items-center gap-3 sm:gap-3">
                <Mail size={18} className="text-blue-600" />
                <span className="text-sm sm:text-base break-all">{student.email}</span>
              </div>
              
              <div className="flex  sm:flex-row items-center sm:items-center gap-3 sm:gap-3">
                
                <Phone size={18} className="text-blue-600" />
                <span className="text-sm sm:text-base">{student.phone}</span>
              </div>
              
              {
                student.certifications && student.certifications.length > 0 ? (
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {student.certifications.map((cert, idx) => (
                        <span
                            key={idx}
                            className="text-xs font-medium bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full"
                        >
                            {cert}
                        </span>
                        ))}
                    </div>
                    </div>
                ) : (
                    <div>
                    <h1 className="text-sm text-gray-500 italic">No certifications at present</h1>
                    </div>
                )

                }
            </div>
          </div>
        </div>
        
        {/* Divider visible on all screen sizes */}
        <div className="h-px w-full bg-gray-200 md:hidden"></div>
        
        {/* Batch Details Section */}
        <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">{studentBatch?.name}</h2>
            <p className="text-base sm:text-lg font-medium text-blue-700">{studentBatch?.year}</p>
          </div>
          
          <div className="space-y-2 sm:space-y-3 text-gray-700">
            <div className="flex  sm:flex-row items-center sm:items-start gap-3 sm:gap-3">
              <BookOpen size={18} className="text-blue-600 sm:mt-2" />
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {studentBatch?.subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-blue-100 text-blue-800 px-2 sm:px-3 py-3 rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex sm:flex-row items-center sm:items-center gap-1 sm:gap-3 pt-1">
              <NotepadText size={18} className="text-blue-600" />
              <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-800 hover:text-white transition-colors"
              onClick={() => {
                // Add your logic to view syllabus here
                console.log("View Syllabus clicked");
              }}>
                {studentBatch?.syllabus ? "View Syllabus" : "Syllabus not added yet"}

              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}