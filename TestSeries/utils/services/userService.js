import api from './api.js';

export const createUser = async (payload) => {
    const response = await api.post('/v1/users/create', payload);
    return response.data;
}

export const fetchUserList = async (id) => {
    if (!id) {
        const response = await api.get('/v1/users/getUser/');
        return response.data;
    }
    const response = await api.get(`/v1/users/getUser/?userId=${id}`);
    return response.data;
}

export const DeleteUser = async (userId) => {
    const response = await api.delete(`/v1/users/delete/${userId}`);
    return response.data;
};


export const UpdateUser = async (Data) => {
    const response = await api.patch(`/v1/users/update`, Data)
    return response.data;
}


