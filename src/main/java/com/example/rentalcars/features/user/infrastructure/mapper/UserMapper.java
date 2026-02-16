package com.example.rentalcars.features.user.infrastructure.mapper;

import com.example.rentalcars.features.user.controller.dto.UserResponse;
import com.example.rentalcars.features.user.domain.User;
import com.example.rentalcars.features.user.infrastructure.persistence.UserJpaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserJpaEntity toEntity(User domain);
    User toDomain(UserJpaEntity entity);
    UserResponse toResponse(User domain);
}
