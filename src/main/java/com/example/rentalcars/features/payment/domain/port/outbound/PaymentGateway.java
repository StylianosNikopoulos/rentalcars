package com.example.rentalcars.features.payment.domain.port.outbound;

import com.example.rentalcars.core.valueobject.Money;
import com.example.rentalcars.features.payment.domain.model.PaymentIntentResponse;

public interface PaymentGateway {
    PaymentIntentResponse createPaymentIntent(Money amount, String reservationId);
}
