package com.example.rentalcars.features.user.domain.model;

import lombok.Builder;
import lombok.Getter;
import java.util.UUID;

@Getter
@Builder
public class CustomerProfile {
    private final UUID id;
    private final String phoneNumber;
    private final String address;
    private final String driverLicenseNumber;
}