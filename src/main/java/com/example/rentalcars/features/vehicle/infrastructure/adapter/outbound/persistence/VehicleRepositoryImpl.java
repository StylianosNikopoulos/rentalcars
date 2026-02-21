package com.example.rentalcars.features.vehicle.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.vehicle.domain.model.Vehicle;
import com.example.rentalcars.features.vehicle.domain.port.outbound.VehicleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@AllArgsConstructor
public class VehicleRepositoryImpl implements VehicleRepository {

    private final VehicleJpaRepository jpaRepository;
    private final VehiclePersistenceMapper vehiclePersistenceMapper;

    @Override
    public Vehicle save(Vehicle vehicle) {
        var entity = vehiclePersistenceMapper.toEntity(vehicle);
        var saved = jpaRepository.save(entity);
        return vehiclePersistenceMapper.toDomain(saved);
    }

    @Override
    public Optional<Vehicle> findById(UUID id) {
        return jpaRepository.findById(id).map(vehiclePersistenceMapper::toDomain);
    }

    @Override
    public Optional<Vehicle> findByIdWithLock(UUID id) {
        return jpaRepository.findByIdWithLock(id).map(vehiclePersistenceMapper::toDomain);
    }

    @Override
    public List<Vehicle> findAllVehicles() {
        return jpaRepository.findAll().stream()
                .map(vehiclePersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public boolean existsByLicensePlate(String licensePlate) {
        return jpaRepository.findByLicensePlate(licensePlate).isPresent();
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
