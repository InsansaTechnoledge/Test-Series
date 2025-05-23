import api from "./api";

export const submitResult = async (payload) => {
    const response = await api.post(`/v1/result/`,payload);
    
    return response.data;
}