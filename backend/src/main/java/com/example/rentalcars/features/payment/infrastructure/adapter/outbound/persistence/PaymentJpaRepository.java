package com.example.rentalcars.features.payment.infrastructure.adapter.outbound.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PaymentJpaRepository extends JpaRepository<PaymentJpaEntity, UUID> {
    Optional<PaymentJpaEntity> findByStripePaymentId(String stripePaymentId);
    Optional<PaymentJpaEntity> findByReservationId(UUID reservationId);
}