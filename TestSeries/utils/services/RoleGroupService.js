import api from "./api";

export const postRoleGroup = async (groupData) => {
    const response = await api.post('/v1/role', {
      
      name: groupData.name,
      description: groupData.description,
      featureIds: groupData.features,
    });
    return response.data;
  };

export const fetchAllRoleGroups = async () => {
    const response = await api.get("/v1/role");
    return response.data.data; 
};
  