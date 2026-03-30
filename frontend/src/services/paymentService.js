import api from '../api/axios';

const paymentService = {

    handleStripeEvent: async () => {
        const response = await api.post('/payments/webhook');
        return response.data;
    }, 

    initiatePayment: async (reservationId) => {
        const response = await api.post(`/payments/initiate/${reservationId}`);
        return response.data; 
    },

    handleManualRefund: async (paymentId) => {
        const response = await api.post(`/payments/${paymentId}/refund`);
        return response.data;
    }
};

export default paymentService;