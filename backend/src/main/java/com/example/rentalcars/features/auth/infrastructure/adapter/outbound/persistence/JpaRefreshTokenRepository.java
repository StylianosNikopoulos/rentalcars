package com.example.rentalcars.features.auth.infrastructure.adapter.outbound.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface JpaRefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {
    Optional<RefreshTokenEntity> findByToken(String token);
    void deleteByUserId(UUID userId);
}