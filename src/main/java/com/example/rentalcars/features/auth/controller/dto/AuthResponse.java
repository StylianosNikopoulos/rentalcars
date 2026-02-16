package com.example.rentalcars.features.auth.controller.dto;

import com.example.rentalcars.features.user.controller.dto.UserResponse;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UserResponse user;
}