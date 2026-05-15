package com.example.rentalcars.features.auth.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthenticationToken {
    String accessToken;
    String refreshToken;
    String email;
    String role;
}