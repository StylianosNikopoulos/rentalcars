package com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.mapper;

import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto.ReservationRequest;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto.ReservationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReservationRestMapper {
    @Mapping(target = "period", expression = "java(new com.example.rentalcars.core.valueobject.DateRange(request.getStartDate(), request.getEndDate()))")
    Reservation toDomain(ReservationRequest request);

    @Mapping(target = "totalAmount", source = "totalAmount.amount")
    @Mapping(target = "period.start", source = "period.start")
    @Mapping(target = "period.end", source = "period.end")
    @Mapping(target = "vehicleName", source = "vehicleName")
    @Mapping(target = "vehicleBrand", source = "vehicleBrand")
    @Mapping(target = "email", source = "email")
    ReservationResponse toResponse(Reservation domain);
    List<ReservationResponse> toResponseList(List<Reservation> domains);
}
