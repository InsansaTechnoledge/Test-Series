import api from "./api";

export const getStudentResults = async () => {
    const { data } = await api.get('/v1/result'); 
    return data.data;
  };