import { useState } from "react";
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
import NeedHelpComponent from "../../components/NeedHelpComponent";
import usePendingExams from "../../../../../../hooks/useExamData";
import { useNavigate } from "react-router-dom";
import DeleteExamModal from "../../ExamFlow/components/DeleteExamModal";
import { useExamManagement } from "../../../../../../hooks/UseExam";
import Banner from "../../../../../../assests/Institute/exam list.svg";
import { usePageAccess } from "../../../../../../contexts/PageAccessContext";
import { useTheme } from "../../../../../../hooks/useTheme";
import { useUser } from "../../../../../../contexts/currentUserContext";
import { useToast, ToastContainer } from "../../../../../../utils/Toaster";
import EvalvoPulseExamLook from "./EvalvoPulseExamLook";
import EvalvoGridExamLook from "./EvalvoGridExamLook";
import { useEvalvoTheme } from "../../../../../../hooks/EvalvoThemeContext";

const ExamListPage = () => {
  const canAccessPage = usePageAccess();
  const { toasts, showToast, removeToast } = useToast();
  const { evalvoTheme } = useEvalvoTheme();

  const { theme } = useTheme();

  if (!canAccessPage) {
    return (
      <div className="flex items-center justify-center">
        <div
          className={`text-center px-4 py-3 my-auto ${
            theme === "dark"
              ? "bg-gray-800 text-gray-200"
              : "bg-red-100 text-gray-600"
          }`}
        >
          <h1
            className={`text-3xl font-bold mb-4 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            Access Denied
          </h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const { hasRoleAccess } = useUser();
  const [updatingId, setUpdatingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);

  const canDeleteExams = hasRoleAccess({
    keyFromPageOrAction: "actions.deleteExam",
    location: location.pathname,
  });
  const canPublishExams = hasRoleAccess({
    keyFromPageOrAction: "actions.publishExam",
    location: location.pathname,
  });
  const canCreateExam = hasRoleAccess({
    keyFromPageOrAction: "actions.createExam",
    location: location.pathname,
  });

  const { pendingExams } = usePendingExams();
  const navigate = useNavigate();

  const { groupedExams, isLoading, error, goLive, deleteExam, isDeleting } =
    useExamManagement();

  const handleGoLive = async (examId, currentGoLiveStatus) => {
    try {
      setUpdatingId(examId);
      await goLive({
        examId,
        goLive: !currentGoLiveStatus,
      });
    } catch (err) {
      console.error("❌ Failed to update exam status:", err);
      showToast(
        `Failed to ${
          currentGoLiveStatus ? "pause" : "activate"
        } exam. Please try again.`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteExam = async (examId) => {
    try {
      await deleteExam(examId);
      setShowDeleteModal(false);
      showToast("Exam deleted successfully!");
      setExamToDelete(null);
    } catch (err) {
      console.error("❌ Failed to delete exam:", err);
      showToast("Failed to delete exam. Please try again.");
    }
  };

  const getDraftLabel = (exam) => {
    if (pendingExams.some((p) => p.id === exam.id)) {
      return "DRAFT (Add Questions to Go Live)";
    }
  };

  const handleAddQuestion = (examId) => {
    if (canCreateExam) {
      navigate(`/institute/create-exam/${examId}`);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        }`}
      >
        <div className="text-center space-y-4">
          <div className="relative">
            <div
              className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto ${
                theme === "dark"
                  ? "border-gray-700 border-t-indigo-600"
                  : "border-blue-200 border-t-blue-600"
              }`}
            ></div>
            <BookOpen
              className={`w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                theme === "dark" ? "text-indigo-600" : "text-blue-600"
              }`}
            />
          </div>
          <p
            className={`text-xl font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Loading exams...
          </p>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Please wait while we fetch your exam data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center space-y-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
              theme === "dark" ? "bg-gray-800" : "bg-red-100"
            }`}
          >
            <BookOpen
              className={`w-8 h-8 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            />
          </div>
          <h3
            className={`text-xl font-medium ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Error Loading Exams
          </h3>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Failed to fetch exam data. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950" : ""}`}>
      <div className="relative overflow-hidden rounded-xl h-80 mt-3">
        {/* // Background Image */}
        <img
          src={Banner}
          alt="Upload Banner"
          className="absolute w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 ${
            theme === "dark" ? "bg-gray-900/60" : "bg-black/20"
          }`}
        ></div>

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
      <div className="mx-auto -mt-10 relative z-20 w-[90%]">
        <NeedHelpComponent
          heading="Want to Live your Exam ?"
          about="schedule or immediatly live the exam"
          question="can i revert live exam ?"
          answer="yes, you can click on pause button to pause the exams (unless any user started it)"
        />
      </div>

      {/* Main Content */}

      {
        evalvoTheme === 'EvalvoPulse' ? 
          <EvalvoPulseExamLook
            groupedExams={groupedExams}
            theme={theme}
            pendingExams={pendingExams}
            canCreateExam={canCreateExam}
            canPublishExams={canPublishExams}
            canDeleteExams={canDeleteExams}
            isDeleting={isDeleting}
            updatingId={updatingId}
            showDeleteModal={showDeleteModal}
            examToDelete={examToDelete}
            getDraftLabel={getDraftLabel}
            setShowDeleteModal={setShowDeleteModal}
            setExamToDelete={setExamToDelete}
            handleAddQuestion={handleAddQuestion}
            handleGoLive={handleGoLive}
            handleDeleteExam={handleDeleteExam}
          />
          :
          <EvalvoGridExamLook 
            groupedExams={groupedExams}
            theme={theme}
            pendingExams={pendingExams}
            canCreateExam={canCreateExam}
            canPublishExams={canPublishExams}
            canDeleteExams={canDeleteExams}
            isDeleting={isDeleting}
            updatingId={updatingId}
            showDeleteModal={showDeleteModal}
            examToDelete={examToDelete}
            getDraftLabel={getDraftLabel}
            setShowDeleteModal={setShowDeleteModal}
            setExamToDelete={setExamToDelete}
            handleAddQuestion={handleAddQuestion}
            handleGoLive={handleGoLive}
            handleDeleteExam={handleDeleteExam}
          />
      }   

      <ToastContainer toasts={toasts} onRemove={removeToast} theme={theme} />
    </div>
  );
};

export default ExamListPage;
