package com.example.rentalcars.features.vehicle.service;

import com.example.rentalcars.core.exception.BusinessException;
import com.example.rentalcars.core.valueobject.DateRange;
import com.example.rentalcars.features.vehicle.domain.port.inbound.VehicleService;
import com.example.rentalcars.features.vehicle.infrastructure.adapter.inbound.rest.dto.VehicleRequest;
import com.example.rentalcars.features.vehicle.domain.model.LicensePlate;
import com.example.rentalcars.features.vehicle.domain.model.Vehicle;
import com.example.rentalcars.features.vehicle.domain.port.outbound.VehicleRepository;
import com.example.rentalcars.features.vehicle.domain.model.VehicleStatus;
import com.example.rentalcars.features.vehicle.domain.exception.VehicleNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Override
    @Transactional
    public Vehicle createVehicle(VehicleRequest request) {

        if (vehicleRepository.existsByLicensePlate(request.getLicensePlate())){
            throw new BusinessException("Vehicle already exists", "DUPLICATE_LICENSE_PLATE");
        }

        var vehicle = Vehicle.builder()
                .brand(request.getBrand())
                .model(request.getModel())
                .year(request.getYear())
                .fuelType(request.getFuelType())
                .licensePlate(new LicensePlate(request.getLicensePlate()))
                .status(VehicleStatus.AVAILABLE)
                .dailyPrice(request.getDailyPrice())
                .build();

        return vehicleRepository.save(vehicle);
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAllVehicles();
    }

    @Override
    public Vehicle getVehicleById(UUID id) {
        return vehicleRepository.findById(id)
                .orElseThrow(()-> new VehicleNotFoundException(id));
    }

    @Override
    @Transactional
    public Vehicle updateVehicle(UUID id, VehicleRequest request) {
        Vehicle existingVehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException(id));

        Vehicle updatedVehicle = Vehicle.builder()
                .id(existingVehicle.getId())
                .version(existingVehicle.getVersion())
                .brand(request.getBrand())
                .model(request.getModel())
                .year(request.getYear())
                .fuelType(request.getFuelType())
                .licensePlate(new LicensePlate(request.getLicensePlate()))
                .status(existingVehicle.getStatus())
                .dailyPrice(request.getDailyPrice())
                .build();

        return vehicleRepository.save(updatedVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicle(UUID id) {
        if (vehicleRepository.findById(id).isEmpty()) {
            throw new VehicleNotFoundException(id);
        }
        vehicleRepository.deleteById(id);
    }

    @Override
    public List<Vehicle> getAvailableVehicles(LocalDateTime start, LocalDateTime end) {
        new DateRange(start, end);
        return vehicleRepository.findAvailableVehicles(start, end);
    }

    @Override
    @Transactional
    public void updateVehicleStatus(UUID vehicleId, VehicleStatus newStatus) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new VehicleNotFoundException(vehicleId));

        Vehicle updatedVehicle = Vehicle.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .fuelType(vehicle.getFuelType())
                .licensePlate(vehicle.getLicensePlate())
                .dailyPrice(vehicle.getDailyPrice())
                .version(vehicle.getVersion())
                .status(newStatus)
                .build();

        vehicleRepository.save(updatedVehicle);
    }
}
