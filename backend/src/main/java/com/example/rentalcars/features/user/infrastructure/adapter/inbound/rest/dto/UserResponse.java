package com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto;

import com.example.rentalcars.features.user.domain.model.Role;
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