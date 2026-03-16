package com.example.rentalcars.features.auth.domain.port.outbound;

import com.example.rentalcars.features.auth.domain.model.AuthenticationToken;

public interface IdentityPort {
    void authenticate(String email, String password);
    AuthenticationToken generateToken(String email);
}