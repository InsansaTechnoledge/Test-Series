import api from './api';

export const fetchBatchList = async () => {
    const response = await api.get(`/v1/batch/get-batch`);
    return response.data;
};

export const createBatch = async (batchData) => {
    const response = await api.post(`/v1/batch/create-batch`, batchData);
    return response.data;
};