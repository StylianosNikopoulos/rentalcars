package com.example.rentalcars.features.payment.domain.exception;

import com.example.rentalcars.core.exception.BusinessException;

public class StripePaymentException extends BusinessException {

    public StripePaymentException(String message, String code) {
        super(message, code);
    }
}
