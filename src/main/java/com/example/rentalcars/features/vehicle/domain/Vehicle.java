package com.example.rentalcars.features.vehicle.domain;

import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Builder
public class Vehicle {
    private final UUID id;
    private final String brand;
    private final String model;
    private final int year;
    private final FuelType fuelType;
    private final LicensePlate licensePlate;
    private final VehicleStatus status;
    private final BigDecimal dailyPrice;
}