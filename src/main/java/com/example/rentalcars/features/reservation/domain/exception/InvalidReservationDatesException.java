package com.example.rentalcars.features.reservation.domain.exception;

public class InvalidReservationDatesException extends RuntimeException {
  public InvalidReservationDatesException() {
    super("End date must be after start date.");
  }
}