package com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest;

import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.domain.port.inbound.ReservationService;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto.ReservationResponse;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.mapper.ReservationRestMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/reservations")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminReservationController {

    private final ReservationService reservationService;
    private final ReservationRestMapper restMapper;

    @PatchMapping("/{id}/pick-up")
    public ResponseEntity<List<ReservationResponse>> pickUp(@PathVariable UUID id) {
        List<Reservation> allReservations = reservationService.markAsActive(id);
        return ResponseEntity.ok(restMapper.toResponseList(allReservations));
    }

    @PatchMapping("/{id}/return")
    public ResponseEntity<List<ReservationResponse>> returnVehicle(@PathVariable UUID id) {
        List<Reservation> allReservations = reservationService.markAsCompleted(id);
        return ResponseEntity.ok(restMapper.toResponseList(allReservations));
    }
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(restMapper.toResponseList(reservations));
    }
}