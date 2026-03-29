import api from '../api/axios';

const userService = {
    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    }, 

    getUserByEmail: async (email) => {
        const response = await api.get(`/users/email/${email}`);
        return response.data;
    },
    
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    }
};

export default userService;