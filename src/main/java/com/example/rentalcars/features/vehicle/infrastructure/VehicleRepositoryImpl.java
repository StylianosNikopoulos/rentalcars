package com.example.rentalcars.features.vehicle.infrastructure;

import com.example.rentalcars.features.vehicle.domain.Vehicle;
import com.example.rentalcars.features.vehicle.domain.VehicleRepository;
import com.example.rentalcars.features.vehicle.infrastructure.mapper.VehicleMapper;
import com.example.rentalcars.features.vehicle.infrastructure.persistence.VehicleJpaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@AllArgsConstructor
public class VehicleRepositoryImpl implements VehicleRepository {

    private final VehicleJpaRepository jpaRepository;
    private final VehicleMapper vehicleMapper;

    @Override
    public Vehicle save(Vehicle vehicle) {
        var entity = vehicleMapper.toEntity(vehicle);
        var saved = jpaRepository.save(entity);
        return vehicleMapper.toDomain(saved);
    }

    @Override
    public Optional<Vehicle> findById(UUID id) {
        return jpaRepository.findById(id).map(vehicleMapper::toDomain);
    }

    @Override
    public List<Vehicle> findAllVehicles() {
        return jpaRepository.findAll().stream()
                .map(vehicleMapper::toDomain)
                .toList();
    }
}
