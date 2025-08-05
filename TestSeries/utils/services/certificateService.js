import api from './api'

export const getAllTemplatesAvailable = async() => {
    const response = await api.get('/v1/certificate/templates')
    return response
}

