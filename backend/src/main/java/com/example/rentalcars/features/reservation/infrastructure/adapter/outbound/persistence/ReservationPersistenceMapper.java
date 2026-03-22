package com.example.rentalcars.features.reservation.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.reservation.domain.model.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel =  "spring")
public interface ReservationPersistenceMapper {
    @Mapping(target = "period.start", source = "startDate")
    @Mapping(target = "period.end", source = "endDate")
    @Mapping(target = "totalAmount.amount", source = "totalAmount")
    @Mapping(target = "totalAmount.currency", constant = "EUR")
    Reservation toDomain(ReservationJpaEntity entity);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "startDate", source = "period.start")
    @Mapping(target = "endDate", source = "period.end")
    @Mapping(target = "totalAmount", source = "totalAmount.amount")
    ReservationJpaEntity toEntity(Reservation domain);
}
