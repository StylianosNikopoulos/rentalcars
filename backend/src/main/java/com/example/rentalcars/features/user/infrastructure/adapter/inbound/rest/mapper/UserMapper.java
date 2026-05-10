package com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.mapper;

import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UserResponse;
import com.example.rentalcars.features.user.domain.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "profile.phoneNumber", target = "phoneNumber")
    @Mapping(source = "profile.address", target = "address")
    @Mapping(source = "profile.driverLicenseNumber", target = "driverLicenseNumber")
    UserResponse toResponse(User domain);
}
