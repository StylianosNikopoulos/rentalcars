package com.example.rentalcars.features.payment.domain.port.inbound;

import java.util.UUID;

public interface PaymentService {
    String initiatePayment(UUID reservationId);
    void processSuccessfulPayment(String stripeIntentId);
    void refundPayment(String stripePaymentId);
    void processFailedPayment(String stripePaymentId);
}