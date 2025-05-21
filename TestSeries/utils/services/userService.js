import api from './api.js';

export const createUser=async(payload)=>{
    const response=await api.post('/v1/users/create',payload);
    return response.data;
}