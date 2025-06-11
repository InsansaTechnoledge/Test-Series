import api from "./api";

export const createContest=async(payload)=>{
    const response=await api.post('/v1/contest/create',payload);
    return response.data;
}