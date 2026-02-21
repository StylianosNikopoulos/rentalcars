package com.example.rentalcars.features.reservation.service;

import com.example.rentalcars.features.reservation.domain.exception.CarNotAvailableException;
import com.example.rentalcars.features.reservation.domain.exception.InvalidReservationDatesException;
import com.example.rentalcars.features.reservation.domain.exception.ReservationNotFoundException;
import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.domain.model.ReservationStatus;
import com.example.rentalcars.features.reservation.domain.port.inbound.ReservationService;
import com.example.rentalcars.features.reservation.domain.port.outbound.ReservationRepository;
import com.example.rentalcars.features.vehicle.domain.exception.VehicleNotFoundException;
import com.example.rentalcars.features.vehicle.infrastructure.adapter.outbound.persistence.VehicleJpaRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final VehicleJpaRepository vehicleRepository;

    @Override
    @Transactional
    public Reservation createReservation(Reservation reservation) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (!isAdmin(auth)) {
            reservation.setUserId(UUID.fromString(auth.getName()));
        }

        if (!reservation.isValid()) {
            throw new InvalidReservationDatesException();
        }

        vehicleRepository.findByIdWithLock(reservation.getVehicleId())
                .orElseThrow(() -> new VehicleNotFoundException(reservation.getVehicleId()));

        boolean isOccupied = reservationRepository.existsOverlap(
                reservation.getVehicleId(),
                reservation.getStartDate(),
                reservation.getEndDate()
        );

        if (isOccupied) {
            throw new CarNotAvailableException();
        }

        reservation.setStatus(ReservationStatus.PENDING);
        return reservationRepository.save(reservation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> getMyReservations(UUID userId) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (!isAdmin(auth) && !userId.toString().equals(auth.getName())) {
            throw new AccessDeniedException("Cannot view reservations of another user");
        }

        return reservationRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Reservation getReservationById(UUID id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ReservationNotFoundException(id));

        validateOwnership(reservation);
        return reservation;
    }

    @Override
    @Transactional
    public void cancelReservation(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));

        validateOwnership(reservation);
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    // Helper method for security
    private void validateOwnership(Reservation reservation) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth) && !reservation.getUserId().toString().equals(auth.getName())) {
            throw new AccessDeniedException("You don't have permission to access this reservation");
        }
    }

    // Helper method for admin check
    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}