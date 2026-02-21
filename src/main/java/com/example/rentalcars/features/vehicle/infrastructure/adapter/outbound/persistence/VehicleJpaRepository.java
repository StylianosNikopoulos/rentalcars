package com.example.rentalcars.features.vehicle.infrastructure.adapter.outbound.persistence;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.UUID;

public interface VehicleJpaRepository extends JpaRepository<VehicleJpaEntity, UUID> {
    Optional<VehicleJpaEntity> findByLicensePlate(String licensePlate);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM VehicleJpaEntity v WHERE v.id = :id")
    Optional<VehicleJpaEntity> findByIdWithLock(@Param("id") UUID id);
}
