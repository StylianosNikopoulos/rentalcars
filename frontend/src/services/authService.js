import api from '../api/axios';

const authService = {
    login: async (loginRequest) => {
            const response = await api.post('/auth/login', loginRequest);
            if (response.data && response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data; 
        },

    register: async (registerRequest) => {
            const response = await api.post('/auth/register', registerRequest);
            if (response.data && response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default authService;