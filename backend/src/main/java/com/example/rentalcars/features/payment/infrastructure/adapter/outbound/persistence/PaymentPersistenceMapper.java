package com.example.rentalcars.features.payment.infrastructure.adapter.outbound.persistence;

import com.example.rentalcars.features.payment.domain.model.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentPersistenceMapper {
    @Mapping(target = "amount", source = "amount.amount")
    @Mapping(target = "currency", source = "amount.currency")
    PaymentJpaEntity toEntity(Payment payment);

    @Mapping(target = "amount", expression = "java(new com.example.rentalcars.core.valueobject.Money(entity.getAmount(), entity.getCurrency()))")
    Payment toDomain(PaymentJpaEntity entity);
}
