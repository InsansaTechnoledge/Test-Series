import api from './api';

export const fetchBatchList = async () => {
    const response = await api.get(`/v1/batch/get-batch`);
    return response.data;
};