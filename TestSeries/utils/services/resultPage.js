import api from "./api";

export const getStudentResults = async () => {
    const { data } = await api.get('/v1/result'); 
    return data;
  };

  export const getResultDetail = async (examId, forAllStudents = false) => {
    const { data } = await api.get(`/v1/result/exam/${examId}?forAllStudents=${forAllStudents}`);
    return data.data;
  };
  
  export const getAllStudentData = async (examId) =>{
    const response = await api.get(`/v1/result/${examId}`)
    return response.data
  }