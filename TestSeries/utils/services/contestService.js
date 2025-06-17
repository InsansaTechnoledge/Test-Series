import api from "./api";

export const createContest = async (payload) => {
    const response = await api.post('/v1/contest/create', payload);
    return response.data;
}

export const FetchContest = async (batchId) => {
    if (!batchId) {
        const response = await api.get('/v1/contest');
        return response.data;
    }
    else {
        const response = await api.get('/v1/contest/?batchId=' + batchId);
        return response.data;
    }

}

export const enrollContest = async (contestId) => {
    const response = await api.post('/v1/contest/enroll', { contestId });
    return response.data;
}

export const deleteContest = async (id) => {
    const resonse = await api.delete(`v1/contest/${id}`)
    return resonse.data;
}