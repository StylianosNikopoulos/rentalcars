package com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest;

import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.domain.port.inbound.ReservationService;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto.ReservationRequest;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto.ReservationResponse;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.mapper.ReservationRestMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRestMapper restMapper;
    private final ReservationService reservationService;

    @GetMapping("/me")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(){
        List<Reservation> reservations = reservationService.getMyReservations();
        return ResponseEntity.ok(restMapper.toResponseList(reservations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservation(@PathVariable UUID id){
        Reservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(restMapper.toResponse(reservation));
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> create(@Valid @RequestBody ReservationRequest request){
        Reservation reservation = restMapper.toDomain(request);
        Reservation created = reservationService.createReservation(reservation);
        return new ResponseEntity<>(restMapper.toResponse(created), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable UUID id, java.security.Principal principal) {
        reservationService.cancelReservation(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
