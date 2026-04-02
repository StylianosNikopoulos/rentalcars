import api from '../api/axios';

const reservationService = {
    getMyReservations: async () => {
        const response = await api.get('/reservations/me');
        return response.data;
    }, 

    getReservation: async (id) => {
        const response = await api.get(`/reservations/${id}`);
        return response.data;
    }, 

    createReservation: async (reservationData) => {
        const response = await api.post('/reservations',reservationData);
        return response.data;
    }, 

    cancelReservation: async (id) => {
        const response = await api.patch(`/reservations/${id}/cancel`);
        return response.data;
    },

    getVehicleReservations: async (vehicleId) => {
        const response = await api.get(`/reservations/vehicle/${vehicleId}`);
        return response.data; 
    }
};

export default reservationService;