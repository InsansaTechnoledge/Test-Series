import api from "./api";

export const submitResult = async (payload) => {
    const response = await api.post(`/v1/result/`,payload);
    
    return response.data;
}

export const saveDescriptiveResponse = async (data) => {
    const response = await api.patch(`/v1/result/`, data);
    return response.data;
}