package com.example.rentalcars.features.user.service;

import com.example.rentalcars.features.user.controller.dto.UserRequest;
import com.example.rentalcars.features.user.domain.User;
import java.util.UUID;

public interface UserService {
    User getUserById(UUID id);
    User getUserByEmail(String email);
    User register(UserRequest request);
}
