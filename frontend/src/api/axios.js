import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.token) {
            config.headers.Authorization = `Bearer ${userData.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default api;