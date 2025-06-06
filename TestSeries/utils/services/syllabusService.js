import api from './api';


export const fetchSyllabusById = async (syllabusId) => {
    const response = await api.get(`/v1/syllabus/${syllabusId}`);
    return response.data;
  };
  