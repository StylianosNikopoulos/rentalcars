package com.example.rentalcars.features.vehicle.domain.port.outbound;

import com.example.rentalcars.features.vehicle.domain.model.Vehicle;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleRepository {
    Vehicle save(Vehicle vehicle);
    Optional<Vehicle> findById(UUID id);
    Optional<Vehicle> findByIdWithLock(UUID id);
    List<Vehicle> findAllVehicles();
    boolean existsByLicensePlate(String licensePlate);
    void deleteById(UUID id);
}
