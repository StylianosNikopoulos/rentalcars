package com.example.rentalcars.features.auth.domain.model;

import com.example.rentalcars.features.user.domain.model.User;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class RefreshToken {
    private UUID id;
    private String token;
    private User user;
    private Instant expiryDate;
    private boolean revoked;

    public boolean isExpired() {
        return expiryDate.isBefore(Instant.now());
    }
}