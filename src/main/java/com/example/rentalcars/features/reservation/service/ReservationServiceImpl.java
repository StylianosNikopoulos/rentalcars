package com.example.rentalcars.features.reservation.service;

import com.example.rentalcars.core.valueobject.Money;
import com.example.rentalcars.features.payment.domain.port.inbound.PaymentService;
import com.example.rentalcars.features.reservation.domain.exception.CarNotAvailableException;
import com.example.rentalcars.features.reservation.domain.exception.InvalidReservationDatesException;
import com.example.rentalcars.features.reservation.domain.exception.ReservationNotFoundException;
import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.domain.model.ReservationStatus;
import com.example.rentalcars.features.reservation.domain.port.inbound.ReservationService;
import com.example.rentalcars.features.reservation.domain.port.outbound.ReservationRepository;
import com.example.rentalcars.features.user.domain.port.inbound.UserService;
import com.example.rentalcars.features.vehicle.domain.model.VehicleStatus;
import com.example.rentalcars.features.vehicle.domain.port.inbound.VehicleService;
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
    private final PaymentService paymentService;
    private final VehicleService vehicleService;
    private final UserService userService;

    @Override
    @Transactional
    public Reservation createReservation(Reservation reservation) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (!isAdmin(auth)) {
            var user = userService.getUserByEmail(auth.getName());
            reservation.setUserId(user.getId());
        }

        if (reservation.getPeriod() == null) {
            throw new InvalidReservationDatesException();
        }
        var vehicle = vehicleService.getVehicleById(reservation.getVehicleId());

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
        var user = userService.getUserByEmail(auth.getName());
        return reservationRepository.findByUserId(user.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
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
    public void cancelReservation(UUID reservationId, String userEmail) {
        var reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));

        validateOwnership(reservation);

        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            var payment = paymentService.getPaymentByReservationId(reservationId);
            paymentService.refundPayment(payment.getStripePaymentId());
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
        vehicleService.updateVehicleStatus(reservation.getVehicleId(), VehicleStatus.AVAILABLE);
    }

    @Override
    @Transactional
    public void confirmReservation(UUID reservationId) {
        var reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservationRepository.save(reservation);
    }

    @Override
    @Transactional
    public void cancelReservationInternal(UUID reservationId) {
        var reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    @Override
    @Transactional
    public List<Reservation> markAsActive(UUID reservationId) {
        var reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));

        if (reservation.getStatus() != ReservationStatus.CONFIRMED){
            throw new IllegalStateException("The reservation must be CONFIRMED for pick-up to take place. Current status: " + reservation.getStatus());
        }

        reservation.setStatus(ReservationStatus.ACTIVE);
        reservationRepository.save(reservation);

        vehicleService.updateVehicleStatus(reservation.getVehicleId(), VehicleStatus.RENTED);
        return reservationRepository.findAll();
    }

    @Override
    @Transactional
    public List<Reservation> markAsCompleted(UUID reservationId) {
        var reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));

        if (reservation.getStatus() != ReservationStatus.ACTIVE) {
            throw new IllegalStateException("Only ACTIVE reservations can be completed.");
        }

        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);

        vehicleService.updateVehicleStatus(reservation.getVehicleId(), VehicleStatus.AVAILABLE);
        return reservationRepository.findAll();
    }

    // Helper method for security
    private void validateOwnership(Reservation reservation) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (isAdmin(auth)) {
            return;
        }

        var user = userService.getUserByEmail(auth.getName());

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