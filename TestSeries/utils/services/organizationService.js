import api from './api';

export const createOrganization = async (data) => {
    const response = await api.post(`/v1/organization/add-organization`, data);
    console.log('🥲',response);
    return response.data; 
};