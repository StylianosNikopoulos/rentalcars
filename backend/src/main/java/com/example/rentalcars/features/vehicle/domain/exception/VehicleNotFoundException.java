package com.example.rentalcars.features.vehicle.domain.exception;

import com.example.rentalcars.core.exception.NotFoundException;
import java.util.UUID;

public class VehicleNotFoundException extends NotFoundException {

    public VehicleNotFoundException(UUID id) {
        super("Vehicle with ID " + id + " not found", "VEHICLE_NOT_FOUND");
    }

    public VehicleNotFoundException(String licensePlate) {
        super("Vehicle with license plate " + licensePlate + " not found", "VEHICLE_NOT_FOUND");
    }
}