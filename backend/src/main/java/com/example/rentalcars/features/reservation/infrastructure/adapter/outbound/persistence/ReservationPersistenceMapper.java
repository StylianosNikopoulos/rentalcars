package com.example.rentalcars.features.reservation.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.reservation.domain.model.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel =  "spring")
public interface ReservationPersistenceMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "period", expression = "java(new com.example.rentalcars.core.valueobject.DateRange(entity.getStartDate(), entity.getEndDate()))")
    @Mapping(target = "totalAmount", expression = "java(new com.example.rentalcars.core.valueobject.Money(entity.getTotalAmount(), \"EUR\"))")
    Reservation toDomain(ReservationJpaEntity entity);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "startDate", source = "period.start")
    @Mapping(target = "endDate", source = "period.end")
    @Mapping(target = "totalAmount", source = "totalAmount.amount")
    ReservationJpaEntity toEntity(Reservation domain);
}
