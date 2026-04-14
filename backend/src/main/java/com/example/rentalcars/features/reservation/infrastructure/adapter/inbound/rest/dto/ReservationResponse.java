package com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private UUID id;
    private String vehicleName;
    private String vehicleBrand;
    private UUID userId;
    private UUID vehicleId;
    private DateRangeResponse period;
    private BigDecimal totalAmount;
    private String status;
    private String email;
    private LocalDateTime createdAt;
}