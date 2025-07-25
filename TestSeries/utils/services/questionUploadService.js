import api from './api';

export const addExamAPI = async (data) => {
    const response = await api.post('/v1/exam', data); 
    return response.data;
  };

  export const uploadExamQuestions = async ({ exam_id, organization_id, questions }) => {
    const res = await api.post('/v1/exam/upload-json', {
      exam_id,
      organization_id,
      questions
    });
    return res.data;
  };    

  export const fetchQuestionBankForOrganization = async ({organization_id}) => {
    const res = await api.get('/v1/question', {
      params: { organization_id }
    })

    return res.data;
  }