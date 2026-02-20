package com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest;

import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.domain.port.inbound.ReservationService;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto.ReservationRequest;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto.ReservationResponse;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.mapper.ReservationRestMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRestMapper restMapper;
    private final ReservationService reservationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(@PathVariable UUID userId){
        List<Reservation> reservations = reservationService.getMyReservations(userId);
        return ResponseEntity.ok(restMapper.toResponseList(reservations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getMyReservation(@PathVariable UUID id){
        Reservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(restMapper.toResponse(reservation));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN','CUSTOMER')")
    public ResponseEntity<ReservationResponse> create(@RequestBody ReservationRequest request){
        Reservation reservation = restMapper.toDomain(request);
        Reservation created = reservationService.createReservation(reservation);
        return new ResponseEntity<>(restMapper.toResponse(created), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void cancel(@PathVariable UUID id) {
        reservationService.cancelReservation(id);
    }
}
