package com.example.rentalcars.features.reservation.service;

import com.example.rentalcars.features.reservation.domain.exception.CarNotAvailableException;
import com.example.rentalcars.features.reservation.domain.exception.InvalidReservationDatesException;
import com.example.rentalcars.features.reservation.domain.exception.ReservationNotFoundException;
import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.domain.model.ReservationStatus;
import com.example.rentalcars.features.reservation.domain.port.inbound.ReservationService;
import com.example.rentalcars.features.reservation.domain.port.outbound.ReservationRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;

    @Override
    @Transactional
    public Reservation createReservation(Reservation reservation) {
        if (!reservation.isValid()) {
            throw new InvalidReservationDatesException();
        }

        boolean isOccupied = reservationRepository.existsOverlap(
                reservation.getVehicleId(),
                reservation.getStartDate(),
                reservation.getEndDate()
        );

        if (isOccupied){
            throw new CarNotAvailableException();
        }

        reservation.setStatus(ReservationStatus.PENDING);
        return reservationRepository.save(reservation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> getMyReservations(UUID userId) {
        return reservationRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public void cancelReservation(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(reservationId));

        reservation.setStatus(ReservationStatus.CANCELLED);

        reservationRepository.save(reservation);
    }

    @Override
    @Transactional(readOnly = true)
    public Reservation getReservationById(UUID id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ReservationNotFoundException(id));
    }
}