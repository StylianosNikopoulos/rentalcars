package com.example.rentalcars.features.payment.domain.exception;

import com.example.rentalcars.core.exception.BusinessException;

public class PaymentNotFoundException extends BusinessException {

    public PaymentNotFoundException(String stripeId) {
        super("Payment record not found for Stripe ID: " + stripeId, "PAYMENT_NOT_FOUND");
    }
}
