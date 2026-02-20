package com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReservationRequest(
        UUID vehicleId,
        LocalDateTime startDate,
        LocalDateTime endDate
) {}