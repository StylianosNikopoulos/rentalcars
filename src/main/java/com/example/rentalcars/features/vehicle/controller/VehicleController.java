package com.example.rentalcars.features.vehicle.controller;

import com.example.rentalcars.features.vehicle.controller.dto.VehicleRequest;
import com.example.rentalcars.features.vehicle.controller.dto.VehicleResponse;
import com.example.rentalcars.features.vehicle.infrastructure.mapper.VehicleMapper;
import com.example.rentalcars.features.vehicle.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final VehicleMapper vehicleMapper;

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles(){
        var vehicles = vehicleService.getAllVehicles().stream().map(vehicleMapper::toResponse).toList();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable UUID id){
        return ResponseEntity.ok(vehicleMapper.toResponse(vehicleService.getVehicleById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleRequest request){
        var vehicle = vehicleService.createVehicle(request);
        return new ResponseEntity<>(vehicleMapper.toResponse(vehicle), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> updateVehicle(@PathVariable UUID id, @Valid @RequestBody VehicleRequest request) {
        var updatedVehicle = vehicleService.updateVehicle(id,request);
        return ResponseEntity.ok(vehicleMapper.toResponse(updatedVehicle));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVehicle(@PathVariable UUID id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
