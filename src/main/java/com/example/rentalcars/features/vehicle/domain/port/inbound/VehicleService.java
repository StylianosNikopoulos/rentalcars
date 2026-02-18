package com.example.rentalcars.features.vehicle.domain.port.inbound;

import com.example.rentalcars.features.vehicle.infrastructure.adapter.inbound.rest.dto.VehicleRequest;
import com.example.rentalcars.features.vehicle.domain.model.Vehicle;
import java.util.List;
import java.util.UUID;

public interface VehicleService {
    Vehicle createVehicle(VehicleRequest request);
    List<Vehicle> getAllVehicles();
    Vehicle getVehicleById(UUID id);
    Vehicle updateVehicle(UUID id, VehicleRequest request);
    void deleteVehicle(UUID id);
}
