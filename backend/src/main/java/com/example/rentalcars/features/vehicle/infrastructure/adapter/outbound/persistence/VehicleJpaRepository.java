package com.example.rentalcars.features.vehicle.infrastructure.adapter.outbound.persistence;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleJpaRepository extends JpaRepository<VehicleJpaEntity, UUID> {
    Optional<VehicleJpaEntity> findByLicensePlate(String licensePlate);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM VehicleJpaEntity v WHERE v.id = :id")
    Optional<VehicleJpaEntity> findByIdWithLock(@Param("id") UUID id);

    @Query("SELECT v FROM VehicleJpaEntity v WHERE v.status = 'AVAILABLE' and v.id NOT IN (" +
            "SELECT r.vehicleId FROM ReservationJpaEntity r " +
            "WHERE r.status <> 'CANCELLED' " +
            "AND r.startDate < :end AND r.endDate > :start)")
    List<VehicleJpaEntity> findAvailableVehicles(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
            );
}
