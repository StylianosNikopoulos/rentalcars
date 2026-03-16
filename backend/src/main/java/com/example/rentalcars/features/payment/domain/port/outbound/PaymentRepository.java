package com.example.rentalcars.features.payment.domain.port.outbound;

import com.example.rentalcars.features.payment.domain.model.Payment;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository {
    Payment save(Payment payment);
    Optional<Payment> findByStripeId(String stripeId);
    Optional<Payment> findById(UUID id);
    Optional<Payment> findByReservationId(UUID reservationId);
}