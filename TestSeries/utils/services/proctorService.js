import api from "./api";

export const fetchEventsAnomaly = async () => {
    const response = await api.get('v1/proctor/get-events');
    return response.data;
}

export const stopExamForStudent = async (studentId) => {
    const response = await api.patch(`/v1/proctor/stop/${studentId}`);
    return response.data;
  };

  export const checkToStopExamForStudent = async (studentId) => {
    const response = await api.get(`/v1/proctor/check-stop/${studentId}`);
    return response.data;
  };