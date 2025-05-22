import api from "./api";

export const fetchQuestionsbyExam = async (examId) => {
    const response = await api.get(`v1/question?exam_id=${examId}`);
    return response.data;
}

export const fetchExamById = async (examId) => {
    const response = await api.get(`v1/exam?id=${examId}`);
    return response.data;
}