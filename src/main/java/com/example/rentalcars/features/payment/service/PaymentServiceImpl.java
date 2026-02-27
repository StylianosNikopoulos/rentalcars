package com.example.rentalcars.features.payment.service;

import com.example.rentalcars.core.exception.StripePaymentException;
import com.example.rentalcars.features.payment.domain.exception.PaymentNotFoundException;
import com.example.rentalcars.features.payment.domain.model.Payment;
import com.example.rentalcars.features.payment.domain.model.PaymentStatus;
import com.example.rentalcars.features.payment.domain.port.inbound.PaymentService;
import com.example.rentalcars.features.payment.domain.port.outbound.PaymentGateway;
import com.example.rentalcars.features.payment.domain.port.outbound.PaymentRepository;
import com.example.rentalcars.features.reservation.domain.exception.ReservationNotFoundException;
import com.example.rentalcars.features.reservation.domain.model.ReservationStatus;
import com.example.rentalcars.features.reservation.domain.port.outbound.ReservationRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentGateway paymentGateway;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public String initiatePayment(UUID reservationId) {
        var reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));

        String clientSecret = paymentGateway.createPaymentIntent(
                reservation.getTotalAmount(),
                reservationId.toString()
        );

        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .reservationId(reservationId)
                .amount(reservation.getTotalAmount())
                .stripePaymentId(clientSecret)
                .status(PaymentStatus.PENDING)
                .build();

        paymentRepository.save(payment);
        return clientSecret;
    }

    @Override
    @Transactional
    public void processSuccessfulPayment(String stripePaymentId) {
        var payment = paymentRepository.findByStripeId(stripePaymentId)
                .orElseThrow(() -> new PaymentNotFoundException(stripePaymentId));

        payment.setStatus(PaymentStatus.COMPLETED);
        paymentRepository.save(payment);

        var reservation = reservationRepository.findById(payment.getReservationId())
                .orElseThrow(()-> new ReservationNotFoundException(payment.getReservationId()));

        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservationRepository.save(reservation);
        //TODO: Send Confirmation Email
    }

    @Override
    @Transactional
    public void refundPayment(String stripePaymentId) {
        try {
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(stripePaymentId)
                    .build();

            Refund.create(params);

            var payment = paymentRepository.findByStripeId(stripePaymentId)
                    .orElseThrow(() -> new PaymentNotFoundException(stripePaymentId));

            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);

        } catch (StripeException e) {
            throw new StripePaymentException("Error communication with Stripe for Refund: " + e.getUserMessage());
        }
    }
}
