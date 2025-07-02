import api from "./api";

export const saveContestQuestion=async(questionData)=>{
    const response=await api.post('/v1/contest/questions',questionData);
    return response.data;
}

export const getContestQuestions=async(contestId)=>{
    const response=await api.get(`/v1/contest/questions?contest_id=${contestId}`);
    return response.data;
}

export const runContestTestCases=async(code, output, currentLang)=>{
    const response = await api.post('/v1/contest/test', {
        code,
        output,
        currentLang
    });
    return response.data;
}

export const runContestCode=async (code, currentLang) => {

    const response = await api.post('/v1/contest/run', {
        code,
        currentLang
    });
    return response.data;
}