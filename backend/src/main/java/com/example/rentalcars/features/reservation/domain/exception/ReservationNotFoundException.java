package com.example.rentalcars.features.reservation.domain.exception;

import com.example.rentalcars.core.exception.NotFoundException;
import java.util.UUID;

public class ReservationNotFoundException extends NotFoundException {

    public ReservationNotFoundException(UUID id) {
        super("Reservation with ID " + id + " not found", "RESERVATION_NOT_FOUND");
    }
}