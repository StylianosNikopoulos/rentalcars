package com.example.rentalcars.features.user.domain.port.outbound;

import com.example.rentalcars.features.user.domain.model.User;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    User save(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findById(UUID id);
    void deleteById(UUID id);
}
