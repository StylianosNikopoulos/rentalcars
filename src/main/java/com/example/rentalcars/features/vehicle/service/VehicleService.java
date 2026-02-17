package com.example.rentalcars.features.vehicle.service;

import com.example.rentalcars.features.vehicle.controller.dto.VehicleRequest;
import com.example.rentalcars.features.vehicle.domain.Vehicle;
import java.util.List;
import java.util.UUID;

public interface VehicleService {
    Vehicle createVehicle(VehicleRequest request);
    List<Vehicle> getAllVehicles();
    Vehicle getVehicleById(UUID id);
    Vehicle updateVehicle(UUID id, VehicleRequest request);
    void deleteVehicle(UUID id);
}
