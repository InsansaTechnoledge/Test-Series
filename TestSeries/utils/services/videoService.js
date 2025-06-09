import api from "./api"

export const uploadVideo = async (data) => {
    const response = await api.post(`/v1/video/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
}

export const register=async()=>{
    const response=await api.post('/v1/video/register',{ 
    });
    return response.data;
}

export const callBack=async(code)=>{
    const response=await api.get(`/v1/video/callback?code=${code}`);
    return response.data;
}