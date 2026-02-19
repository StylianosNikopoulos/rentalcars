package com.example.rentalcars.features.auth.domain.model;

import lombok.Value;

@Value
public class AuthenticationToken {
    String accessToken;
    String email;
    String role;
}