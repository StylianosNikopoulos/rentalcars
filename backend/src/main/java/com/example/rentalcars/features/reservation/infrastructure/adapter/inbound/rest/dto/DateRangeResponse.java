package com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto;

import java.time.LocalDateTime;

public record DateRangeResponse(LocalDateTime start, LocalDateTime end) {}
