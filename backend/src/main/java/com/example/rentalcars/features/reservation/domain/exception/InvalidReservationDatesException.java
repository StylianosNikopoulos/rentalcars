package com.example.rentalcars.features.reservation.domain.exception;

import com.example.rentalcars.core.exception.BusinessException;

public class InvalidReservationDatesException extends BusinessException {
    public InvalidReservationDatesException(String message) {
        super(message, "INVALID_DATES");
    }

    public InvalidReservationDatesException() {
        super("Invalid reservation dates", "INVALID_DATES");
    }
}