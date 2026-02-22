package com.example.rentalcars.features.vehicle.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class Vehicle {
    private UUID id;
    private String brand;
    private String model;
    private int year;
    private FuelType fuelType;
    private LicensePlate licensePlate;
    private VehicleStatus status;
    private BigDecimal dailyPrice;
}