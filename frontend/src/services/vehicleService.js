import api from '../api/axios';

const vehicleService = {
    getAllVehicles: async () => {
        const response = await api.get('/vehicles');
        return response.data;
    }, 

    getVehicleById: async (id) => {
        const response = await api.get(`/vehicles/${id}`);
        return response.data;
    }
};

export default vehicleService;