// src/services/bloom.service.js
import api from './api'

export const validateBloom = async (questionText, bloomLevel) => {
  const response = await api.post('/v1/ai/validate-bloom', {
    questionText,
    bloomLevel
  })
  return response?.data?.data ?? response?.data
}
