import api from "./api";

export const fetchEventsAnomaly = async () => {
    const response = await api.get('v1/proctor/get-events');
    return response.data;
}