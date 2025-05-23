import api from "./api";

export const fetchQuestionsbyExam = async (examId) => {
    const response = await api.get(`v1/question?exam_id=${examId}`);
    return response.data;
}

export const fetchExamById = async (examId) => {
    const response = await api.get(`v1/exam?id=${examId}`);
    return response.data;
}

export const fetchExamsByOrganization = async () => {
    try {
      const response = await api.get('/v1/exam'); 
      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to fetch exams:", error);
      throw error;
    }
  };
  
  

export const goLiveExam = async (examId) => {
    const response = await api.put(`/v1/exam/${examId}/go-live`);
    return response.data;
  };