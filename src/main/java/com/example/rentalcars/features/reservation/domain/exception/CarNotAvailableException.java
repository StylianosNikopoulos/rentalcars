package com.example.rentalcars.features.reservation.domain.exception;

import com.example.rentalcars.core.exception.BusinessException;

public class CarNotAvailableException extends BusinessException {
  public CarNotAvailableException() {
    super("The car is already booked for these dates.", "CAR_NOT_AVAILABLE");  }
}
