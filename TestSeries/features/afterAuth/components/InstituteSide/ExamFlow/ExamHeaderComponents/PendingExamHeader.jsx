import { Trash } from 'lucide-react';
import React, { useState } from 'react';
import DeleteExamModal from '../components/DeleteExamModal';

const PendingExamHeader = ({ theme, pendingExams, setShowDeleteModal, showDeleteModal }) => {

  console.log("ed", pendingExams)
  
  const [selectedExamId, setSelectedExamId] = useState(null);

  const openDelete = (id) => {
    console.log("eds", id)

    setSelectedExamId(id);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setSelectedExamId(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto mb-8 transform hover:scale-105 transition-all duration-300">
      {!pendingExams || pendingExams.length === 0 ? (
        <div
          className={`backdrop-blur-md rounded-xl p-6 shadow-xl ${
            theme === 'light' ? 'bg-white/50 border border-indigo-200' : 'bg-gray-800/80 border border-gray-600'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/50'
              }`}
            >
              <svg
                className={`w-6 h-6 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className={`font-semibold ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-300'}`}>
              No pending exams found for this organization.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`backdrop-blur-md rounded-xl p-6 shadow-xl ${
            theme === 'light' ? 'bg-white/50 border border-indigo-200' : 'bg-gray-800/80 border border-gray-600'
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/50'
              }`}
            >
              <svg
                className={`w-6 h-6 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-indigo-900' : 'text-indigo-300'}`}>
              You have {pendingExams.length} exam{pendingExams.length !== 1 ? 's' : ''} pending (complete or delete them)
            </h2>
          </div>

          <ul className="space-y-2">
            {pendingExams.map((exam, index) => (
              <li key={exam?.id || `exam-${index}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <span className={`font-medium ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-300'}`}>
                  {exam?.name || `Unnamed Exam ${index + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => openDelete(exam?.id)}
                  className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
                  aria-label={`Delete exam: ${exam?.name || `Unnamed Exam ${index + 1}`}`}
                  title="Delete exam"
                  disabled={!exam?.id}
                >
                  <Trash className="w-5 h-5 text-red-500 group-hover:text-red-600 group-hover:scale-110 transition-all duration-200" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

       {/* Render modal when needed */}
       {showDeleteModal && selectedExamId && (
            <DeleteExamModal 
              examId={selectedExamId} 
              setShowDeleteModal={closeModal}
              onClose={closeModal}
            />
        )}
    </div>
  );
};

export default PendingExamHeader;