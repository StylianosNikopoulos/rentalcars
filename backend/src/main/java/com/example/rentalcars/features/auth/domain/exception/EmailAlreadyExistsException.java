package com.example.rentalcars.features.auth.domain.exception;

import com.example.rentalcars.core.exception.BusinessException;

public class EmailAlreadyExistsException extends BusinessException {

      public EmailAlreadyExistsException() {
          super("This email is already registered.", "EMAIL_ALREADY_EXISTS");
      }
}
