package com.example.rentalcars.features.auth.service;

import com.example.rentalcars.core.exception.BusinessException;
import com.example.rentalcars.features.auth.controller.dto.AuthResponse;
import com.example.rentalcars.features.auth.controller.dto.LoginRequest;
import com.example.rentalcars.features.auth.controller.dto.RegisterRequest;
import com.example.rentalcars.features.user.controller.dto.UserRequest;
import com.example.rentalcars.features.user.domain.UserRepository;
import com.example.rentalcars.features.user.infrastructure.mapper.UserMapper;
import com.example.rentalcars.features.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    public AuthResponse register(RegisterRequest request) {
        var userRequest = new UserRequest();
        userRequest.setEmail(request.getEmail());
        userRequest.setPassword(request.getPassword());
        userRequest.setFirstName(request.getFirstName());
        userRequest.setLastName(request.getLastName());

        var user = userService.register(userRequest);
        var token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .user(userMapper.toResponse(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Invalid credentials", "BAD_CREDENTIALS"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("Invalid credentials", "BAD_CREDENTIALS");
        }

        var token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .user(userMapper.toResponse(user))
                .build();
    }
}