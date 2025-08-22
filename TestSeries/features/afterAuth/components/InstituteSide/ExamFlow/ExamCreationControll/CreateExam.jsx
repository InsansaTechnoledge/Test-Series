import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Banner from "../../../../../../assests/Institute/create exam.svg";
import { Edit3, Upload } from "lucide-react";
import { useUser } from "../../../../../../contexts/currentUserContext";
import { useCachedOrganization } from "../../../../../../hooks/useCachedOrganization";
import useLimitAccess from "../../../../../../hooks/useLimitAccess";
import { fetchExamById } from "../../../../../../utils/services/examService";
import { uploadExamQuestions } from "../../../../../../utils/services/questionUploadService";
import NeedHelpComponent from "../../components/NeedHelpComponent";
import BulkUpload from "../components/BulkUpload";
import DeleteExamModal from "../components/DeleteExamModal";
import ExamForm from "./ExamForm";
import ManualQuestionForm from "../components/ManualQuestionsForm";
import QuestionPreview from "../components/QuestionPreview";
import { useTheme } from "../../../../../../hooks/useTheme";
import ExamPageIntroHeader from "../ExamHeaderComponents/ExamPageIntroHeader";
import { useToast, ToastContainer } from "../../../../../../utils/Toaster";
const CreateExam = () => {
  const [examDetails, setExamDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { examId } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingExam, setEditingExam] = useState(false);
  const { user, getFeatureKeyFromLocation, hasRoleAccess } = useUser();
  const location = useLocation();
  const { theme } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState("manual");

  const canCreateMoreExams = useLimitAccess(
    getFeatureKeyFromLocation(location.pathname),
    "totalExams"
  );
  const canEditExams = hasRoleAccess({
    keyFromPageOrAction: "actions.editExam",
    location: location.pathname,
  });
  const canDeleteExams = hasRoleAccess({
    keyFromPageOrAction: "actions.deleteExam",
    location: location.pathname,
  });
  const tabs = [
    {
      id: "manual",
      label: "Manual Entry",
      icon: Edit3,
      description: "Create questions one by one with full control",
    },
    {
      id: "bulk",
      label: "Bulk Upload",
      icon: Upload,
      description: "Upload multiple questions using Excel spreadsheet",
    },
  ];
  const organization =
    user.role !== "organization"
      ? useCachedOrganization({
          userId: user._id,
          orgId: user.organizationId._id,
        })?.organization
      : null;

  const Total_Exams =
    user?.role === "organization"
      ? user.metaData?.totalExams
      : organization?.metaData?.totalExams;

  const Creation_Limit = user?.planFeatures?.exam_feature?.value;

  const Available_Limit = Creation_Limit - Total_Exams;

  const handleNewExam = (newExam) => {
    setExamDetails(newExam);
    navigate(`/institute/create-exam/${newExam.id}`, { replace: true });
  };

  console.log("DF", examDetails?.subjects);

  useEffect(() => {
    const loadExamIfNeeded = async () => {
      if (examId) {
        try {
          const res = await fetchExamById(examId);

          const matchedExam = res.data.find((e) => e.id === examId);
          console.log("SD", matchedExam);

          if (!matchedExam) {
            console.warn("⚠️ No matching exam found!");
          } else {
            // console.log('✅ organization_id:', matchedExam.organization_id);
          }

          setExamDetails(matchedExam);
        } catch (error) {
          console.error("❌ Failed to load exam:", error);
        }
      }
    };

    // Always run when examId changes
    loadExamIfNeeded();
  }, [examId]); // ✅ remove examDetails dependency

  const handleSubmitExam = async () => {
    if (!examDetails || questions.length === 0) {
      showToast(
        "Please complete exam details and add at least one question.",
        "warning"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure every question has organization_id
      const enrichedQuestions = questions.map((q) => ({
        ...q,
        organization_id: examDetails.organization_id,
      }));

      const res = await uploadExamQuestions({
        exam_id: examDetails.id,
        organization_id: examDetails.organization_id,
        questions: enrichedQuestions,
      });

      showToast("✅ Questions submitted successfully!");
      navigate("/institute/exam-list");
    } catch (err) {
      console.error("❌ Error uploading exam:", err);
      showToast(err?.response?.data?.message || "❌ Upload failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    console.log(questions, "question..........");
  });

  const NotScheduled = () => {
    return(
      <span className={`text-sm ${theme === 'light' ? 'text-red-500' : 'text-red-400'} font-bold`}> N/A <span className="text-xs text-gray-400">(Not of Scheduled type)</span></span>
    )
  } 

  return (
    <div className="p-6  mx-auto ">
      <ExamPageIntroHeader
        Banner={Banner}
        Available_Limit={Available_Limit}
        NeedHelpComponent={NeedHelpComponent}
        canCreateMoreExams={canCreateMoreExams}
      />

      {!examDetails || editingExam ? (
        <ExamForm
          setShowDeleteModal={setShowDeleteModal}
          canCreateMoreExams={canCreateMoreExams}
          showDeleteModal={showDeleteModal}
          onSubmit={(updatedExam) => {
            setExamDetails(updatedExam);
            setEditingExam(false);
            // If it's a new exam, redirect to its page
            if (!examId) {
              handleNewExam(updatedExam);
            }
          }}
          initialData={
            examDetails || {
              name: "",
              date: "",
              exam_time: "",
              total_marks: "",
              duration: "",
              batch_id: "",
              is_subjective: true,
              subjects: [],
              auto_submittable: true,
              ai_proctored: false,
              exam_type: "semi_subjective",
            }
          } // for edit form
        />
      ) : (
        <div
          className={`p-6 rounded-3xl mb-6 px-12 shadow-lg ${
            theme === "light" ? "bg-blue-50" : "bg-gray-800"
          }`}
        >
          <div className="flex justify-between items-center ">
            <div className="">
              <h2
                className={`text-xl font-semibold ${
                  theme === "light" ? "text-green-600" : "text-green-400"
                }`}
              >
                <span
                  className={`${
                    theme === "light" ? "text-gray-700" : "text-white"
                  }`}
                >
                  Exam Name :
                </span>{" "}
                {examDetails.name}
              </h2>

              <h2
                className={`text-lg font-normal ${
                  theme === "light" ? "text-green-600" : "text-green-400"
                }`}
              >
                <span
                  className={`${
                    theme === "light" ? "text-gray-700" : "text-white"
                  }`}
                >
                  Exam Type :
                </span>{" "}
                {examDetails?.exam_type}
              </h2>

              <p
                className={`${
                  theme === "light" ? "text-gray-600" : "text-gray-300"
                } mt-2`}
              >
                Date: {examDetails.date} | Duration: {examDetails.duration} mins
                | Total Marks: {examDetails.total_marks} | Exam Scheduled for: {examDetails?.exam_time || NotScheduled()}
              </p>

              {Array.isArray(examDetails?.subjects) &&
                examDetails?.subjects.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <p
                      className={`font-semibold ${
                        theme === "light" ? "text-gray-700" : "text-gray-200"
                      }`}
                    >
                      Subjects:
                    </p>
                    {examDetails?.subjects.map((subj, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                )}
            </div>
            {canEditExams && (
              <button
                disabled={!canEditExams}
                onClick={() => setEditingExam(true)}
                className={`transition-colors duration-300 ${
                  theme === "light"
                    ? "text-blue-600 hover:text-blue-800"
                    : "text-blue-400 hover:text-blue-300"
                }`}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      )}

      {examDetails && !editingExam && (
        <>
          <div className={`mt-6 border-t pt-6 c`}>
            <h2
              className={`text-xl font-semibold mb-4 ${
                theme == "light" ? "text-black" : "text-gray-100"
              } `}
            >
              Add Questions
            </h2>

            <div
              className={`p-6 rounded-lg mb-6 ${
                theme === "light" ? "bg-gray-50" : "bg-gray-800"
              }`}
            >
              {/* Tab Navigation */}
              <div className="mb-6">
                <div
                  className={`flex space-x-1 p-1 rounded-lg ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-700"
                  }`}
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200
            ${
              activeTab === tab.id
                ? theme === "light"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "bg-gray-800 text-blue-400 shadow-sm"
                : theme === "light"
                ? "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-600"
            }
          `}
                    >
                      {/* <span className="text-lg">{tab.icon}</span> */}
                      <span className="text-lg">
                        <tab.icon size={16} />
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Description */}
                <div className="mt-4 text-center">
                  <p
                    className={`text-sm ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {tabs.find((tab) => tab.id === activeTab)?.description}
                  </p>
                </div>
              </div>

              {/* Tab Content */}
              <div className="relative">
                {/* Manual Entry Tab */}
                <div
                  className={`transition-all duration-300 ${
                    activeTab === "manual"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div
                    className={`rounded-xl p-6 shadow-2xl transition-all duration-200 hover:shadow-3xl ${
                      theme === "light"
                        ? "bg-white border border-gray-100"
                        : "bg-gray-900 border border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2 rounded-lg ${
                          theme === "light"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-blue-900/30 text-blue-400"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            theme === "light"
                              ? "text-gray-900"
                              : "text-gray-100"
                          }`}
                        >
                          Manual Entry
                        </h3>
                        <p
                          className={`text-sm ${
                            theme === "light"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          Craft each question with precision and control
                        </p>
                      </div>
                    </div>

                    <ManualQuestionForm
                      setQuestions={setQuestions}
                      organizationId={examDetails.organization_id}
                      examDetails={examDetails}
                    />
                  </div>
                </div>

                {/* Bulk Upload Tab */}
                <div
                  className={`transition-all duration-300 ${
                    activeTab === "bulk"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div
                    className={`rounded-xl p-6 shadow-2xl transition-all duration-200 hover:shadow-3xl ${
                      theme === "light"
                        ? "bg-white border border-gray-100"
                        : "bg-gray-900 border border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2 rounded-lg ${
                          theme === "light"
                            ? "bg-green-50 text-green-600"
                            : "bg-green-900/30 text-green-400"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            theme === "light"
                              ? "text-gray-900"
                              : "text-gray-100"
                          }`}
                        >
                          Bulk Upload
                        </h3>
                        <p
                          className={`text-sm ${
                            theme === "light"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          Import multiple questions efficiently from Excel
                        </p>
                      </div>
                    </div>

                    <BulkUpload
                      setQuestions={setQuestions}
                      organizationId={examDetails.organization_id}
                      examType={examDetails.exam_type}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <QuestionPreview
            questions={questions}
            setQuestions={setQuestions}
            examDetails={examDetails}
          />
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto mt-6">
            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className={`w-full md:w-auto px-6 py-3 rounded font-semibold text-white transition duration-200 ease-in-out flex items-center justify-center ${
                isSubmitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Exam"
              )}
            </button>

            {canDeleteExams && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full md:w-auto px-6 py-3 rounded border border-red-600 text-red-600 font-semibold transition duration-200 ease-in-out hover:bg-red-600 hover:text-white"
              >
                Delete Exam
              </button>
            )}
          </div>
        </>
      )}
      {showDeleteModal && (
        <DeleteExamModal
          examId={examDetails?.id}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default CreateExam;
