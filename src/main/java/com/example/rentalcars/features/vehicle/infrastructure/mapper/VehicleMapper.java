package com.example.rentalcars.features.vehicle.infrastructure.mapper;

import com.example.rentalcars.features.vehicle.controller.dto.VehicleResponse;
import com.example.rentalcars.features.vehicle.domain.Vehicle;
import com.example.rentalcars.features.vehicle.infrastructure.persistence.VehicleJpaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VehicleMapper {
    @Mapping(target = "licensePlate", source = "licensePlate.value")
    VehicleJpaEntity toEntity(Vehicle domain);
    @Mapping(target = "licensePlate", expression = "java(new com.example.rentalcars.features.vehicle.domain.LicensePlate(entity.getLicensePlate()))")
    Vehicle toDomain(VehicleJpaEntity entity);
    @Mapping(target = "licensePlate", source = "licensePlate.value")
    VehicleResponse toResponse(Vehicle domain);
}