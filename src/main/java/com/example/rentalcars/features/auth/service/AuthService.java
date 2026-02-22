package com.example.rentalcars.features.auth.service;

import com.example.rentalcars.features.auth.domain.port.inbound.AuthUseCase;
import com.example.rentalcars.features.auth.domain.port.outbound.IdentityPort;
import com.example.rentalcars.features.auth.infrastructure.adapter.inbound.rest.dto.AuthResponse;
import com.example.rentalcars.features.auth.infrastructure.adapter.inbound.rest.dto.LoginRequest;
import com.example.rentalcars.features.auth.infrastructure.adapter.inbound.rest.dto.RegisterRequest;
import com.example.rentalcars.features.auth.infrastructure.adapter.inbound.rest.mapper.UserRestMapper;
import com.example.rentalcars.features.user.domain.port.inbound.UserService;
import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService implements AuthUseCase {

    private final IdentityPort identityPort;
    private final UserService userService;
    private final UserRestMapper userRestMapper;

    @Override
    public AuthResponse login(LoginRequest request) {
        identityPort.authenticate(request.getEmail(), request.getPassword());
        var user = userService.getInternalUserByEmail(request.getEmail());
        var token = identityPort.generateToken(request.getEmail());

        return AuthResponse.builder()
                .token(token.getAccessToken())
                .user(userRestMapper.toResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        var userRequest = UserRequest.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        var user = userService.register(userRequest);
        var token = identityPort.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token.getAccessToken())
                .user(userRestMapper.toResponse(user))
                .build();
    }
}