package com.example.rentalcars.features.user.domain.port.outbound;

import com.example.rentalcars.features.user.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    User save(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findById(UUID id);
    Page<User> findAll(Pageable pageable);
    Optional<User> findByResetToken(String token);
}
