import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8080/api',
    withCredentials: true // Important for sending HttpOnly cookies
});

export default api;
