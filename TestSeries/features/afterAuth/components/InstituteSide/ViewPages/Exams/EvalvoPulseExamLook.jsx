import React from 'react'
import {
  Clock,
  Users,
  CheckCircle,
  PlayCircle,
  Loader2,
  BookOpen,
  CirclePause,
  Trash,
} from "lucide-react";
import DeleteExamModal from '../../ExamFlow/components/DeleteExamModal';

const EvalvoPulseExamLook = ({
    groupedExams,
    theme,
    pendingExams,
    canCreateExam,
    canPublishExams,
    canDeleteExams,
    isDeleting,
    updatingId,
    showDeleteModal,
    examToDelete,
    getDraftLabel,
    setShowDeleteModal,
    setExamToDelete,
    handleAddQuestion,
    handleGoLive,
    handleDeleteExam,
   

  }) => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {Object.keys(groupedExams).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md ${
                theme === "dark" ? "bg-gray-800" : "bg-indigo-100"
              }`}
            >
              <BookOpen
                className={`w-10 h-10 ${
                  theme === "dark" ? "text-indigo-600" : "text-indigo-500"
                }`}
              />
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              No Exams Found
            </h3>
            <p
              className={`text-center ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Create your first exam to get started with managing assessments.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedExams).map(([batchName, batchExams]) => (
              <div key={batchName} className="space-y-5">
                
                <div
                  className={`max-w-6xl mx-auto rounded-full flex items-center space-x-3 pb-4 border-b px-4 py-3  ${
                    theme === "dark"
                      ? "bg-indigo-400"
                      : "border-indigo-200 bg-indigo-600 text-white"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shadow ${
                      theme === "dark" ? "bg-gray-100" : "bg-indigo-100"
                    }`}
                  >
                    <Users
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-indigo-600" : "text-indigo-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-semibold ${
                        theme === "dark" ? "text-gray-800" : ""
                      }`}
                    >
                      {batchName}
                    </h2>
                    <p className="text-lg text-white">
                      Year {batchExams[0]?.batch?.year || "N/A"} •{" "}
                      {batchExams.length} exam
                    </p>
                  </div>
                </div>

               
                <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {batchExams.map((exam) => (
                    <div
                      key={exam.id}
                      className={`w-full max-w-md mx-auto rounded-2xl shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01] border-2 ${
                        theme === "dark"
                          ? exam.go_live
                            ? "bg-gray-800 border-green-500 hover:shadow-green-500/20"
                            : "bg-gray-800 border-gray-600 hover:shadow-indigo-500/20"
                          : exam.go_live
                          ? "bg-white border-green-300 hover:shadow-green-300"
                          : "bg-white border-indigo-200 hover:shadow-indigo-300"
                      }`}
                    >
                     
                      <div className="flex items-start justify-between mb-4 p-4">
                        <div
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            exam.go_live
                              ? theme === "dark"
                                ? "bg-green-900 text-green-300 border border-green-500"
                                : "bg-green-100 text-green-800 border border-green-300"
                              : theme === "dark"
                              ? "bg-yellow-900 text-yellow-300 border border-yellow-600"
                              : "bg-yellow-100 text-yellow-800 border border-yellow-300"
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
                              {getDraftLabel(exam) || "Draft"}
                            </>
                          )}
                        </div>

                        {canDeleteExams && (
                          <button
                            className={`transition-colors duration-200 p-1 ${
                              theme === "dark"
                                ? "text-gray-500 hover:text-red-400"
                                : "text-gray-400 hover:text-red-500"
                            }`}
                            onClick={() => {
                              setShowDeleteModal(true);
                              setExamToDelete(exam.id);
                            }}
                            disabled={isDeleting || !canDeleteExams}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      
                      <div className="px-4">
                        <h3
                          className={`text-lg font-bold py-2 px-4 rounded-xl text-center mb-4 ${
                            theme === "dark"
                              ? "text-indigo-300"
                              : "text-indigo-600"
                          }`}
                        >
                          {exam.name}
                        </h3>

                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span
                              className={
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }
                            >
                              Academic Year
                            </span>
                            <span
                              className={`font-semibold ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-700"
                              }`}
                            >
                              {exam.batch?.year || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span
                              className={
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }
                            >
                              Status
                            </span>
                            <span
                              className={`font-medium flex items-center space-x-1 ${
                                exam.go_live
                                  ? theme === "dark"
                                    ? "text-green-400"
                                    : "text-green-600"
                                  : theme === "dark"
                                  ? "text-yellow-400"
                                  : "text-yellow-600"
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

                     
                      <div
                        className={`pt-3 border-t px-4 pb-5 ${
                          theme === "dark"
                            ? "border-gray-600"
                            : "border-gray-200"
                        }`}
                      >
                        {!exam.go_live ? (
                          pendingExams.some((p) => p.id === exam.id) &&
                          canCreateExam ? (
                            <button
                              disabled={!canCreateExam}
                              onClick={() => handleAddQuestion(exam.id)}
                              className="w-full py-2.5 px-4 rounded-full font-medium text-sm bg-green-600 text-white hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2"
                            >
                              <BookOpen className="w-4 h-4" />
                              Add Questions
                            </button>
                          ) : (
                            canPublishExams && (
                              <button
                                onClick={() =>
                                  handleGoLive(exam.id, exam.go_live)
                                }
                                disabled={
                                  updatingId === exam.id || !canPublishExams
                                }
                                className={`w-full py-2.5 px-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition duration-200 ${
                                  updatingId === exam.id
                                    ? theme === "dark"
                                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
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
                          )
                        ) : (
                          <div className="space-y-2">
                            <div
                              className={`w-full py-2 px-3 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 ${
                                theme === "dark"
                                  ? "bg-green-800 border-green-500 text-green-300"
                                  : "bg-green-50 border-green-200 text-green-700"
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Exam is Live</span>
                            </div>
                            {canPublishExams && (
                              <button
                                onClick={() =>
                                  handleGoLive(exam.id, exam.go_live)
                                }
                                disabled={
                                  updatingId === exam.id || !canPublishExams
                                }
                                className={`w-full py-2.5 px-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition duration-200 ${
                                  updatingId === exam.id
                                    ? theme === "dark"
                                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-orange-600 hover:bg-orange-700 text-white"
                                }`}
                              >
                                <CirclePause className="w-4 h-4" />
                                <span>Pause Exam</span>
                              </button>
                            )}
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
  )
}

export default EvalvoPulseExamLook
