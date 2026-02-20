package com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.mapper;

import com.example.rentalcars.features.reservation.domain.model.Reservation;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto.ReservationRequest;
import com.example.rentalcars.features.reservation.infrastructure.adapter.inbound.rest.dto.ReservationResponse;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ReservationRestMapper {
    Reservation toDomain(ReservationRequest request);
    ReservationResponse toResponse(Reservation domain);
    List<ReservationResponse> toResponseList(List<Reservation> domains);
}
