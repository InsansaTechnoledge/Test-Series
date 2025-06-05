import api from './api';

export const fetchBatchList = async (id) => {
  const query = id ? `?id=${id}` : '';
  const response = await api.get(`/v1/batch/get-batch/${query}`);
  return response.data;
};

export const createBatch = async (batchData) => {
  const response = await api.post(`/v1/batch/create-batch`, batchData);
  return response.data;
};

export const updateBatch = async (batchId, batchData) => {
  const response = await api.patch(`/v1/batch/update-batch/${batchId}`, batchData);
  return response.data;
};

export const deleteBatch = async (batchId, faculties, students) => {
  const response = await api.delete(`/v1/batch/delete-batch/${batchId}`, {
    data: {
      faculties,
      students
    }
  });
  return response.data;
};