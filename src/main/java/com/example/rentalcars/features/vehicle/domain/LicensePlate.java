package com.example.rentalcars.features.vehicle.domain;

public record LicensePlate(String value) {
    public LicensePlate{
        if (value == null || !value.matches("^[A-Z]{3}-?\\d{4}$")) {
            throw new IllegalArgumentException("Invalid license plate format");
        }
    }
}
