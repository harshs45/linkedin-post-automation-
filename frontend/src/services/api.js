import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export const generatePosts = async (topic, context) => {
    const response = await api.post('/posts/generate', { topic, context });
    return response.data.posts;
};

export const regenerateSection = async (post, section) => {
    const response = await api.post('/posts/regenerate-section', { post, section });
    return response.data.newText;
};

export const schedulePost = async (postData) => {
    const response = await api.post('/posts/save', postData);
    return response.data;
};

export const fetchScheduledPosts = async () => {
    const response = await api.get('/posts');
    return response.data;
};

export default api;
