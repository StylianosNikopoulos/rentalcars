package com.example.rentalcars.features.reservation.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.reservation.domain.model.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel =  "spring")
public interface ReservationPersistenceMapper {
    Reservation toDomain(ReservationJpaEntity entity);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ReservationJpaEntity toEntity(Reservation domain);
}
