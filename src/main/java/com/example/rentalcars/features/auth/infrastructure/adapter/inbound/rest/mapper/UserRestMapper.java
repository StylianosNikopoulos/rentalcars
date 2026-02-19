package com.example.rentalcars.features.auth.infrastructure.adapter.inbound.rest.mapper;

import com.example.rentalcars.features.user.domain.model.User;
import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UserResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserRestMapper {
    UserResponse toResponse(User domain);
}