import api from "./api";

export const createContest=async(payload)=>{
    const response=await api.post('/v1/contest/create',payload);
    return response.data;
}

export const FetchContest = async () => {    
    const response = await api.get('/v1/contest');
    return response.data;
}