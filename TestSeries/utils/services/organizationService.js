import api from './api'; 

export const createOrganization = async (formData) => {
  const response = await api.post('/v1/organization/add-organization', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};
