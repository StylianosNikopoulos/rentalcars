package com.example.rentalcars.features.reservation.domain.port.inbound;

import com.example.rentalcars.features.reservation.domain.model.Reservation;
import java.util.List;
import java.util.UUID;

public interface ReservationService {
    Reservation createReservation(Reservation reservation);
    List<Reservation> getMyReservations(UUID userId);
    void cancelReservation(UUID reservationId);
    Reservation getReservationById(UUID id);
}
