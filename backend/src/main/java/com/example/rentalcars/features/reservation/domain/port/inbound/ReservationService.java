package com.example.rentalcars.features.reservation.domain.port.inbound;

import com.example.rentalcars.features.reservation.domain.model.Reservation;
import java.util.List;
import java.util.UUID;

public interface ReservationService {
    List<Reservation> getMyReservations();
    List<Reservation> getAllReservations();
    Reservation getReservationById(UUID id);
    Reservation createReservation(Reservation reservation);
    List<Reservation> markAsActive(UUID reservationId);
    List<Reservation> markAsCompleted(UUID reservationId);
    void cancelReservation(UUID reservationId, String userEmail);
    void cancelReservationInternal(UUID reservationId);
    void confirmReservation(UUID reservationId);
}
