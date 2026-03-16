package com.example.rentalcars.features.reservation.domain.exception;

import com.example.rentalcars.core.exception.BusinessException;

public class InvalidReservationDatesException extends BusinessException {
    public InvalidReservationDatesException() {
      super("End date must be after start date.", "INVALID_DATES");
    }
}