package com.example.rentalcars.features.auth.domain.port.outbound;

import com.example.rentalcars.features.auth.domain.model.RefreshToken;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository {
    RefreshToken save(RefreshToken refreshToken);
    Optional<RefreshToken> findByToken(String token);
    void deleteByUserId(UUID userId);
}