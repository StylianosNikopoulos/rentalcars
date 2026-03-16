package com.example.rentalcars.features.auth.infrastructure.adapter.inbound.rest.dto;

import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UserResponse;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UserResponse user;
}