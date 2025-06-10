import api from "./api";

export const saveContestQuestion=async(questionData)=>{
    const response=await api.post('/v1/contest/questions',questionData);
    return response.data;
}