import api from '../api/axios';

const vehicleService = {
    getAllVehicles: async (page = 0, size = 9, sortOrder = 'default', searchTerm = '') => {
        let sortParam = 'id,desc';
        if (sortOrder === 'low') sortParam = 'dailyPrice,asc';
        if (sortOrder === 'high') sortParam = 'dailyPrice,desc';

        const response = await api.get('/vehicles', {
            params: {
                page: page,
                size: size,
                sort: sortParam,
                search: searchTerm
            }
        });
        return response.data;
    },

    getVehicleById: async (id) => {
        const response = await api.get(`/vehicles/${id}`);
        return response.data;
    },
  
    getAvailableVehicles: async (startDate, endDate) => {
        const startISO = `${startDate}T00:00:00`;
        const endISO = `${endDate}T23:59:59`;

        const response = await api.get('/vehicles/available', {
            params: {
                start: startISO,
                end: endISO
            }
        });
        return response.data;
    },

    createVehicle: async (vehicleData) => {
        const response = await api.post('/vehicles', vehicleData);
        return response.data;
    },

    updateVehicle: async (id, vehicleData) => {
        const response = await api.patch(`/vehicles/${id}`, vehicleData);
        return response.data;
    },

    deleteVehicle: async (id) => {
        await api.delete(`/vehicles/${id}`);
    }
};

export default vehicleService;