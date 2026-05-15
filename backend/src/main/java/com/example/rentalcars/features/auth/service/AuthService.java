package com.example.rentalcars.features.auth.service;

import com.example.rentalcars.features.auth.domain.exception.EmailAlreadyExistsException;
import com.example.rentalcars.features.auth.domain.exception.InvalidCredentialsException;
import com.example.rentalcars.features.auth.domain.port.inbound.AuthUseCase;
import com.example.rentalcars.features.auth.domain.port.outbound.IdentityPort;
import com.example.rentalcars.features.auth.domain.port.outbound.RefreshTokenRepository;
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
    private final RefreshTokenRepository refreshTokenRepository;
    private final RefreshTokenService refreshTokenService;

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            identityPort.authenticate(request.getEmail(), request.getPassword());
        } catch (Exception e) {
            throw new InvalidCredentialsException();
        }

        var user = userService.getInternalUserByEmail(request.getEmail());
        var token = identityPort.generateTokens(user);

        return AuthResponse.builder()
                .accessToken(token.getAccessToken())
                .refreshToken(token.getRefreshToken())
                .user(userRestMapper.toResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException();
        }

        var userRequest = UserRequest.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        var user = userService.register(userRequest);
        var token = identityPort.generateTokens(user);

        return AuthResponse.builder()
                .accessToken(token.getAccessToken())
                .refreshToken(token.getRefreshToken())
                .user(userRestMapper.toResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String tokenValue) {
        return refreshTokenRepository.findByToken(tokenValue)
                .map(refreshTokenService::verifyExpiration)
                .map(token -> {
                    var user = token.getUser();

                    // Only one device for now (Single Session Policy)
                    refreshTokenRepository.deleteByUserId(user.getId());
                    var newTokens = identityPort.generateTokens(user);

                    return AuthResponse.builder()
                            .accessToken(newTokens.getAccessToken())
                            .refreshToken(newTokens.getRefreshToken())
                            .user(userRestMapper.toResponse(user))
                            .build();
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}