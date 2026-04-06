package com.example.rentalcars.features.user.domain.port.inbound;

import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UpdateUserRequest;
import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UserRequest;
import com.example.rentalcars.features.user.domain.model.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    User getUserById(UUID id);
    User getUserByEmail(String email);
    User getInternalUserByEmail(String email);
    User register(UserRequest request);
    User update(UUID id, UpdateUserRequest request);
    List<User> getAllUsers();
    void delete(UUID id);
    boolean existsByEmail(String email);
}
