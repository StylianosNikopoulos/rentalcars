package com.example.rentalcars.features.vehicle.infrastructure.adapter.inbound.rest.dto;

import com.example.rentalcars.features.vehicle.domain.model.FuelType;
import com.example.rentalcars.features.vehicle.domain.model.VehicleStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class VehicleResponse {
    private UUID id;
    private String brand;
    private String model;
    private int year;
    private FuelType fuelType;
    private String licensePlate;
    private VehicleStatus status;
    private BigDecimal dailyPrice;
}