package com.example.rentalcars.features.reservation.domain.port.outbound;

import com.example.rentalcars.core.valueobject.DateRange;
import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.domain.model.ReservationStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository {
    Reservation save(Reservation reservation);
    Optional<Reservation> findById (UUID id);
    List<Reservation> findByUserId(UUID userId);
    List<Reservation> findAll();
    List<Reservation> findByVehicleId(UUID vehicleId);
    boolean existsOverlap(UUID vehicleId, DateRange period);
    List<Reservation> findAllByUserIdAndStatusIn(UUID userId, List<ReservationStatus> statuses);}
