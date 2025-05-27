import api from "./api";

export const postRoleGroup = async (groupData) => {
    const response = await api.post('/v1/role', {
      
      name: groupData.name,
      description: groupData.description,
      featureIds: groupData.features.map(f => (typeof f === 'string' ? f : f._id)),
    });
    return response.data;
  };

export const fetchAllRoleGroups = async () => {
    const response = await api.get("/v1/role");
    return response.data; 
};
  
export const deleteRoleGroup = async (groupId,deleteUsers) => {
  const response = await api.delete(`/v1/role/${groupId}?deleteUsers=${deleteUsers}`);
  return response.data;
};

export const updateRoleGroup = async (id, groupData) => {
  const response = await api.patch('/v1/role', {
    id,
    name: groupData.name,
    description: groupData.description,
    featureIds: groupData.features.map(f => (typeof f === 'string' ? f : f._id)),
  });
  return response.data;
};


