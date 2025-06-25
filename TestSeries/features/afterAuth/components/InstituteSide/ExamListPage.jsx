import React, { useState } from 'react';
import { Clock, Users, CheckCircle, PlayCircle, Loader2, BookOpen, CirclePause, Trash } from 'lucide-react';
import HeadingUtil from '../../utility/HeadingUtil';
import NeedHelpComponent from './components/NeedHelpComponent';
import usePendingExams from '../../../../hooks/useExamData';
import { useNavigate } from 'react-router-dom';
import DeleteExamModal from './ExamFlow/DeleteExamModal';
import { useExamManagement } from '../../../../hooks/UseExam';
import Banner from "../../../../assests/Institute/exam list.svg"
import { usePageAccess } from '../../../../contexts/PageAccessContext';
import { useTheme } from '../../../../hooks/useTheme';

// import Banner from "../../../../assests/Institute/exam list.svg"
const ExamListPage = () => {

   const canAccessPage  = usePageAccess();

   const {theme} = useTheme();
      
        if (!canAccessPage) {
          return (
            <div className="flex items-center justify-center">
              <div className={`text-center px-4 py-3 my-auto ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-200' 
                  : 'bg-red-100 text-gray-600'
              }`}>
                <h1 className={`text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>Access Denied</h1>
                <p>You do not have permission to view this page.</p>
              </div>
            </div>
          );
        }

  const [updatingId, setUpdatingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  
  const { pendingExams } = usePendingExams();
  const navigate = useNavigate();
  
  // Use the custom hook for all exam management
  const {
    exams,
    groupedExams,
    isLoading,
    error,
    goLive,
    deleteExam,
    isGoingLive,
    isDeleting
  } = useExamManagement();

  const handleGoLive = async (examId, currentGoLiveStatus) => {
    try {
      setUpdatingId(examId);
      
      // Call the go live mutation
      await goLive({ 
        examId, 
        goLive: !currentGoLiveStatus 
      });
    } catch (err) {
      console.error('❌ Failed to update exam status:', err);
      // Show error message to user
      alert(`Failed to ${currentGoLiveStatus ? 'pause' : 'activate'} exam. Please try again.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteExam = async (examId) => {
    try {
      await deleteExam(examId);
      setShowDeleteModal(false);
      setExamToDelete(null);
      // Success message could be shown here
      alert('Exam deleted successfully!');
    } catch (err) {
      console.error('❌ Failed to delete exam:', err);
      alert('Failed to delete exam. Please try again.');
    }
  };

  const handleAddQuestion = (examId) => {
    navigate(`/institute/create-exam/${examId}`);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center space-y-4">
          <div className="relative">
            <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto ${
              theme === 'dark'
                ? 'border-gray-700 border-t-indigo-600'
                : 'border-blue-200 border-t-blue-600'
            }`}></div>
            <BookOpen className={`w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              theme === 'dark' ? 'text-indigo-600' : 'text-blue-600'
            }`} />
          </div>
          <p className={`text-xl font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>Loading exams...</p>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>Please wait while we fetch your exam data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-red-100'
          }`}>
            <BookOpen className={`w-8 h-8 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`} />
          </div>
          <h3 className={`text-xl font-medium ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>Error Loading Exams</h3>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>Failed to fetch exam data. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : ''
    }`}>
   
    
<div className="relative overflow-hidden rounded-xl h-80 mt-3">
        {/* // Background Image */}
        <img
          src={Banner}
          alt="Upload Banner"
          className="absolute w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gray-900/60' 
            : 'bg-black/20'
        }`}></div>

        <div className="relative z-10 flex items-center justify-center h-full px-6 text-center w-full">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            List of Drafted Exams
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            this shows list of all the exams organization created batchwise
            </p>
          </div>
        </div>
      </div>
      <div className='mx-auto -mt-10 relative z-20 w-[90%]'>

      <NeedHelpComponent 
        heading="Want to Live your Exam ?" 
        about="schedule or immediatly live the exam" 
        question="can i revert live exam ?" 
        answer="yes, you can click on pause button to pause the exams (unless any user started it)" 
      />

      </div>

      {/* Main Content */}
    
  

<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  {Object.keys(groupedExams).length === 0 ? (
    <div className="flex flex-col items-center justify-center py-20">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md ${
        theme === 'dark' 
          ? 'bg-gray-800' 
          : 'bg-indigo-100'
      }`}>
        <BookOpen className={`w-10 h-10 ${
          theme === 'dark' ? 'text-indigo-600' : 'text-indigo-500'
        }`} />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${
        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
      }`}>No Exams Found</h3>
      <p className={`text-center ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Create your first exam to get started with managing assessments.
      </p>
    </div>
  ) : (
    <div className="space-y-10">
      {Object.entries(groupedExams).map(([batchName, batchExams]) => (
        <div key={batchName} className="space-y-5">
          {/* Batch Header */}
          <div className={`flex items-center space-x-3 pb-4 border-b px-2 py-2 rounded ${
            theme === 'dark'
              ? 'bg-indigo-400'
              : 'border-indigo-200 bg-indigo-600 text-white'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow ${
              theme === 'dark' ? 'bg-gray-100' : 'bg-indigo-100'
            }`}>
              <Users className={`w-4 h-4 ${
                theme === 'dark' ? 'text-indigo-600' : 'text-indigo-600'
              }`} />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-800' : ''}`}>{batchName}</h2>
              <p className="text-lg text-white">
                Year {batchExams[0]?.batch?.year || 'N/A'} • {batchExams.length} exam
              </p>
            </div>
          </div>

          {/* Exam Cards Grid */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {batchExams.map((exam) => (
    <div
      key={exam.id}
      className={`w-full max-w-md mx-auto rounded-2xl shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01] border-2 ${
        theme === 'dark'
          ? exam.go_live
            ? 'bg-gray-800 border-green-500 hover:shadow-green-500/20'
            : 'bg-gray-800 border-gray-600 hover:shadow-indigo-500/20'
          : exam.go_live
            ? 'bg-white border-green-300 hover:shadow-green-300'
            : 'bg-white border-indigo-200 hover:shadow-indigo-300'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4 p-4">
        <div
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
            exam.go_live
              ? theme === 'dark'
                ? 'bg-green-900 text-green-300 border border-green-500'
                : 'bg-green-100 text-green-800 border border-green-300'
              : theme === 'dark'
                ? 'bg-yellow-900 text-yellow-300 border border-yellow-600'
                : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
          }`}
        >
          {exam.go_live ? (
            <>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-ping"></div>
              LIVE
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 mr-1.5" />
              DRAFT
            </>
          )}
        </div>

        <button
          className={`transition-colors duration-200 p-1 ${
            theme === 'dark' ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
          }`}
          onClick={() => {
            setShowDeleteModal(true);
            setExamToDelete(exam.id);
          }}
          disabled={isDeleting}
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>

      {/* Exam Title */}
      <div className="px-4">
        <h3 className={`text-lg font-bold py-2 px-4 rounded-xl text-center mb-4 ${
          theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'
        }`}>
          {exam.name}
        </h3>

        {/* Exam Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Academic Year</span>
            <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
              {exam.batch?.year || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Status</span>
            <span className={`font-medium flex items-center space-x-1 ${
              exam.go_live
                ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              {exam.go_live ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>Active</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  <span>Pending</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`pt-3 border-t px-4 pb-5 ${
        theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
      }`}>
        {!exam.go_live ? (
          pendingExams.some((p) => p.id === exam.id) ? (
            <button
              onClick={() => handleAddQuestion(exam.id)}
              className="w-full py-2.5 px-4 rounded-full font-medium text-sm bg-green-600 text-white hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Add Questions
            </button>
          ) : (
            <button
              onClick={() => handleGoLive(exam.id, exam.go_live)}
              disabled={updatingId === exam.id}
              className={`w-full py-2.5 px-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition duration-200 ${
                updatingId === exam.id
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {updatingId === exam.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Activating...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Go Live</span>
                </>
              )}
            </button>
          )
        ) : (
          <div className="space-y-2">
            <div className={`w-full py-2 px-3 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 ${
              theme === 'dark'
                ? 'bg-green-800 border-green-500 text-green-300'
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              <CheckCircle className="w-4 h-4" />
              <span>Exam is Live</span>
            </div>
            <button
              onClick={() => handleGoLive(exam.id, exam.go_live)}
              disabled={updatingId === exam.id}
              className={`w-full py-2.5 px-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition duration-200 ${
                updatingId === exam.id
                  ? theme === 'dark'
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              <CirclePause className="w-4 h-4" />
              <span>Pause Exam</span>
            </button>
          </div>
        )}
      </div>
    </div>
  ))}
</div>

        </div>
      ))}
    </div>
  )}

  {showDeleteModal && (
    <DeleteExamModal
      examId={examToDelete}
      setShowDeleteModal={setShowDeleteModal}
      onDelete={handleDeleteExam}
    />
  )}
</div>


    </div>
  );
};

export default ExamListPage;