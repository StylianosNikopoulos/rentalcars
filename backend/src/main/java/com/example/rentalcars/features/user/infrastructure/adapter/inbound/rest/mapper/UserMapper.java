package com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.mapper;

import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UserResponse;
import com.example.rentalcars.features.user.domain.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "phoneNumber", source = "profile.phoneNumber")
    @Mapping(target = "address", source = "profile.address")
    @Mapping(target = "driverLicenseNumber", source = "profile.driverLicenseNumber")
    UserResponse toResponse(User domain);
}
