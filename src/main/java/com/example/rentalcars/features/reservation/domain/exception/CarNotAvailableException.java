package com.example.rentalcars.features.reservation.domain.exception;

public class CarNotAvailableException extends RuntimeException {
  public CarNotAvailableException() {
    super("The car is already booked for these dates.");
  }
}
