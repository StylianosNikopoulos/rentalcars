package com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.mapper;

import com.example.rentalcars.features.user.infrastructure.adapter.inbound.rest.dto.UserResponse;
import com.example.rentalcars.features.user.domain.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User domain);
}
