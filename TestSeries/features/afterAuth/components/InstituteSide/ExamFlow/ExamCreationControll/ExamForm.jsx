import React, { useState, useEffect } from "react";
import { addExamAPI } from "../../../../../../utils/services/questionUploadService";
import { useUser } from "../../../../../../contexts/currentUserContext";
import { useCachedBatches } from "../../../../../../hooks/useCachedBatches";
import { usePendingExams } from "../../../../../../hooks/useExamData";
import { updateExam } from "../../../../../../utils/services/examService";
import { usePageAccess } from "../../../../../../contexts/PageAccessContext";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "../../../../../../hooks/useTheme";
import { useToast, ToastContainer } from "../../../../../../utils/Toaster";

import NewExamMetaDataForm from "./NewExamMetaDataForm";
import PendingExamHeader from "../ExamHeaderComponents/PendingExamHeader";
import PendingExamComponent from "../PendingExamLogic/PendingExamComponent";

const ExamForm = ({
  canCreateMoreExams,
  setShowDeleteModal,
  showDeleteModal,
  onSubmit,
  initialData = {
    exam_type: " ",
    name: "",
    date: "",
    total_marks: "",
    duration: "",
    batch_id: "",
    is_subjective: false,
    subjects: [],
    auto_submittable: true,
    ai_proctored: false,
  },
}) => {
  const { theme } = useTheme();
  const { user } = useUser();
  const { batches = [], batchMap } = useCachedBatches();
  const { toasts, showToast, removeToast } = useToast();
  const { pendingExams, isLoading: pendingLoading } = usePendingExams();
  const canAccessPage = usePageAccess();
  const queryClient = useQueryClient();

  const [isExamControllOpen, setIsExamControllOpen] = useState(false);

  // Ensure all keys from initialData are present in form state
  const [form, setForm] = useState({ ...initialData });

  useEffect(() => {
    setForm({ ...initialData }); 
  }, [initialData]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Always send the complete form merged with organization_id and date formatting
    const payload = {
      ...form,
      organization_id:
        user.role === "organization"
          ? user._id
          : user.organizationId._id || user.organizationId,
      date: form.date
        ? new Date(form.date).toISOString().split("T")[0]
        : "",
    };

    if (!payload.organization_id) {
      showToast("Missing organization ID. Please try again.", "error");
      return;
    }

    try {
      let response;
      if (form.id) {
        const { batch, ...examData } = payload;
        response = await updateExam(form.id, examData);
      } else {
        response = await addExamAPI(payload);
      }

      onSubmit(response?.data);
      queryClient.invalidateQueries([
        "pendingExams",
        payload.organization_id,
      ]);
    } catch (error) {
      console.error("Error creating exam:", error);
      showToast("Failed to create exam.", "error");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        <PendingExamHeader
          theme={theme}
          pendingExams={pendingExams}
          setShowDeleteModal={setShowDeleteModal}
          showDeleteModal={showDeleteModal}
        />

        {/* Exam Creation Form */}
        <NewExamMetaDataForm
          handleSubmit={handleSubmit}
          theme={theme} 
          form={form}
          setForm={setForm}
          handleChange={handleChange}
          batches={batches}
          isExamControllOpen={isExamControllOpen}
          setIsExamControllOpen={setIsExamControllOpen}
          canAccessPage={canAccessPage}
          canCreateMoreExams={canCreateMoreExams}
        />

        {/* Pending Exams Section */}
        <PendingExamComponent
          form={form}
          theme={theme}
          pendingLoading={pendingLoading}
          pendingExams={pendingExams}
          batchMap={batchMap}
          onSubmit={onSubmit}
        />
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default ExamForm;
