package com.example.rentalcars.features.user.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.user.domain.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {CustomerProfilePersistenceMapper.class})
public interface UserPersistenceMapper {
    UserJpaEntity toEntity(User domain);
    User toDomain(UserJpaEntity entity);
}