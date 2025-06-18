import React, { useState } from 'react';
import { Clock, Users, CheckCircle, PlayCircle, Loader2, BookOpen, CirclePause, Trash } from 'lucide-react';
import HeadingUtil from '../../utility/HeadingUtil';
import NeedHelpComponent from './components/NeedHelpComponent';
import usePendingExams from '../../../../hooks/useExamData';
import { useNavigate } from 'react-router-dom';
import DeleteExamModal from './ExamFlow/DeleteExamModal';
import { useExamManagement } from '../../../../hooks/UseExam';
import Banner from "../../../../assests/Institute/exam list.svg"
const ExamListPage = () => {
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
      console.log('🔄 Attempting to update exam:', { examId, currentStatus: currentGoLiveStatus, newStatus: !currentGoLiveStatus });
      
      // Call the go live mutation
      await goLive({ 
        examId, 
        goLive: !currentGoLiveStatus 
      });
      
      console.log('✅ Exam status updated successfully');
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
   
      {/* Header */}
      <HeadingUtil 
        heading="List of Created/Drafted Exams" 
        description="this shows list of all the exams organization created batchwise" 
      />

      <NeedHelpComponent 
        heading="Want to Live your Exam ?" 
        about="schedule or immediatly live the exam" 
        question="can i revert live exam ?" 
        answer="yes, you can click on pause button to pause the exams (unless any user started it)" 
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {Object.keys(groupedExams).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Exams Found</h3>
            <p className="text-gray-500 text-center">Create your first exam to get started with managing assessments.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedExams).map(([batchName, batchExams]) => (
              <div key={batchName} className="space-y-4">
                {/* Batch Header */}
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{batchName}</h2>
                    <p className="text-sm text-gray-500">
                      Year {batchExams[0]?.batch?.year || 'N/A'} • {batchExams.length} exam{batchExams.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Exam Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {batchExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          exam.go_live
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {exam.go_live ? (
                            <>
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
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
                      <h3 className="text-base font-medium text-gray-900 mb-3 line-clamp-2 leading-snug">
                        {exam.name}
                      </h3>

                      {/* Exam Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Academic Year</span>
                          <span className="font-medium text-gray-700">
                            {exam.batch?.year || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status</span>
                          <span className={`font-medium flex items-center space-x-1 ${
                            exam.go_live ? 'text-green-600' : 'text-amber-600'
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

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-gray-100">
                        {!exam.go_live && (
                          <>
                            {pendingExams.some(p => p.id === exam.id) ? (
                              <button
                                onClick={() => handleAddQuestion(exam.id)}
                                className="w-full py-2.5 px-4 rounded-lg font-medium text-sm bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                              >
                                <BookOpen className="w-4 h-4" />
                                <span>Add Questions</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleGoLive(exam.id, exam.go_live)}
                                disabled={updatingId === exam.id}
                                className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                                  updatingId === exam.id
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
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
                            <div className="w-full py-2 px-3 rounded-lg bg-green-50 border border-green-200 text-green-700 font-medium text-sm flex items-center justify-center space-x-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>Exam is Live</span>
                            </div>
                            <button
                              onClick={() => handleGoLive(exam.id, exam.go_live)}
                              disabled={updatingId === exam.id}
                              className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
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