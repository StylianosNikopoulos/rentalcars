package com.example.rentalcars.features.vehicle.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.vehicle.domain.model.FuelType;
import com.example.rentalcars.features.vehicle.domain.model.VehicleStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
public class VehicleJpaEntity {
    @Id
    private UUID id;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private int year;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    @Column(unique = true)
    private String licensePlate;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    private BigDecimal dailyPrice;

    @Version
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
