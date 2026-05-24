package com.example.rentalcars.features.auth.domain.port.inbound;

import com.example.rentalcars.features.auth.infrastructure.adapter.inbound.rest.dto.AuthResponse;
import com.example.rentalcars.features.auth.infrastructure.adapter.inbound.rest.dto.LoginRequest;
import com.example.rentalcars.features.auth.infrastructure.adapter.inbound.rest.dto.RegisterRequest;
import com.example.rentalcars.features.auth.infrastructure.adapter.inbound.rest.dto.TokenRefreshRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public interface AuthUseCase {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse refreshToken(String token);
    void resetPassword(String token, String newPassword);
    void forgotPassword(String email);
}