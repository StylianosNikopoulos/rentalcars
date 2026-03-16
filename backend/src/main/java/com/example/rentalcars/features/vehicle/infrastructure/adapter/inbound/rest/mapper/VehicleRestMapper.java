package com.example.rentalcars.features.vehicle.infrastructure.adapter.inbound.rest.mapper;

import com.example.rentalcars.features.vehicle.domain.model.Vehicle;
import com.example.rentalcars.features.vehicle.infrastructure.adapter.inbound.rest.dto.VehicleResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface VehicleRestMapper {

    @Mapping(target = "licensePlate", source = "licensePlate.value")
    VehicleResponse toResponse(Vehicle domain);

    List<VehicleResponse> toResponseList(List<Vehicle> domains);
}