package com.example.rentalcars.features.user.domain.port.outbound;

import com.example.rentalcars.features.user.domain.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    User save(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findById(UUID id);
    List<User> findAll();
    void deleteById(UUID id);
}
