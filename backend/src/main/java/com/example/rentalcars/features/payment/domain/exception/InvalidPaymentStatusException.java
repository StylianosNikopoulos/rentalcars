package com.example.rentalcars.features.payment.domain.exception;

import com.example.rentalcars.core.exception.BusinessException;

public class InvalidPaymentStatusException extends BusinessException {

    public InvalidPaymentStatusException(String message) {
        super(message, "INVALID_PAYMENT_STATUS");
    }
}
