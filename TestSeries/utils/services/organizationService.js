import api from './api'; 

export const createOrganization = async (formData) => {
  const response = await api.post('/v1/organization/add-organization', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

export const getOrganizationById=async(id)=>{
  const response=await api.get(`/v1/organization/detail/${id}`);
  return response.data;
};

export const UpdateOrganizationData = async(id , newData) => {
  const response = await api.patch(`/v1/organization/update/${id}`, newData);
  return response.data;
}