package com.example.rentalcars.features.user.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "customer_profiles")
@Getter
@Setter
public class CustomerProfileEntity {
    @Id
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserJpaEntity user;

    private String phoneNumber;
    private String address;
    private String driverLicenseNumber;
}