package com.example.rentalcars.features.vehicle.infrastructure.adapter.outbound.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface VehicleJpaRepository extends JpaRepository<VehicleJpaEntity, UUID> {
    Optional<VehicleJpaEntity> findByLicensePlate(String licensePlate);
}
