package com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReservationResponse(
        UUID id,
        UUID userId,
        UUID vehicleId,
        LocalDateTime startDate,
        LocalDateTime endDate,
        BigDecimal totalAmount,
        String status
) {}