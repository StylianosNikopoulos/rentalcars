package com.example.rentalcars.features.user.domain.exception;

import com.example.rentalcars.core.exception.NotFoundException;
import java.util.UUID;

public class UserNotFoundException extends NotFoundException {
    public UserNotFoundException(UUID id) {
        super("User with ID " + id + " not found", "USER_NOT_FOUND");
    }

    public UserNotFoundException(String email) {
        super("User with email " + email + " not found", "USER_NOT_FOUND");
    }
}