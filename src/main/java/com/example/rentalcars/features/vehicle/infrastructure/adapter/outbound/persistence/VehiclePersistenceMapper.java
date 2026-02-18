package com.example.rentalcars.features.vehicle.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.vehicle.domain.model.Vehicle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VehiclePersistenceMapper {

    @Mapping(target = "licensePlate", source = "licensePlate.value")
    @Mapping(target = "version", ignore = true)
    VehicleJpaEntity toEntity(Vehicle domain);

    @Mapping(target = "licensePlate", expression = "java(new com.example.rentalcars.features.vehicle.domain.model.LicensePlate(entity.getLicensePlate()))")
    Vehicle toDomain(VehicleJpaEntity entity);
}