package com.example.rentalcars.features.reservation.domain.exception;

import java.util.UUID;

public class ReservationNotFoundException extends RuntimeException {

    public ReservationNotFoundException(String message) {
        super(message);
    }

    public ReservationNotFoundException(UUID id) {
        super("Reservation with ID " + id + " not found");
    }
}