package com.example.rentalcars.features.payment.domain.port.outbound;

import com.example.rentalcars.core.valueobject.Money;

public interface PaymentGateway {
    String createPaymentIntent(Money amount, String reservationId);
}
