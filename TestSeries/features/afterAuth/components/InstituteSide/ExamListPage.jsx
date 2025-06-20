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
// import Banner from "../../../../assests/Institute/exam list.svg"
const ExamListPage = () => {

   const canAccessPage  = usePageAccess();
      
        if (!canAccessPage) {
          return (
            <div className="flex items-center justify-center ">
              <div className="text-center bg-red-100 px-4 py-3 my-auto">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600">You do not have permission to view this page.</p>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            <BookOpen className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-xl font-medium text-gray-700">Loading exams...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch your exam data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-800">Error Loading Exams</h3>
          <p className="text-gray-500">Failed to fetch exam data. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
   
    
<div className="relative overflow-hidden rounded-xl h-80 mt-3">
        {/* // Background Image */}
        <img
          src={Banner}
          alt="Upload Banner"
          className="absolute  w-full h-full object-cover"
        />
        <div className="absolute "></div>

        <div className="relative z-10 flex items-center justify-center h-full px-6 text-center w-full">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            List of Created/Drafted Exams
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            this shows list of all the exams organization created batchwise
            </p>
          </div>
        </div>
      </div>
      <div className=' mx-auto  -mt-10 relative z-20 w-[90%]'>


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
      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-md">
        <BookOpen className="w-10 h-10 text-indigo-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Exams Found</h3>
      <p className="text-gray-500 text-center">
        Create your first exam to get started with managing assessments.
      </p>
    </div>
  ) : (
    <div className="space-y-10">
      {Object.entries(groupedExams).map(([batchName, batchExams]) => (
        <div key={batchName} className="space-y-5  ">
          {/* Batch Header */}
          <div className="flex items-center space-x-3 pb-4 border-b border-indigo-200 bg-gradient-to-r from-indigo-600 to-gray-600 text-white px-2 py-2 rounded">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center shadow ">
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold ">{batchName}</h2>
              <p className="text-sm text-white">
                Year {batchExams[0]?.batch?.year || 'N/A'} • {batchExams.length} exam
              </p>
            </div>
          </div>

          {/* Exam Cards Grid */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {batchExams.map((exam) => (
              <div
                key={exam.id}
                className={`w-full max-w-md mx-auto bg-gradient-to-br from-indigo-50 via-white to-indigo-100 border-2 rounded-2xl shadow-lg hover:shadow-indigo-300 transition-all duration-300 overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01] ${
                  exam.go_live ? 'border-green-200' : 'border-indigo-200'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4 p-4">
                  <div
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      exam.go_live
                        ? 'bg-green-100/40 text-green-800 border border-green-300'
                        : 'bg-yellow-100/30 text-yellow-800 border border-yellow-300'
                    }`}
                  >
                    {exam.go_live ? (
                      <>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-ping"></div>
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
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
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
                  <h3 className="text-lg font-bold text-indigo-500 py-2 px-4 rounded-xl text-center mb-4">
                    {exam.name}
                  </h3>

                  {/* Exam Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Academic Year</span>
                      <span className="font-semibold text-gray-700">
                        {exam.batch?.year || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span
                        className={`font-medium flex items-center space-x-1 ${
                          exam.go_live ? 'text-green-600' : 'text-amber-600'
                        }`}
                      >
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
                <div className="pt-3 border-t border-gray-100 px-4 pb-5">
                  {!exam.go_live && (
                    <>
                      {pendingExams.some((p) => p.id === exam.id) ? (
                        <button
                          onClick={() => handleAddQuestion(exam.id)}
                          className="w-full py-2.5 px-4 rounded-full font-medium text-sm bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Add Questions</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGoLive(exam.id, exam.go_live)}
                          disabled={updatingId === exam.id}
                          className={`w-full py-2.5 px-4 rounded-full font-semibold text-sm transition duration-200 flex items-center justify-center gap-2 ${
                            updatingId === exam.id
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
                      )}
                    </>
                  )}

                  {exam.go_live && (
                    <div className="space-y-2">
                      <div className="w-full py-2 px-3 rounded-lg bg-green-50 border border-green-200 text-green-700 font-medium text-sm flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Exam is Live</span>
                      </div>
                      <button
                        onClick={() => handleGoLive(exam.id, exam.go_live)}
                        disabled={updatingId === exam.id}
                        className={`w-full py-2.5 px-4 rounded-full font-semibold text-sm transition duration-200 flex items-center justify-center gap-2 ${
                          updatingId === exam.id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-700'
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