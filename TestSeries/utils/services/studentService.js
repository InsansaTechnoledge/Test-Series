import api from './api';

// For manual add: single student
export const addSingleStudent = async (data) => {
  const response = await api.post('/v1/student/bulk-add', data);
  return response.data;
};

export const uploadStudentExcel = async (file, batch) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('batchId', batch);
  
    const response = await api.post('/v1/student/upload-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  
    return response.data;
};

export const fetchStudents = async (batchId) => {
  const queryParams = batchId ? `?batchId=${batchId}` : '';
    const response = await api.get('/v1/student/all-student' + queryParams); 
    return response.data;
};

export const updateStudentsBatch=async(data)=>{
  const response= await api.patch('/v1/student/update-batch', data);
  return response.data;
}
  
export const deleteStudentById = async (ids) => {
    const response = await api.delete(`/v1/student/delete/${ids}`);
    return response.data;
};

export const updateStudentById = async (studentId, updatedData) => {
  const response = await api.patch(`/v1/student/update/${studentId}`, updatedData, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};