package com.example.rentalcars.features.auth.domain.exception;

import com.example.rentalcars.core.exception.BusinessException;

public class InvalidCredentialsException extends BusinessException {

    public InvalidCredentialsException() {
        super("Invalid email or password.", "INVALID_CREDENTIALS");
    }
}
