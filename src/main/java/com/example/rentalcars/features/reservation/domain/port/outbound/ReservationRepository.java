package com.example.rentalcars.features.reservation.domain.port.outbound;

import com.example.rentalcars.core.valueobject.DateRange;
import com.example.rentalcars.features.reservation.domain.model.Reservation;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository {
    Reservation save(Reservation reservation);
    Optional<Reservation> findById (UUID id);
    List<Reservation> findByUserId(UUID userId);
    boolean existsOverlap(UUID vehicleId, DateRange period);
}
