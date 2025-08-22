import api from './api';


// export const orgLogin=async (data)=>{
//     const response=await api.post(`/v1/auth/org-login`,
//         data
//     );  
//     return response.data;
// }

export const orgLogin = async (data) => {
    const response = await api.post(`/v1/auth/institute-login`, data);
    return response.data;
}

export const studentLogin=async (data)=>{
    const response=await api.post(`/v1/auth/student-login`,data);
    return response.data;
}

export const checkAuth=async ()=>{
    const response=await api.get(`/v1/auth/check-auth`);
    return response.data;
}

export const logout = async () => {
    const response = await api.post(`/v1/auth/logout`);
    return response.data;
}

export const profileEdit = async (data) => {
    const response = await api.post(`/v1/auth/edit-profile`, data);
    return response.data;
}
