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

export const fetchCodingQuestions = async (difficulty, page,limit) => {
    const response = await api.get(`v1/contest/coding-questions/`, {
        params: {
            difficulty,
            page,
            limit
        }
    });
    return response.data;
}

export const fetchCodingQuestion = async (id) => {
    const response = await api.get(`v1/contest/coding-question/${id}`);
    return response.data;
}



export const ToggleContest = async (id) => {
    const response = await api.patch(`v1/contest/toggle-contest/${id}`);
    return response.data;

}

export const submitContestService = async (contest_id, studentResult) => {
    const response = await api.post('/v1/contest/submit', {
        contest_id,
        results:studentResult
    });
    return response.data;
}

export const getLeaderBoard = async () => {
    const response = await api.get('/v1/contest/leader-board');
    return response.data;
}