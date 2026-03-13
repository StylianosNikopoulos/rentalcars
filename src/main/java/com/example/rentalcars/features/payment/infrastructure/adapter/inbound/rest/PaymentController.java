package com.example.rentalcars.features.payment.infrastructure.adapter.inbound.rest;

import com.example.rentalcars.features.payment.domain.port.inbound.PaymentService;
import com.example.rentalcars.features.payment.infrastructure.adapter.inbound.rest.dto.PaymentResponse;
import com.example.rentalcars.features.reservation.domain.port.inbound.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final ReservationService reservationService;

    @PostMapping("/initiate/{reservationId}")
    public ResponseEntity<PaymentResponse> initiatePayment(@PathVariable UUID reservationId) {
        var reservation = reservationService.getReservationById(reservationId);
        String secret = paymentService.initiatePayment(reservation.getId(), reservation.getTotalAmount());

        PaymentResponse response = PaymentResponse.builder()
                .clientSecret(secret)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{paymentId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> handleManualRefund(@PathVariable String paymentId) {
        paymentService.refundPayment(paymentId);
        return ResponseEntity.ok("Refund processed successfully");
    }
}
