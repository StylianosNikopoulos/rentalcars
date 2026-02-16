package com.example.rentalcars.features.user.domain;

import lombok.Builder;
import lombok.Getter;
import java.util.UUID;

@Getter
@Builder
public class User {
    private final UUID id;
    private final String email;
    private final String passwordHash;
    private final Role role;
    private final String firstName;
    private final String lastName;
    private final CustomerProfile profile;
}