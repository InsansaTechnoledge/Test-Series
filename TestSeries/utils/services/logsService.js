import api from './api'

export const getUsersAndStudentLogs = async () => {
    const res = await api.get('/v1/logs/active-users')
    return res.data;
}