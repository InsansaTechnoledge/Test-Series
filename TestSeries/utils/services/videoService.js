import api from "./api"

export const uploadVideo = async (data) => {
    const response = await api.post(`/v1/video/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
}