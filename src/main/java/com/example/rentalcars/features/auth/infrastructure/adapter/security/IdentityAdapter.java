package com.example.rentalcars.features.auth.infrastructure.adapter.security;

import com.example.rentalcars.features.auth.domain.model.AuthenticationToken;
import com.example.rentalcars.features.auth.domain.port.outbound.IdentityPort;
import com.example.rentalcars.features.user.domain.port.inbound.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class IdentityAdapter implements IdentityPort {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    @Override
    public void authenticate(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }

    @Override
    public AuthenticationToken generateToken(String email) {
        var user = userService.getUserByEmail(email);
        String token = jwtService.generateToken(user);
        return new AuthenticationToken(token, user.getEmail(), user.getRole().name());
    }
}