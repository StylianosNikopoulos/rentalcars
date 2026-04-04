package com.example.rentalcars.features.user.domain.model;

import com.example.rentalcars.core.domain.AggregateRoot;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class CustomerProfile extends AggregateRoot {
    private String phoneNumber;
    private String address;
    private String driverLicenseNumber;

    @Builder
    public CustomerProfile(UUID id, LocalDateTime createdAt, LocalDateTime updatedAt,
                           String phoneNumber, String address, String driverLicenseNumber) {
        super(id, createdAt, updatedAt);
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.driverLicenseNumber = driverLicenseNumber;
    }
}