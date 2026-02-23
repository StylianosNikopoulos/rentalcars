package com.example.rentalcars.features.reservation.service;

import com.example.rentalcars.core.valueobject.Money;
import com.example.rentalcars.features.reservation.domain.exception.CarNotAvailableException;
import com.example.rentalcars.features.reservation.domain.exception.InvalidReservationDatesException;
import com.example.rentalcars.features.reservation.domain.exception.ReservationNotFoundException;
import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.domain.model.ReservationStatus;
import com.example.rentalcars.features.reservation.domain.port.inbound.ReservationService;
import com.example.rentalcars.features.reservation.domain.port.outbound.ReservationRepository;
import com.example.rentalcars.features.user.domain.exception.UserNotFoundException;
import com.example.rentalcars.features.user.domain.port.outbound.UserRepository;
import com.example.rentalcars.features.vehicle.domain.exception.VehicleNotFoundException;
import com.example.rentalcars.features.vehicle.domain.port.outbound.VehicleRepository;
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
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Reservation createReservation(Reservation reservation) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (!isAdmin(auth)) {
            String email = auth.getName();
            var user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UserNotFoundException(email));
            reservation.setUserId(user.getId());
        }

        if (reservation.getPeriod() == null) {
            throw new InvalidReservationDatesException();
        }
        var vehicle = vehicleRepository.findByIdWithLock(reservation.getVehicleId())
                .orElseThrow(() -> new VehicleNotFoundException(reservation.getVehicleId()));

        if (reservationRepository.existsOverlap(reservation.getVehicleId(), reservation.getPeriod())) {
            throw new CarNotAvailableException();
        }

        reservation.calculateTotal(new Money(vehicle.getDailyPrice(),"EUR"));
        reservation.setStatus(ReservationStatus.PENDING);
        return reservationRepository.save(reservation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> getMyReservations() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        return reservationRepository.findByUserId(user.getId());
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
        reservation.cancel();
        reservationRepository.save(reservation);
    }

    // Helper method for security
    private void validateOwnership(Reservation reservation) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (isAdmin(auth)) {
            return;
        }

        String email = auth.getName();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        if (!reservation.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to do this action");
        }
    }

    // Helper method for admin check
    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}