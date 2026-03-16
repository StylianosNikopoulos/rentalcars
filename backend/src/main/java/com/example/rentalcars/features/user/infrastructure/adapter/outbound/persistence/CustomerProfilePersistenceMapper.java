package com.example.rentalcars.features.user.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.user.domain.model.CustomerProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerProfilePersistenceMapper {

    @Mapping(target = "user", ignore = true)
    CustomerProfileEntity toEntity(CustomerProfile domain);

    CustomerProfile toDomain(CustomerProfileEntity entity);
}