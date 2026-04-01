package com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequest {
    @NotNull
    private UUID vehicleId;

    @NotNull
    @FutureOrPresent(message = "Start date cannot be in the past")
    private LocalDateTime startDate;

    @NotNull
    @Future(message = "End date must be in the future")
    private LocalDateTime endDate;
}