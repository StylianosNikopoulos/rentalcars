package com.example.rentalcars.features.user.controller.dto;

import com.example.rentalcars.features.user.domain.Role;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class UserResponse {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}