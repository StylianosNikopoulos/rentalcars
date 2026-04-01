package com.example.rentalcars.features.auth.domain.exception;

import com.example.rentalcars.core.exception.BusinessException;

public class EmailAlreadyExistsException extends BusinessException {
    public EmailAlreadyExistsException(String message) {
      super(message, "EMAIL_ALREADY_EXISTS");
    }

  public EmailAlreadyExistsException() {
    super("This email is already registered.", "INVALID_DATES");
  }
}
