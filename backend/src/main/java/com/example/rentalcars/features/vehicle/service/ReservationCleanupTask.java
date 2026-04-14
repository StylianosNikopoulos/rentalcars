package com.example.rentalcars.features.vehicle.service;

import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.domain.model.ReservationStatus;
import com.example.rentalcars.features.reservation.domain.port.outbound.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationCleanupTask {
    private final ReservationRepository reservationRepository;

    @Scheduled(fixedRate = 300000)  //runs every 5 minutes
    @Transactional
    public void cancelExpiredReservations(){
        LocalDateTime threshold = LocalDateTime.now().minusHours(1);
        List<Reservation> expired = reservationRepository.findAllExpiredPending(threshold);

        for (Reservation res : expired){
            res.setStatus(ReservationStatus.CANCELED);
            reservationRepository.save(res);
        }
    }
}
