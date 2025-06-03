import api from "./api";

export const getStudentResults = async () => {
    const { data } = await api.get('/v1/result'); 
    return data;
  };

  export const getResultDetail = async (examId) => {
    const { data } = await api.get(`/v1/result/exam/${examId}`);
    return data.data;
  };