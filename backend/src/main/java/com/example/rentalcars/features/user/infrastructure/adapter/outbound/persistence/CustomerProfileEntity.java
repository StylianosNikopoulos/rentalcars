package com.example.rentalcars.features.user.infrastructure.adapter.outbound.persistence;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "customer_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProfileEntity {
    @Id
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private UserJpaEntity user;

    private String phoneNumber;
    private String address;
    private String driverLicenseNumber;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}