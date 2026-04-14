package com.example.rentalcars.features.reservation.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.reservation.domain.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReservationJpaRepository extends JpaRepository<ReservationJpaEntity, UUID> {
    List<ReservationJpaEntity> findByUserId(UUID id);

    @Query("SELECT COUNT(r) > 0 FROM ReservationJpaEntity r " +
            "WHERE r.vehicleId = :vehicleId " +
            "AND r.status != 'CANCELLED' " +
            "AND (:startDate < r.endDate AND :endDate > r.startDate)")
    boolean existsOverlappingReservations(
            @Param("vehicleId") UUID vehicleId,
            @Param(("startDate")) LocalDateTime startDate,
            @Param("endDate")LocalDateTime endDate
            );

    List<ReservationJpaEntity> findByVehicleId(UUID vehicleId);
    List<ReservationJpaEntity> findAllByUserIdAndStatusIn(UUID userId, List<ReservationStatus> statuses);
    List<ReservationJpaEntity> findAllByStatusAndCreatedAtBefore(ReservationStatus status, LocalDateTime dateTime);
}
