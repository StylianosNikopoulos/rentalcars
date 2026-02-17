package com.example.rentalcars.features.vehicle.service;

import com.example.rentalcars.features.vehicle.controller.dto.VehicleRequest;
import com.example.rentalcars.features.vehicle.domain.Vehicle;
import com.example.rentalcars.features.vehicle.domain.VehicleRepository;
import com.example.rentalcars.features.vehicle.infrastructure.persistence.VehicleJpaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleJpaRepository jpaRepository;

    @Override
    @Transactional
    public Vehicle createVehicle(VehicleRequest request) {
        return null;
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return List.of();
    }

    @Override
    public Vehicle getVehicleById(UUID id) {
        return null;
    }

    @Override
    @Transactional
    public void deleteVehicle(UUID id) {

    }
}
