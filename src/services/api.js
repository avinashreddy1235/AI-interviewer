import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

export const saveInterview = async (data) => {
    try {
        const response = await api.post('/interviews', data);
        return response.data;
    } catch (error) {
        console.error('Error saving interview:', error);
        throw error;
    }
};

export const getInterviews = async () => {
    try {
        const response = await api.get('/interviews');
        return response.data;
    } catch (error) {
        console.error('Error fetching interviews:', error);
        throw error;
    }
};

export const getInterviewById = async (id) => {
    try {
        const response = await api.get(`/interviews/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching interview details:', error);
        throw error;
    }
};

export default api;
