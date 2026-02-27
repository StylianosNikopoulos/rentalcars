package com.example.rentalcars.features.reservation.infrastructure.adapter.outbound.external.payment;

import com.example.rentalcars.core.valueobject.Money;
import com.example.rentalcars.features.payment.domain.port.outbound.PaymentGateway;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StripePaymentAdapter implements PaymentGateway {

    @Value("${stripe.api.key}")
    private String apiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = apiKey;
    }

    @Override
    public String createPaymentIntent(Money amount, String reservationId) {
        try {
            long amountInCents = amount.amount().multiply(new java.math.BigDecimal(100)).longValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(amount.currency().toLowerCase())
                    .putMetadata("reservation_id", reservationId)
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            return intent.getClientSecret();
        } catch (Exception e) {
            throw new RuntimeException("Stripe payment failed: " + e.getMessage());
        }
    }
}