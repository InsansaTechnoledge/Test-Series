import React from 'react'
import {
  Clock,
  CheckCircle,
  PlayCircle,
  Loader2,
  BookOpen,
  CirclePause,
  Trash,
} from "lucide-react";
import DeleteExamModal from '../../ExamFlow/components/DeleteExamModal';

const EvalvoGridExamLook = ({
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

  console.log("tw", groupedExams);
  
  const allExams = Object.entries(groupedExams).flatMap(([batchName, exams]) =>
    exams.map(exam => ({
      ...exam,
      batchName,
      batchYear: exam.batch?.year || "N/A"
    }))
  );

  const renderActionButtons = (exam) => {
    if (!exam.go_live) {
      // Exam is not live   
      if (pendingExams.some((p) => p.id === exam.id) && canCreateExam) {
        // Show Add Questions button
        return (
          <button
            disabled={!canCreateExam}
            onClick={() => handleAddQuestion(exam.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 shadow-sm ${
              theme === "dark"
                ? "bg-green-600 text-white hover:bg-green-500 hover:shadow-md ring-1 ring-green-700"
                : "bg-green-600 text-white hover:bg-green-700 hover:shadow-md ring-1 ring-green-500"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Add Questions
          </button>
        );
      } else if (canPublishExams) {
        // Show Go Live button
        return (
            <button
            onClick={() => handleGoLive(exam.id, exam.go_live)}
            disabled={updatingId === exam.id || !canPublishExams}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all duration-200 shadow-sm
              ${updatingId === exam.id
                ? theme === "dark"
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : theme === "dark"
                ? "bg-indigo-500 text-gray-900 hover:bg-indigo-400 hover:shadow-lg ring-1 ring-indigo-400"
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg ring-1 ring-indigo-500"
              }
            `}
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
          
        );
      }
    } else {
      // Exam is live - show pause button
      if (canPublishExams) {
        return (
          <button
            onClick={() => handleGoLive(exam.id, exam.go_live)}
            disabled={updatingId === exam.id || !canPublishExams}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1 transition duration-200 ${
              updatingId === exam.id
                ? theme === "dark"
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-orange-600 text-white hover:bg-orange-700"
            }`}
          >
            <CirclePause className="w-3 h-3" />
            <span>Pause</span>
          </button>
        );
      }
    }
    return null;
  };

  return (
    <>
      <div className={`overflow-x-auto max-w-7xl mx-auto rounded-xl shadow-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}>
        <table className="min-w-full">
          <thead className={`${
            theme === "dark" 
              ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white" 
              : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900"
          }`}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Exam No.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Exam Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Batch Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Year
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Total Marks
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            theme === "dark" 
              ? "divide-gray-700 bg-gray-800 text-white" 
              : "divide-gray-200 bg-white text-gray-900"
          }`}>
            {allExams.map((exam, index) => (
              <tr
                key={exam.id}
                className={`transition-all duration-200 ${
                  theme === "dark" 
                    ? "hover:bg-gray-700 hover:shadow-md" 
                    : "hover:bg-blue-50 hover:shadow-md"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    theme === "dark" 
                      ? "bg-gray-700 text-gray-300" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-base">{exam.name}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    theme === "dark"
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {exam.batchName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {exam.batchYear}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {exam.date}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium ${
                    theme === "dark"
                      ? " text-gray-300"
                      : " text-gray-800"
                  }`}>
                    {exam.duration} min
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${
                    theme === "dark"
                      ? " text-emerald-300"
                      : " text-emerald-800"
                  }`}>
                    {exam.total_marks}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {exam.go_live ? (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                        theme === "dark" 
                          ? " text-green-300 " 
                          : " text-green-700  "
                      }`}>
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        LIVE
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                        theme === "dark" 
                          ? " text-amber-300  " 
                          : " text-amber-700 "
                      }`}>
                        <Clock className="w-4 h-4 mr-1.5" />
                        {getDraftLabel ? getDraftLabel(exam) : 'PENDING'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {renderActionButtons(exam)}
                    
                    {canDeleteExams && (
                      <button
                        className={`p-2.5 rounded-lg transition-all duration-200 ${
                          theme === "dark"
                            ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20 hover:ring-1 hover:ring-red-700"
                            : "text-gray-500 hover:text-red-600 hover:bg-red-50 hover:ring-1 hover:ring-red-200"
                        }`}
                        onClick={() => {
                          setShowDeleteModal(true);
                          setExamToDelete(exam.id);
                        }}
                        disabled={isDeleting || !canDeleteExams}
                        title="Delete Exam"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <DeleteExamModal
          examId={examToDelete}
          setShowDeleteModal={setShowDeleteModal}
          onDelete={handleDeleteExam}
        />
      )}
    </>
  );
};

export default EvalvoGridExamLook;