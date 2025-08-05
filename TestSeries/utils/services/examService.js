import api from "./api";

export const fetchQuestionsbyExam = async (examId) => {
    const response = await api.get(`v1/question?exam_id=${examId}`);
    return response.data;
}

export const fetchExamById = async (examId) => {
    const response = await api.get(`v1/exam?id=${examId}`);
    return response.data;
}
  
export const goLiveExam = async (examId,status) => {
    const response = await api.patch(`/v1/exam/${examId}/go-live`, { status });
    return response.data;
  };

  export const fetchUpcomingExams = async () => {
    const response = await api.get(`/v1/exam`);
    return response.data;
  };
  

export const deleteExam = async (id) => {
    const response = await api.delete(`/v1/exam/${id}`)
    return response.data
}


export const fetchExamsWithoutQuestions = async (orgId) => {
  const response = await api.get(`/v1/exam/pending-no-questions?orgId=${orgId}`);
  return response.data;
};

export const updateExam=async(examId, examData) => {
  const response = await api.patch(`/v1/exam/${examId}`, examData);
  return response.data;
};

export const fetchAnalyticsOnExams = async()=>{
  const response =await api.get(`/v1/exam/analytics`);
  return response.data;
}

export const addCertificateToExams = async (assignment) => {
  const response = await api.patch('/v1/exam' , assignment)
  return response.data
}