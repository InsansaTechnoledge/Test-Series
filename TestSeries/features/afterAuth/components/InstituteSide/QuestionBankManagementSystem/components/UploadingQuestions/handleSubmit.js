import { uploadExamQuestions } from "../../../../../../../utils/services/questionUploadService";

export const handleSubmitExam = async (questions, organizationId , setIsSubmitting) => {
    if (questions.length === 0) {
      alert(
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
        organization_id: organizationId,
      }));

      const res = await uploadExamQuestions({
        exam_id: null,
        organization_id: organizationId,
        questions: enrichedQuestions,
      });

      alert("✅ Questions submitted successfully!");
    } catch (err) {
      console.error("❌ Error uploading exam:", err);
      alert(err?.response?.data?.message || "❌ Upload failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };