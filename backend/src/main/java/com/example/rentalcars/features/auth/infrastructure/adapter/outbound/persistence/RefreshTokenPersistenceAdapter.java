package com.example.rentalcars.features.auth.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.auth.domain.model.RefreshToken;
import com.example.rentalcars.features.auth.domain.port.outbound.RefreshTokenRepository;
import com.example.rentalcars.features.user.infrastructure.adapter.outbound.persistence.UserPersistenceMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class RefreshTokenPersistenceAdapter implements RefreshTokenRepository {

    private final JpaRefreshTokenRepository jpaRepository;
    private final UserPersistenceMapper userMapper;

    @Override
    public RefreshToken save(RefreshToken domain) {
        RefreshTokenEntity entity = RefreshTokenEntity.builder()
                .id(domain.getId())
                .token(domain.getToken())
                .user(userMapper.toEntity(domain.getUser()))
                .expiryDate(domain.getExpiryDate())
                .revoked(domain.isRevoked())
                .build();

        jpaRepository.save(entity);
        return domain;
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return jpaRepository.findByToken(token)
                .map(entity -> RefreshToken.builder()
                        .id(entity.getId())
                        .token(entity.getToken())
                        .user(userMapper.toDomain(entity.getUser()))
                        .expiryDate(entity.getExpiryDate())
                        .revoked(entity.isRevoked())
                        .build());
    }

    @Override
    @Transactional
    public void deleteByUserId(UUID userId) {
        jpaRepository.deleteByUserId(userId);
    }
}