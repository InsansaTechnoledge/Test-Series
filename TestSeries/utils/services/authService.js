import api from './api';


export const orgLogin=(data)=>{
    const response=api.post(`/v1/auth/org-login`,
        data
    );
    return response.data;
}

export const studentLogin=(data)=>{
    const response=api.post(`/v1/auth/student-login`,data);
    return response.data;
}

